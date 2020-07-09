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
  AddFacilityScreen,
  FacilityScreen,
  ItemScreen,
  RequestInventoryScreen,
  PrepareInventoryScreen,
  ReceiveInventoryScreen,
  addRequestInventoryScreen,
  AdjustInventoryScreen,
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
        <DrawerNav.Screen name="AddFacility" component={AddFacilityScreen} />
        <DrawerNav.Screen name="Facility" component={FacilityScreen} />
        <DrawerNav.Screen name="Item" component={ItemScreen} />
        <DrawerNav.Screen
          name="RequestInventory"
          component={RequestInventoryScreen}
        />
        <DrawerNav.Screen
          name="PrepareInventory"
          component={PrepareInventoryScreen}
        />
        <DrawerNav.Screen
          name="ReceiveInventory"
          component={ReceiveInventoryScreen}
        />
        <DrawerNav.Screen
          name="AddRequestInventory"
          component={addRequestInventoryScreen}
        />
        <DrawerNav.Screen
          name="AdjustInventory"
          component={AdjustInventoryScreen}
        />
      </DrawerNav.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  drawerStyle: {
    borderBottomEndRadius: 10,
    borderTopEndRadius: 10,
    elevation: 10,
  },
});
