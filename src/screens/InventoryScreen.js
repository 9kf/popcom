import React, {useState, useEffect, useContext} from 'react';

import {View, Text, StyleSheet, ScrollView, RefreshControl} from 'react-native';

import {CustomHeader, ItemCard} from '../components';

import {
  getUserById,
  getTagColor,
  getTagLabelColor,
  getTotalItemCount,
} from '../utils/helper';
import {AuthContext} from '../context';
import {POPCOM_URL, APP_THEME} from '../utils/constants';

import {MockApiContext} from '../utils/mockAPI';
import {useFetch} from '../hooks';

export const InventoryScreen = ({navigation}) => {
  const [items, setItems] = useState([]);
  const {getUser} = useContext(AuthContext);
  const {api_token} = getUser();
  const {data, errorMessage, isLoading, fetchData} = useFetch();
  const {lotNumbers} = useContext(MockApiContext);

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

  useEffect(() => {
    return navigation.addListener('focus', () => {
      fetchItems();
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
              details={lotNumbers.filter(num => num.itemId === item.id)}
              showAdjustInventoryButton={true}
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
