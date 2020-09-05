import React, {useState, useEffect, useContext, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {Picker} from '@react-native-community/picker';
import {Button, Icon} from 'react-native-elements';
import {CustomHeader, RequestCard, ErrorHandlingField} from '../components';
import {StatusOverlay} from '../overlays';

import {AuthContext} from '../context';
import {APP_THEME} from '../utils/constants';
import {getFacilityNameFromId, getUserFacilities} from '../utils/helper';
import {
  getFacilities,
  getInventoryRequests,
  cancelInventoryRequest,
} from '../utils/routes';
import {useFetch} from '../hooks';

const AddItemButton = ({navigation}) => (
  <Button
    icon={<Icon name="plus" size={16} color="white" type="font-awesome-5" />}
    buttonStyle={{backgroundColor: '#065617', borderRadius: 20}}
    onPress={() => navigation.navigate('AddRequestInventory', undefined)}
  />
);

export const RequestInventoryScreen = ({navigation}) => {
  const {getUser} = useContext(AuthContext);
  const {api_token, roles, id} = getUser();

  const {data: facilities, doFetch: fetchFacilities} = useFetch(
    getUserFacilities(roles, id),
  );
  const {
    data: inventoryRequests,
    isLoading: loadingInventoryRequests,
    doFetch: fetchInventoryRequests,
  } = useFetch();

  const [selectedFacility, setSelectedFacility] = useState(null);
  const mSelectedFacility = useMemo(() => {
    return selectedFacility;
  }, [selectedFacility]);

  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  const [isLoading, setIsLoading] = useState(false);

  const mRequests = useMemo(() => {
    const pendingRequests = inventoryRequests
      ? inventoryRequests.filter(request => request.status === 'pending')
      : [];

    if (activeFilter === 'pending')
      return pendingRequests.filter(request => request.active);

    if (activeFilter === 'cancelled')
      return pendingRequests.filter(request => !request.active);

    return pendingRequests;
  }, [inventoryRequests, activeFilter]);

  const handleCancel = requestInventoryId => async () => {
    setIsLoading(true);
    const response = await cancelInventoryRequest(
      api_token,
      requestInventoryId,
    );
    if (response) {
      getInventoryRequests(
        api_token,
        mSelectedFacility,
        fetchInventoryRequests,
      );
    }
    setIsLoading(false);
  };

  const handleReloadRequests = () => {
    getInventoryRequests(api_token, mSelectedFacility, fetchInventoryRequests);
  };

  useEffect(() => {
    return navigation.addListener('focus', () => {
      getFacilities(api_token, fetchFacilities);
      handleReloadRequests();
    });
  }, []);

  useEffect(() => {
    handleReloadRequests();
  }, [selectedFacility]);

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
            }}
            mode={'dropdown'}>
            {facilities &&
              facilities.map((item, index) => (
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
        items={['all', 'pending', 'cancelled']}
        setActiveFilter={setActiveFilter}
      />

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={loadingInventoryRequests}
            onRefresh={handleReloadRequests}
          />
        }
        showsVerticalScrollIndicator={false}>
        {mRequests.map(request => {
          const supplyingFacilityName = getFacilityNameFromId(
            request.supplying_facility_id,
            facilities,
          );
          const receivingFacilityName = getFacilityNameFromId(
            request.receiving_facility_id,
            facilities,
          );
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
                    onPress={handleCancel(request.id)}
                    buttonStyle={{backgroundColor: '#E74C3C', borderRadius: 8}}
                    containerStyle={{flexGrow: 1, margin: 12}}
                  />
                </View>
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
    backgroundColor: 'white',
  },
});
