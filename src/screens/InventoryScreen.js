import React from 'react';

import {View, Text, StyleSheet, ScrollView} from 'react-native';

import {CustomHeader, ItemCard} from '../components';

export const InventoryScreen = ({navigation}) => {
  const items = [
    {
      title: 'Trust Chocolate Condom',
      count: 5,
      tag: 'Male Condom',
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
      title: 'Durex Light Condom',
      count: 2,
      tag: 'Male Condom',
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
      title: 'Mango Female Condom',
      count: 0,
      tag: 'RHU',
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
      title: 'Mercilon - 21 Pills',
      count: 6,
      tag: 'Pills',
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
      title: 'Marvelon - 28 Pills',
      count: 6,
      tag: 'Pills',
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
      title: 'D - 35 Pills',
      count: 6,
      tag: 'Pills',
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
      <CustomHeader title={'Inventory'} navigation={navigation} />
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
              type={1}
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
