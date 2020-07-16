import React, {useState, useEffect, useContext} from 'react';

import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Picker,
} from 'react-native';

import {CustomHeader, ItemCard, InventoryExtension} from '../components';

import {getTagColor, getTagLabelColor} from '../utils/helper';
import {AuthContext} from '../context';
import {POPCOM_URL} from '../utils/constants';

import {useFetch} from '../hooks';

let lastSelectedFacility = 0;

const FacilityPicker = ({facilities, selectedFacility, onChangeFacility}) => {
  return (
    <View
      style={{
        flexGrow: 1,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#B7B7B7',
      }}>
      <Picker
        style={{height: 24}}
        selectedValue={selectedFacility}
        onValueChange={(value, index) => onChangeFacility(value)}
        mode={'dropdown'}>
        {facilities.map((item, index) => (
          <Picker.Item key={index} value={item.id} label={item.facility_name} />
        ))}
      </Picker>
    </View>
  );
};

export const InventoryScreen = ({navigation}) => {
  const [items, setItems] = useState([]);
  const {getUser} = useContext(AuthContext);
  const {api_token} = getUser();
  const {data, errorMessage, isLoading, fetchData} = useFetch();

  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState('');

  const [batches, setBatches] = useState([]);

  const fetchItems = async () => {
    const endpoint = `${POPCOM_URL}/api/get-items?api_token=${api_token}`;
    const options = {
      headers: {
        accept: 'application/json',
      },
      method: 'post',
    };
    fetchData(endpoint, options, () => alert('Failed to get list of items'));
  };

  const fetchFacilities = async () => {
    const endpoint = `${POPCOM_URL}/api/get-facilities?api_token=${api_token}`;
    const request = await fetch(endpoint, {});

    if (!request.ok) {
      console.log('there was a problem fetching the facilities');
      return;
    }

    const responseJson = await request.json();
    setFacilities(responseJson.data);
  };

  const getFacilityBatchById = async facilityId => {
    const body = {
      api_token: api_token,
      facility_id: facilityId,
    };
    const endpoint = `${POPCOM_URL}/api/get-facility-batches`;
    const request = await fetch(endpoint, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!request.ok) {
      alert('there was a problem fetching the facility batches');
      return;
    }

    const response = await request.json();
    setBatches(response.data);
  };

  useEffect(() => {
    return navigation.addListener('focus', () => {
      fetchItems();
      fetchFacilities().then(() => getFacilityBatchById(lastSelectedFacility));
    });
  }, []);

  useEffect(() => {
    if (data) setItems(data.data);
  }, [data]);

  useEffect(() => {
    getFacilityBatchById(selectedFacility);
  }, [selectedFacility]);

  return (
    <View style={styles.container}>
      <CustomHeader
        title={'Inventory'}
        LeftComponentFunc={() => navigation.openDrawer()}
        RightComponent={
          <FacilityPicker
            facilities={facilities}
            selectedFacility={selectedFacility}
            onChangeFacility={sf => {
              setSelectedFacility(sf);
              if (sf != '') lastSelectedFacility = sf;
            }}
          />
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => fetchItems()}
          />
        }>
        {items.map((item, index) => {
          return (
            <ItemCard
              title={item.item_name}
              price={batches
                .filter(batch => batch.item.id === item.id)
                .reduce((total, item) => {
                  return total + item.quantity;
                }, 0)}
              tag={item.category}
              tagColor={getTagColor(item.category)}
              tagLabelColor={getTagLabelColor(item.category)}
              showAdjustInventoryButton={true}
              type={1}>
              <InventoryExtension
                navigation={navigation}
                facilityId={selectedFacility}
                item={item}
                itemDetails={batches.filter(batch => batch.item.id === item.id)}
              />
            </ItemCard>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9FC',
  },
});
