import React from 'react';
import {StyleSheet} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';

import {
  DrawerScreen,
  HomeScreen,
  ItemMasterScreen,
  InventoryScreen,
  DispenseItemScreen,
  FacilitiesScreen,
  AddItemScreen,
} from '../screens';

const DrawerNav = createDrawerNavigator();

export const DrawerNavigation = () => {
  return (
    <NavigationContainer>
      <DrawerNav.Navigator
        drawerStyle={styles.drawerStyle}
        drawerContent={props => <DrawerScreen {...props} />}>
        <DrawerNav.Screen name="Home" component={HomeScreen} />
        <DrawerNav.Screen name="ItemMaster" component={ItemMasterScreen} />
        <DrawerNav.Screen name="Inventory" component={InventoryScreen} />
        <DrawerNav.Screen name="Dispense" component={DispenseItemScreen} />
        <DrawerNav.Screen name="Facilities" component={FacilitiesScreen} />
        <DrawerNav.Screen name="AddItem" component={AddItemScreen} />
      </DrawerNav.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  drawerStyle: {
    borderBottomEndRadius: 10,
    borderTopEndRadius: 10,
    marginTop: 20,
    elevation: 10,
  },
});
