import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Icon, Button} from 'react-native-elements';

export const CustomHeader = ({title, navigation, LeftComponent}) => (
  <View style={styles.container}>
    <View style={styles.barStyle}>
      <Icon
        name="bars"
        type="font-awesome"
        color="#333"
        onPress={() => navigation.openDrawer()}
      />
    </View>

    <Text style={styles.titleStyle}>{title}</Text>

    {LeftComponent && LeftComponent}
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  barStyle: {
    marginRight: 24,
  },
  titleStyle: {
    flexGrow: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
});
