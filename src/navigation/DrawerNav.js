import React from 'react';
import {StyleSheet} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {
  Drawer,
  Home,
  ItemMaster,
  Inventory,
  DispenseItem,
  Facilities,
  AddItem,
  AddFacility,
  Facility,
  ItemInfo,
  RequestInventoryScreen,
  PrepareInventoryScreen,
  ReceiveInventoryScreen,
  addRequestInventoryScreen,
  AdjustInventory,
  GenerateReport,
  AddUser,
} from '../screens';

const DrawerNav = createDrawerNavigator();

export const DrawerNavigation = () => {
  return (
    <NavigationContainer>
      <DrawerNav.Navigator
        drawerStyle={styles.drawerStyle}
        drawerContent={props => <Drawer {...props} />}>
        <DrawerNav.Screen name="Home" component={Home} />
        <DrawerNav.Screen name="ItemMaster" component={ItemMaster} />
        <DrawerNav.Screen name="Inventory" component={Inventory} />
        <DrawerNav.Screen name="Dispense" component={DispenseItem} />
        <DrawerNav.Screen name="Facilities" component={Facilities} />
        <DrawerNav.Screen name="AddItem" component={AddItem} />
        <DrawerNav.Screen name="AddFacility" component={AddFacility} />
        <DrawerNav.Screen name="Facility" component={Facility} />
        <DrawerNav.Screen name="Item" component={ItemInfo} />
        <DrawerNav.Screen name="AddUser" component={AddUser} />
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
        <DrawerNav.Screen name="AdjustInventory" component={AdjustInventory} />
        <DrawerNav.Screen name="GenerateReport" component={GenerateReport} />
      </DrawerNav.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  drawerStyle: {
    borderBottomEndRadius: 6,
    borderTopEndRadius: 6,
    elevation: 10,
  },
});
