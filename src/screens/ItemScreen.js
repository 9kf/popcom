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

  useEffect(() => {
    return navigation.addListener('focus', () => {
      console.log(route.params);
    });
  }, []);

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
          details={lotNumbers.filter(num => num.itemId === id)}
          type={1}
        />
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
});
