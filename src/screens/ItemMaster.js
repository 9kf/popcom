import React, {useEffect, useContext} from 'react';

import {View, StyleSheet, ScrollView, RefreshControl, Text} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import {CustomHeader, ItmCard, ItemTag} from '../components';

import {APP_THEME} from '../utils/constants';
import {AuthContext} from '../context';
import {useFetch} from '../hooks';
import {getItems} from '../utils/routes';
import {insertCategories} from '../utils/helper';

const AddItemButton = ({onPress}) => (
  <Button
    icon={<Icon name="plus" size={16} color="white" type="font-awesome-5" />}
    buttonStyle={{backgroundColor: '#065617', borderRadius: 20}}
    onPress={onPress}
  />
);

export const ItemMaster = ({navigation}) => {
  const {getUser} = useContext(AuthContext);
  const {api_token, roles} = getUser();

  const {data: items, errorMessage, isLoading, doFetch: fetchItems} = useFetch(
    insertCategories(api_token),
  );

  const handleReloadItems = async () => {
    getItems(api_token, fetchItems);
  };

  const handleAddItem = () => {
    navigation.navigate('AddItem');
  };

  const navigateToItem = item => () => navigation.navigate('Item', item);

  useEffect(() => {
    return navigation.addListener('focus', () => {
      handleReloadItems();
    });
  }, []);

  useEffect(() => {
    if (errorMessage) alert(errorMessage);
  }, [errorMessage]);

  return (
    <View style={styles.container}>
      <CustomHeader
        title={'Items'}
        LeftComponentFunc={() => navigation.openDrawer()}
        {...roles === 'admin' && {
          RightComponent: <AddItemButton onPress={handleAddItem} />,
        }}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleReloadItems}
          />
        }>
        {items &&
          items.map((item, index) => {
            return (
              <ItmCard key={index} pressFunc={navigateToItem(item)}>
                <Text style={APP_THEME.cardTitleDefaultStyle}>
                  {item.item_name}
                </Text>
                <ItemTag
                  tagName={item.category}
                  tagColor={item.categoryColor}
                  iconName={'edit'}
                />
              </ItmCard>
            );
          })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
