import React, {useState, useEffect, useContext} from 'react';

import {View, Text, StyleSheet, ScrollView, RefreshControl} from 'react-native';

import {CustomHeader, ItemCard} from '../components';

import {Button, Icon} from 'react-native-elements';

import {AuthContext} from '../context';

import {POPCOM_URL} from '../utils/constants';

import {useFetch} from '../hooks';

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

  const {getUser} = useContext(AuthContext);
  const {api_token} = getUser();

  const {data, errorMessage, isLoading, fetchData} = useFetch();

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
        title={'Items'}
        LeftComponentFunc={() => navigation.openDrawer()}
        RightComponent={<AddItemButton navigation={navigation} />}
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
              key={item.id}
              title={item.item_name}
              navigation={navigation}
              tag={item.category}
              tagColor={getTagColor(item.category)}
              tagLabelColor={getTagLabelColor(item.category)}
              type={5}
              nextFunc={() => navigation.navigate('Item', item)}
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
