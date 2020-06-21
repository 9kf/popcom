import React from 'react';

import { Hamburger } from '../components'

import { createStackNavigator }  from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import ItemMasterScreen from '../screens/ItemMasterScreen';

const HomeStackNav = createStackNavigator();

export const HomeStackNavigation = ({navigation}) => {
  return (
      <HomeStackNav.Navigator
        headerMode={"none"}
        // screenOptions={{
        //   headerStyle: {
        //     backgroundColor: '#043D10',
        //   },
        //   headerTintColor: '#fff',
        //   headerLeft: () => (
        //     <Hamburger onPressFunction={navigation.openDrawer}/>
        //   )
        // }}
      >
          <HomeStackNav.Screen name="PopCom" component={HomeScreen} />
          <HomeStackNav.Screen name="ItemMaster" component={ItemMasterScreen}/>
      </HomeStackNav.Navigator>
  );
};

