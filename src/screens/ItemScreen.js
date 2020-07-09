import React, {useState, useEffect, useContext} from 'react';
import {View, Text, StyleSheet, ScrollView, Picker} from 'react-native';
import {Divider} from 'react-native-elements';
import {CustomHeader, InfoBlock, ItemCard} from '../components';

import {
  getUserById,
  getTagColor,
  getTagLabelColor,
  getTotalItemCount,
} from '../utils/helper';
import {AuthContext} from '../context';
import {POPCOM_URL, APP_THEME} from '../utils/constants';

import {MockApiContext} from '../utils/mockAPI';

const ItemExtension = ({itemDetails}) => {
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
    </View>
  );
};

export const ItemScreen = ({route, navigation}) => {
  const {
    category,
    image,
    item_description,
    item_name,
    item_sku,
    created_by,
    id,
  } = route.params;

  const {getUser} = useContext(AuthContext);
  const {api_token} = getUser();

  const {lotNumbers} = useContext(MockApiContext);

  const [createdByUser, setCreatedByUser] = useState('');
  const [selectedFacility, setselectedFacility] = useState('');
  const [facilities, setFacilities] = useState([]);

  const [itemBatches, setItemBatches] = useState([]);

  useEffect(() => {
    return navigation.addListener('focus', () => {
      console.log(route.params);
    });
  }, []);

  const getItemBatches = async () => {
    const urlParams = new URLSearchParams({api_token: api_token, item_id: id});
    const endpoint = `${POPCOM_URL}/api/get-item-batches?${urlParams.toString()}`;
    const request = await fetch(endpoint, {method: 'post'});

    if (!request.ok) {
      alert('failed to get batches');
      return;
    }

    const response = await request.json();
    setItemBatches(response.data);
  };

  const getFacilities = async () => {
    const urlParams = new URLSearchParams({api_token});
    const endpoint = `${POPCOM_URL}/api/get-facilities?${urlParams.toString()}`;

    const request = await fetch(endpoint);

    if (!request.ok) {
      alert('failed to get list of facilities');
      return;
    }

    const responseJson = await request.json();
    setFacilities(responseJson.data);
  };

  const getUsers = async () => {
    const createdBy = await getUserById(created_by, api_token);
    setCreatedByUser(createdBy.data.first_name);
  };

  useEffect(() => {
    getUsers();
    getFacilities();
    getItemBatches();
  }, [route]);

  return (
    <View style={styles.container}>
      <CustomHeader
        title={item_name}
        type={1}
        LeftComponentFunc={() => {
          navigation.goBack();
        }}
        subHeader={`Created by: ${createdByUser}`}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{paddingHorizontal: 24, marginBottom: 12}}>
          <Divider style={styles.dividerStyle} />

          <Text style={{color: '#B9BABA', fontSize: 16}}>ITEM DETAILS</Text>

          <InfoBlock
            header={'Barcode / SKU'}
            subHeader={item_sku}
            iconName={'barcode'}
            containerStyle={{
              marginLeft: 12,
              marginVertical: 8,
            }}
          />

          <InfoBlock
            header={'Category'}
            subHeader={category}
            iconName={'edit'}
            containerStyle={{
              marginLeft: 12,
              marginVertical: 8,
            }}
          />

          <InfoBlock
            header={'Description'}
            subHeader={item_description}
            iconName={'list'}
            containerStyle={{
              marginLeft: 12,
              marginVertical: 8,
            }}
          />

          <Divider style={styles.dividerStyle} />

          <Text style={{color: '#B9BABA', fontSize: 16}}>Inventory</Text>

          <Text
            style={{
              color: 'gray',
              fontSize: 12,
              marginTop: 12,
              marginLeft: 4,
              marginBottom: 2,
            }}>
            Facility
          </Text>
          <View style={APP_THEME.inputContainerStyle}>
            <Picker
              style={{height: 37}}
              selectedValue={selectedFacility}
              onValueChange={(value, index) => setselectedFacility(value)}
              mode={'dropdown'}>
              {facilities.map((item, index) => (
                <Picker.Item
                  key={index}
                  value={item.id}
                  label={item.facility_name}
                />
              ))}
            </Picker>
          </View>
        </View>

        <ItemCard
          title={item_name}
          price={getTotalItemCount(lotNumbers.filter(num => num.itemId === id))}
          defaultCollapsed={false}
          tag={category}
          tagColor={getTagColor(category)}
          tagLabelColor={getTagLabelColor(category)}
          type={1}>
          <ItemExtension itemDetails={itemBatches} />
        </ItemCard>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9FC',
  },
  dividerStyle: {color: '#B9BABA', height: 1, marginVertical: 10},
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
