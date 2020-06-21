import React from 'react';

import { NavigationContainer } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer';

import ItemMasterScreen from '../screens/ItemMasterScreen';
import HomeScreen from '../screens/HomeScreen'

const DrawerNav = createDrawerNavigator();

export const DrawerNavigation = () => {
  return (
    <NavigationContainer>
        <DrawerNav.Navigator>
            <DrawerNav.Screen name="Home" component={HomeScreen}/>
            <DrawerNav.Screen name="ItemMaster" component={ItemMasterScreen}/>
        </DrawerNav.Navigator>
    </NavigationContainer>
  );
};

