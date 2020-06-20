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

import LoginScreen from './src/screens/LoginScreen'

const App = () => {
  return (
    <View style={{flex:1}}>
      <LoginScreen/>
    </View>
  );
};

export default App;
