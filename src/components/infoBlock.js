import React from 'react';
import {View, Text} from 'react-native';
import {Icon} from 'react-native-elements';

export const InfoBlock = ({
  iconName,
  header,
  subHeader,
  containerStyle = {},
  iconContainerStyle = {marginRight: 12},
}) => (
  <View style={containerStyle}>
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <Icon
        name={iconName}
        type="font-awesome-5"
        color="#D9D9D9"
        size={20}
        containerStyle={iconContainerStyle}
      />
      <View>
        <Text style={{fontWeight: 'bold', fontSize: 16}}>{header}</Text>
        <Text>{subHeader}</Text>
      </View>
    </View>
  </View>
);
