import React from 'react';

import {View, StyleSheet, Text} from 'react-native';
import {Icon} from 'react-native-elements';

import {colorShade} from '../utils/helper';

export const ItemTag = ({tagName, tagColor, iconName}) => (
  <View style={{flexDirection: 'row'}}>
    <View
      style={{
        ...styles.tagStyle,
        backgroundColor: tagColor,
        marginRight: 4,
      }}>
      <Icon
        name={iconName}
        type="font-awesome-5"
        color={colorShade(tagColor, -120)}
        size={8}
        style={{marginRight: 4}}
      />
      <Text
        style={{
          ...styles.tagText,
          color: colorShade(tagColor, -120),
        }}>
        {tagName}
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
