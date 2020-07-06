import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Icon, Button} from 'react-native-elements';

export const Counter = ({count = 0, addCount, subtractCount}) => (
  <View style={styles.container}>
    <Button
      onPress={() => subtractCount()}
      icon={<Icon name="minus" size={6} color="black" type="font-awesome-5" />}
      buttonStyle={{backgroundColor: '#fff', borderRadius: 40}}
    />
    <Text style={{width: 50, textAlign: 'center'}}>{count}</Text>
    <Button
      onPress={() => addCount()}
      icon={<Icon name="plus" size={6} color="black" type="font-awesome-5" />}
      buttonStyle={{backgroundColor: '#fff', borderRadius: 40}}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 4,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 40,
    backgroundColor: '#D9D9D9',
  },
});
