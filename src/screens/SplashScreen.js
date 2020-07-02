import React from 'react';

import {View, StyleSheet, Image, StatusBar} from 'react-native';

import {APP_THEME} from '../utils/constants';

const logo = require('../../images/logo/popcom-logo.png');
const titleWhite = require('../../images/title-white/title-white.png');

export const SplashScreen = () => (
  <View style={styles.container}>
    <StatusBar hidden={true} />
    <Image source={logo} resizeMode={'contain'} style={{margin: 10}} />
    <Image source={titleWhite} resizeMode={'contain'} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: APP_THEME.primaryColor,
  },
});
