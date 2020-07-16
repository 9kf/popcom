import React, {useState, useEffect, useContext} from 'react';
import * as R from 'ramda';

import {View, Text, StyleSheet, Picker, ScrollView} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import {CustomHeader, RequestCard, ErrorHandlingField} from '../components';
import {StatusOverlay} from '../overlays';

import {AuthContext} from '../context';

import {APP_THEME} from '../utils/constants';
import {
  getFacilities,
  getTransferInventories,
  receiveInventory,
} from '../utils/api';
import {TouchableOpacity} from 'react-native-gesture-handler';

let lastSelectedFacility = 0;
let copyOfAllRequests = [];

export const ReceiveInventoryScreen = ({navigation}) => {
  const {getUser} = useContext(AuthContext);
  const {api_token} = getUser();

  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [requests, setRequests] = useState([]);

  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  const [isLoading, setIsLoading] = useState(false);

  const removeLinesAndRequest = R.pipe(
    R.dissoc('request'),
    R.dissoc('lines'),
  );

  const mapRequests = async requests => {
    const newRequestData = requests.map(r => {
      return {
        ...r.request[0],
        items: [...r.lines],
        transferDetails: removeLinesAndRequest(r),
      };
    });

    copyOfAllRequests = newRequestData;

    if (activeFilter != 'all') {
      const filteredRequests = newRequestData.filter(
        data => data.transferDetails.status === activeFilter,
      );
      setRequests(filteredRequests);
      return;
    }

    setRequests(newRequestData);
  };

  const handleOnReceivedButton = async inventoryTransferId => {
    setIsLoading(true);
    const response = await receiveInventory(api_token, inventoryTransferId);

    if (response) {
      getTransferInventories(api_token, lastSelectedFacility).then(data => {
        mapRequests(data);
      });
    }

    setIsLoading(false);
  };

  useEffect(() => {
    return navigation.addListener('focus', () => {
      getFacilities(api_token).then(data => setFacilities(data));
      if (lastSelectedFacility != 0) {
        getTransferInventories(api_token, lastSelectedFacility).then(data => {
          mapRequests(data);
        });
      }
    });
  }, []);

  useEffect(() => {
    if (selectedFacility) {
      getTransferInventories(api_token, selectedFacility).then(data => {
        mapRequests(data);
      });
    }
  }, [selectedFacility]);

  useEffect(() => {
    const filteredRequests = copyOfAllRequests.filter(
      data => data.transferDetails.status === activeFilter,
    );
    setRequests(filteredRequests);
  }, [activeFilter]);

  return (
    <View style={styles.container}>
      <CustomHeader
        title={'Receive Inventory'}
        LeftComponentFunc={() => navigation.openDrawer()}
      />

      <StatusOverlay
        isOpen={isStatusFilterOpen}
        setIsOpen={setIsStatusFilterOpen}
        setActiveFilter={setActiveFilter}
        items={['all', 'in transit', 'received']}
      />

      <View
        style={{
          paddingHorizontal: 16,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <ErrorHandlingField
          title={'Facility'}
          style={APP_THEME.inputContainerStyle}>
          <Picker
            style={{height: 37}}
            selectedValue={selectedFacility}
            onValueChange={(value, index) => {
              setSelectedFacility(value);
              if (value != '') lastSelectedFacility = value;
            }}
            mode={'dropdown'}>
            {facilities.map((item, index) => (
              <Picker.Item
                key={index}
                value={item.id}
                label={item.facility_name}
              />
            ))}
          </Picker>
        </ErrorHandlingField>

        <TouchableOpacity onPress={() => setIsStatusFilterOpen(true)}>
          <Icon
            name="filter"
            size={16}
            color="black"
            type="font-awesome-5"
            containerStyle={{marginLeft: 12}}
          />
        </TouchableOpacity>
      </View>

      <ScrollView>
        {requests.map(request => {
          const supplyingFacilityName = facilities.filter(
            f => f.id === request.supplying_facility_id,
          )[0]?.facility_name;
          const receivingFacilityName = facilities.filter(
            f => f.id === request.receiving_facility_id,
          )[0]?.facility_name;

          return (
            <RequestCard
              key={request.id}
              request={request}
              supplyingFacilityName={supplyingFacilityName}
              receivingFacilityName={receivingFacilityName}>
              <View style={{flexDirection: 'row'}}>
                <Text style={{color: '#B4B4B4'}}>ITEM NAME</Text>
                <View style={{flexGrow: 1}} />
                <Text style={{color: '#B4B4B4'}}>REQUESTED QTY</Text>
              </View>

              {request.items.map(item => {
                return (
                  <View key={item.id} style={{flexDirection: 'row'}}>
                    <Text>{item.item.item_name}</Text>
                    <View style={{flexGrow: 1}} />
                    <Text>{`${item.quantity} ea`}</Text>
                  </View>
                );
              })}

              {request.transferDetails.status === 'in transit' ? (
                <View style={{flexDirection: 'row', marginTop: 12}}>
                  <Button
                    onPress={() =>
                      handleOnReceivedButton(request.inventory_transfer_id)
                    }
                    loading={isLoading}
                    title={'Received'}
                    buttonStyle={{
                      backgroundColor: APP_THEME.primaryColor,
                      borderRadius: 8,
                    }}
                    containerStyle={{flexGrow: 1, margin: 12}}
                  />
                </View>
              ) : (
                <Text
                  style={{
                    alignSelf: 'center',
                    fontSize: 16,
                    fontWeight: 'bold',
                    marginTop: 12,
                    color: APP_THEME.primaryColor,
                  }}>
                  This request has already been received
                </Text>
              )}

              {/* {request.transferDetails.status != 'in transit' && (
                <Text
                  style={{
                    alignSelf: 'center',
                    fontSize: 16,
                    fontWeight: 'bold',
                    marginTop: 12,
                    color: APP_THEME.primaryColor,
                  }}>
                  This request has already been received
                </Text>
              )} */}
            </RequestCard>
          );
        })}
        <View style={{margin: 12}} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
