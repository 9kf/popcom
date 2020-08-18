import React from 'react';

import {View, StyleSheet, Text} from 'react-native';
import {Icon} from 'react-native-elements';

import {
  getTagColor,
  getTagLabelColor,
  getFacilityTypeTagColor,
  getFacilityTypeTagLabelColor,
} from '../utils/helper';

export const ItemTag = ({tag}) => (
  <View style={{flexDirection: 'row'}}>
    <View
      style={{
        ...styles.tagStyle,
        backgroundColor:
          getTagColor(tag) ?? getFacilityTypeTagColor(tag) ?? '#D9D9D9',
        marginRight: 4,
      }}>
      <Icon
        name={
          getTagColor(tag) || getFacilityTypeTagColor(tag)
            ? 'edit'
            : 'shopping-cart'
        }
        type="font-awesome-5"
        color={
          getTagLabelColor(tag) ?? getFacilityTypeTagLabelColor(tag) ?? 'gray'
        }
        size={8}
        style={{marginRight: 4}}
      />
      <Text
        style={{
          ...styles.tagText,
          color:
            getTagLabelColor(tag) ??
            getFacilityTypeTagLabelColor(tag) ??
            'gray',
          textTransform: getTagLabelColor(tag) ? 'capitalize' : 'none',
        }}>
        {tag}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  tagStyle: {
    padding: 5,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagText: {
    fontSize: 8,
    fontWeight: 'bold',
  },
});
