import React from 'react';

import {View, Text, StyleSheet, ScrollView} from 'react-native';

import {CustomHeader, ItemCard} from '../components';

import {Button, Icon} from 'react-native-elements';

const AddFacilityButton = ({navigation}) => (
  <Button
    onPress={() => navigation.navigate('AddFacility')}
    icon={<Icon name="plus" size={16} color="white" type="font-awesome-5" />}
    buttonStyle={{backgroundColor: '#065617', borderRadius: 20}}
  />
);

export const FacilitiesScreen = ({navigation}) => {
  const items = [
    {
      title: 'Lutopan Rural Facility',
      count: 5,
      tag: 'RHU',
      price: 2500,
      tagColor: '#D5EAFF',
      tagLabelColor: '#55AAED',
      itemDetails: [
        {
          lotNumber: '2020-3021',
          expiryDate: new Date(),
          quantity: 1000,
        },
        {
          lotNumber: '2020-3021',
          expiryDate: new Date(),
          quantity: 1000,
        },
        {
          lotNumber: '2020-3021',
          expiryDate: new Date(),
          quantity: 1000,
        },
      ],
    },
    {
      title: 'Argao Rural Facility',
      count: 2,
      tag: 'RHU',
      price: 2600,
      tagColor: '#D5EAFF',
      tagLabelColor: '#55AAED',
      itemDetails: [
        {
          lotNumber: '2020-3021',
          expiryDate: new Date(),
          quantity: 1000,
        },
        {
          lotNumber: '2020-3021',
          expiryDate: new Date(),
          quantity: 1000,
        },
        {
          lotNumber: '2020-3021',
          expiryDate: new Date(),
          quantity: 1000,
        },
      ],
    },
    {
      title: 'Talisay Municipal Facility',
      count: 0,
      tag: 'MHC',
      price: 1600,
      tagColor: '#FED7E5',
      tagLabelColor: '#F288B9',
      itemDetails: [
        {
          lotNumber: '2020-3021',
          expiryDate: new Date(),
          quantity: 1000,
        },
        {
          lotNumber: '2020-3021',
          expiryDate: new Date(),
          quantity: 1000,
        },
        {
          lotNumber: '2020-3021',
          expiryDate: new Date(),
          quantity: 1000,
        },
      ],
    },
    {
      title: 'Panglao Municipal Facility',
      count: 6,
      tag: 'CHO',
      price: 780,
      tagColor: '#CCFAED',
      tagLabelColor: '#39CAAD',
      itemDetails: [
        {
          lotNumber: '2020-3021',
          expiryDate: new Date(),
          quantity: 1000,
        },
        {
          lotNumber: '2020-3021',
          expiryDate: new Date(),
          quantity: 1000,
        },
        {
          lotNumber: '2020-3021',
          expiryDate: new Date(),
          quantity: 1000,
        },
      ],
    },
    {
      title: 'Toledo Municipal Facility',
      count: 6,
      tag: 'CHO',
      price: 780,
      tagColor: '#CCFAED',
      tagLabelColor: '#39CAAD',
      itemDetails: [
        {
          lotNumber: '2020-3021',
          expiryDate: new Date(),
          quantity: 1000,
        },
        {
          lotNumber: '2020-3021',
          expiryDate: new Date(),
          quantity: 1000,
        },
        {
          lotNumber: '2020-3021',
          expiryDate: new Date(),
          quantity: 1000,
        },
      ],
    },
    {
      title: 'Naga Rural Facility',
      count: 6,
      tag: 'CHO',
      price: 780,
      tagColor: '#CCFAED',
      tagLabelColor: '#39CAAD',
      itemDetails: [
        {
          lotNumber: '2020-3021',
          expiryDate: new Date(),
          quantity: 1000,
        },
        {
          lotNumber: '2020-3021',
          expiryDate: new Date(),
          quantity: 1000,
        },
        {
          lotNumber: '2020-3021',
          expiryDate: new Date(),
          quantity: 1000,
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <CustomHeader
        title={'Facility'}
        navigation={navigation}
        RightComponent={<AddFacilityButton navigation={navigation} />}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {items.map((item, index) => {
          return (
            <ItemCard
              key={index}
              title={item.title}
              count={item.count}
              navigation={navigation}
              price={item.price}
              tag={item.tag}
              tagColor={item.tagColor}
              tagLabelColor={item.tagLabelColor}
              details={item.itemDetails}
              type={3}
            />
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
