import React, {useState, useEffect, useContext, useMemo} from 'react';

import {View, StyleSheet, ScrollView, RefreshControl, Text} from 'react-native';
import {Picker} from '@react-native-community/picker';
import {CustomHeader, ExtendedItemCard, ItemBatchInfo} from '../components';

import {getTotalItemNumberOnBatch} from '../utils/helper';
import {AuthContext} from '../context';
import {getItems, getFacilities, getBatchesByFacilityId} from '../utils/routes';
import {APP_THEME} from '../utils/constants';
import {useFetch} from '../hooks';

const FacilityPicker = ({facilities, selectedFacility, onChangeFacility}) => {
  return (
    <View style={styles.facilityPickerContainer}>
      <Picker
        style={{height: 24}}
        selectedValue={selectedFacility}
        onValueChange={(value, index) => onChangeFacility(value)}
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
    </View>
  );
};

export const Inventory = ({navigation}) => {
  const {getUser} = useContext(AuthContext);
  const {api_token, roles, facility_id} = getUser();

  const [selectedFacility, setSelectedFacility] = useState('');
  const {
    data: items,
    isLoading: itemsLoading,
    doFetch: doFetchItems,
  } = useFetch();
  const {data: facilities, doFetch: doFetchFacilities} = useFetch();
  const {data: batches, doFetch: doFetchBatches} = useFetch();

  const mSelectedFacility = useMemo(() => {
    return selectedFacility;
  }, [selectedFacility]);

  const mUserFacilities = useMemo(() => {
    if (roles != 'admin' && facilities) {
      return facilities.filter(faci => faci.id === facility_id);
    }
    return facilities;
  }, [facilities]);

  const handleReloadItems = async () => {
    getItems(api_token, doFetchItems);
  };

  const handleGetFacilities = async () => {
    getFacilities(api_token, doFetchFacilities);
  };

  const handleGetBatches = async facilityId => {
    getBatchesByFacilityId(api_token, facilityId, doFetchBatches);
  };

  const handleFacilityPickerChange = newValue => setSelectedFacility(newValue);

  useEffect(() => {
    return navigation.addListener('focus', () => {
      handleReloadItems()
        .then(handleGetFacilities)
        .then(() => handleGetBatches(mSelectedFacility));
    });
  }, []);

  useEffect(() => {
    if (selectedFacility) handleGetBatches(selectedFacility);
  }, [selectedFacility]);

  return (
    <View style={styles.container}>
      <CustomHeader
        title={'Inventory'}
        LeftComponentFunc={() => navigation.openDrawer()}
      />

      <View style={{paddingHorizontal: 16, marginBottom: 24}}>
        <Text style={{fontWeight: 'bold'}}>Facility</Text>
        <FacilityPicker
          facilities={mUserFacilities}
          selectedFacility={mSelectedFacility}
          onChangeFacility={handleFacilityPickerChange}
        />
      </View>

      <Text style={{fontWeight: 'bold', marginLeft: 16}}>Items</Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={itemsLoading}
            onRefresh={handleReloadItems}
          />
        }>
        {items &&
          items.map((item, index) => {
            return (
              <ExtendedItemCard
                key={index}
                title={item.item_name}
                category={item.category}
                numberOfPieces={getTotalItemNumberOnBatch(batches, item.id)}>
                <ItemBatchInfo
                  navigation={navigation}
                  item={item}
                  facilityId={mSelectedFacility}
                />
              </ExtendedItemCard>
            );
          })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  facilityPickerContainer: {
    flexGrow: 1,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#B7B7B7',
  },
  itemBatchesLayout: {
    paddingVertical: 10,
    paddingHorizontal: 0,
    backgroundColor: '#F1F3F4',
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
  },
  itemBatchesHeader: {
    color: '#C0C0C0',
    fontSize: 11,
    marginBottom: 4,
  },
  itemBatchesInfo: {
    flex: 1,
    alignItems: 'center',
  },
  adjustInventoryButton: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: APP_THEME.primaryColor,
    borderRadius: 8,
  },
  adjustInventoryButtonTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
