import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Picker,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import {CustomHeader, RequestCard, ErrorHandlingField} from '../components';
import {StatusOverlay} from '../overlays';

import {AuthContext} from '../context';

import {APP_THEME} from '../utils/constants';
import {
  getFacilities,
  getRequestInventory,
  cancelRequestInventory,
} from '../utils/api';

let lastSelectedFacility = 0;
let copyOfAllRequests = [];

const AddItemButton = ({navigation}) => (
  <Button
    icon={<Icon name="plus" size={16} color="white" type="font-awesome-5" />}
    buttonStyle={{backgroundColor: '#065617', borderRadius: 20}}
    onPress={() => navigation.navigate('AddRequestInventory', undefined)}
  />
);

export const RequestInventoryScreen = ({navigation}) => {
  const {getUser} = useContext(AuthContext);
  const {api_token} = getUser();

  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [requests, setRequests] = useState([]);

  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = async requestInventoryId => {
    setIsLoading(true);
    const response = await cancelRequestInventory(
      api_token,
      requestInventoryId,
    );
    if (response) {
      const updatedRequests = await getRequestInventory(
        api_token,
        lastSelectedFacility,
      );
      setRequests(updatedRequests);
    }
    setIsLoading(false);
  };

  const filterData = (filter, data = copyOfAllRequests) => {
    if (filter === 'all') {
      setRequests(data);
      return;
    }

    const filteredRequests = data.filter(data => data.status === filter);
    setRequests(filteredRequests);
  };

  useEffect(() => {
    return navigation.addListener('focus', () => {
      getFacilities(api_token).then(data => setFacilities(data));
      if (lastSelectedFacility != 0) {
        getRequestInventory(api_token, lastSelectedFacility).then(data => {
          copyOfAllRequests = data;
          filterData(activeFilter, data);
        });
      }
    });
  }, []);

  useEffect(() => {
    getRequestInventory(api_token, selectedFacility).then(data => {
      copyOfAllRequests = data;
      filterData(activeFilter, data);
    });
  }, [selectedFacility]);

  useEffect(() => {
    filterData(activeFilter);
  }, [activeFilter]);

  return (
    <View style={styles.container}>
      <CustomHeader
        title={'Request Inventory'}
        LeftComponentFunc={() => navigation.openDrawer()}
        RightComponent={<AddItemButton navigation={navigation} />}
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

      <StatusOverlay
        isOpen={isStatusFilterOpen}
        setIsOpen={setIsStatusFilterOpen}
        items={['all', 'pending']}
        setActiveFilter={setActiveFilter}
      />

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

              {request.status === 'pending' && request.active === 1 && (
                <View style={{flexDirection: 'row', marginTop: 12}}>
                  <Button
                    onPress={() => {
                      navigation.navigate('AddRequestInventory', request);
                    }}
                    title={' Edit '}
                    buttonStyle={{
                      backgroundColor: APP_THEME.primaryColor,
                      borderRadius: 8,
                    }}
                    containerStyle={{flexGrow: 1, margin: 12}}
                  />
                  <Button
                    title={'Cancel'}
                    loading={isLoading}
                    onPress={() => handleCancel(request.id)}
                    buttonStyle={{backgroundColor: '#E74C3C', borderRadius: 8}}
                    containerStyle={{flexGrow: 1, margin: 12}}
                  />
                </View>
              )}

              {request.status != 'pending' && request.active === 1 && (
                <Text
                  style={{
                    alignSelf: 'center',
                    fontSize: 16,
                    fontWeight: 'bold',
                    marginTop: 12,
                    color: APP_THEME.primaryColor,
                  }}>
                  This request is waiting for confirmation from supplying
                  facility
                </Text>
              )}

              {request.active === 0 && (
                <Text
                  style={{
                    alignSelf: 'center',
                    fontSize: 16,
                    fontWeight: 'bold',
                    marginTop: 12,
                    color:
                      request.status === 'pending'
                        ? 'red'
                        : APP_THEME.primaryColor,
                  }}>
                  {request.status === 'pending'
                    ? 'This request is cancelled'
                    : 'This request has already been received'}
                </Text>
              )}
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
