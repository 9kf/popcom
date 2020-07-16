import React from 'react';
import {StyleSheet, View, Text, TextInput} from 'react-native';
import {Icon, Button} from 'react-native-elements';

export const Counter = ({count = 0, addCount, subtractCount, setCount}) => (
  <View style={styles.container}>
    <Button
      onPress={() => subtractCount()}
      icon={<Icon name="minus" size={6} color="black" type="font-awesome-5" />}
      buttonStyle={{backgroundColor: '#fff', borderRadius: 40}}
    />
    {/* <Text style={{width: 50, textAlign: 'center'}}>{count}</Text> */}
    <TextInput
      value={count.toString()}
      keyboardType={'numeric'}
      style={{
        height: 25,
        padding: 0,
        textAlign: 'center',
        width: 50,
        fontSize: 14,
      }}
      onChangeText={newText => setCount(newText)}
    />
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
