/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  View,
} from 'react-native';

import { DrawerNavigation } from './navigation'

const App = () => {
  return (
    <View style={{flex:1}}>
      <DrawerNavigation/>
    </View>
  );
};

export default App;
