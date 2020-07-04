import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Icon, Button} from 'react-native-elements';

/**
 * LEFTCOMPONENT TYPE
 * 1 = HAMBURGER
 * 2 = BACK
 */

export const CustomHeader = ({
  title,
  LeftComponentFunc,
  RightComponent,
  type,
}) => (
  <View style={styles.container}>
    <View style={styles.barStyle}>
      {type === 1 ? (
        <Icon
          name="chevron-left"
          type="font-awesome-5"
          color="#333"
          onPress={() => LeftComponentFunc()}
        />
      ) : (
        <Icon
          name="bars"
          type="font-awesome"
          color="#333"
          onPress={() => LeftComponentFunc()}
        />
      )}
    </View>

    <Text style={styles.titleStyle}>{title}</Text>

    {RightComponent && RightComponent}
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
