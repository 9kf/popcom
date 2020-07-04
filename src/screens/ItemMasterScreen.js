import React, {useState, useEffect} from 'react';

import {View, Text, StyleSheet, ScrollView, RefreshControl} from 'react-native';

import {CustomHeader, ItemCard} from '../components';

import {Button, Icon} from 'react-native-elements';

import {AuthContext} from '../context';

import {POPCOM_URL, CATEGORIES} from '../utils/constants';

import {getTagColor, getTagLabelColor} from '../utils/helper';

const AddItemButton = ({navigation}) => (
  <Button
    icon={<Icon name="plus" size={16} color="white" type="font-awesome-5" />}
    buttonStyle={{backgroundColor: '#065617', borderRadius: 20}}
    onPress={() => navigation.navigate('AddItem')}
  />
);

export const ItemMasterScreen = ({navigation}) => {
  const [items, setItems] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchItems = async () => {
    setIsRefreshing(true);
    const endpoint =
      POPCOM_URL +
      '/api/get-items?api_token=' +
      'XyS1kMrDuHBNMqzmuFBKoKoGY11DSresfUcd6hz0wwNRAOYMEZ8DbcGf7yQV';
    const response = await fetch(endpoint, {
      headers: {
        accept: 'application/json',
      },
      method: 'post',
    });

    if (!response.ok) {
      alert('failed to get items');
      setIsRefreshing(false);
      return;
    }

    const json = await response.json();
    setItems(json.data);
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <View style={styles.container}>
      <CustomHeader
        title={'Items'}
        LeftComponentFunc={() => navigation.openDrawer()}
        RightComponent={<AddItemButton navigation={navigation} />}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => fetchItems()}
          />
        }>
        {items.map((item, index) => {
          return (
            <ItemCard
              key={item.id}
              title={item.item_name}
              navigation={navigation}
              tag={item.category}
              tagColor={getTagColor(item.category)}
              tagLabelColor={getTagLabelColor(item.category)}
              type={5}
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
