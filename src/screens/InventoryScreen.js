import React, {useState, useEffect, useContext} from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Picker,
} from 'react-native';

import {Button} from 'react-native-elements';

import {CustomHeader, ItemCard, ErrorHandlingField} from '../components';

import {
  getTagColor,
  getTagLabelColor,
  getTotalItemCount,
} from '../utils/helper';
import {AuthContext} from '../context';
import {POPCOM_URL, APP_THEME} from '../utils/constants';

import {MockApiContext} from '../utils/mockAPI';
import {useFetch} from '../hooks';

const InventoryExtension = ({itemDetails}) => {
  return (
    <View style={styles.itemDetailsLayout}>
      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 1, paddingLeft: 12}}>
          <Text style={styles.itemDetailsHeader}>BATCH/LOT NO.</Text>
          {itemDetails.map((item, index) => {
            return (
              <Text key={index} style={{fontWeight: 'bold'}}>
                {item.number}
              </Text>
            );
          })}
        </View>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text style={styles.itemDetailsHeader}>EXPIRY DATE</Text>
          {itemDetails.map((item, index) => {
            return (
              <Text key={index} style={{color: '#C0C0C0'}}>
                {new Date(item.expiry).toLocaleDateString()}
              </Text>
            );
          })}
        </View>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text style={styles.itemDetailsHeader}>QTY</Text>
          {itemDetails.map((item, index) => {
            return <Text key={index}>{`${item.quantity} ea`}</Text>;
          })}
        </View>
      </View>
      <Button
        title={'Adjust Inventory'}
        buttonStyle={{
          marginHorizontal: 20,
          marginTop: 16,
          backgroundColor: APP_THEME.primaryColor,
          borderRadius: 8,
        }}
        titleStyle={{
          fontSize: 14,
          fontWeight: 'bold',
        }}
        type={'solid'}
      />
    </View>
  );
};

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
  const {lotNumbers} = useContext(MockApiContext);

  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState('');

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
      console.log('error');
      return;
    }

    const responseJson = await request.json();
    setFacilities(responseJson.data);
  };

  useEffect(() => {
    return navigation.addListener('focus', () => {
      fetchItems();
      fetchFacilities();
    });
  }, []);

  useEffect(() => {
    if (data) setItems(data.data);
  }, [data]);

  return (
    <View style={styles.container}>
      <CustomHeader
        title={'Inventory'}
        LeftComponentFunc={() => navigation.openDrawer()}
        RightComponent={
          <FacilityPicker
            facilities={facilities}
            selectedFacility={selectedFacility}
            onChangeFacility={sf => setSelectedFacility(sf)}
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
              price={getTotalItemCount(
                lotNumbers.filter(num => num.itemId === item.id),
              )}
              tag={item.category}
              tagColor={getTagColor(item.category)}
              tagLabelColor={getTagLabelColor(item.category)}
              showAdjustInventoryButton={true}
              type={1}>
              <InventoryExtension
                itemDetails={lotNumbers.filter(num => num.itemId === item.id)}
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
  itemDetailsLayout: {
    paddingVertical: 10,
    paddingHorizontal: 0,
    backgroundColor: '#F1F3F4',
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
  },
  itemDetailsHeader: {
    color: '#C0C0C0',
    fontSize: 11,
    marginBottom: 4,
  },
});
