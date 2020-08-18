import React from 'react';

import {View, StyleSheet, TouchableHighlight} from 'react-native';
import {Icon, Card} from 'react-native-elements';

export const ItmCard = ({pressFunc, children}) => (
  <Card containerStyle={styles.cardContainer}>
    <TouchableHighlight
      style={{padding: 16}}
      underlayColor={'#F5F5F5'}
      onPress={pressFunc}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{flexGrow: 1}}>{children}</View>
        <View style={{marginLeft: 4}}>
          <Icon
            name={'chevron-right'}
            type="font-awesome-5"
            color="#D9D9D9"
            size={18}
          />
        </View>
      </View>
    </TouchableHighlight>
  </Card>
);

const styles = StyleSheet.create({
  cardContainer: {
    padding: 0,
    paddingTop: 0,
    borderRadius: 8,
    marginTop: 0,
    marginBottom: 8,
  },
});
