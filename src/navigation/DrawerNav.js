import React from 'react';
import { StyleSheet } from 'react-native';

import { NavigationContainer } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer';

import { DrawerScreen, HomeScreen, ItemMasterScreen } from '../screens'

const DrawerNav = createDrawerNavigator();

export const DrawerNavigation = () => {
  return (
    <NavigationContainer>
        <DrawerNav.Navigator drawerStyle={styles.drawerStyle} drawerContent={(props) => <DrawerScreen {...props}/>}>
            <DrawerNav.Screen name="Home" component={HomeScreen}/>
            <DrawerNav.Screen name="ItemMaster" component={ItemMasterScreen}/>
        </DrawerNav.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  drawerStyle: {
    borderBottomEndRadius: 20,
    borderTopEndRadius: 20,
    marginTop: 20,
    elevation: 10
  }
})

