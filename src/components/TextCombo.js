import React from 'react';
import {View} from 'react-native';
import {Text, Icon} from 'react-native-elements';

export const TextCombo = ({title, subTitle, containerStyle, icon}) => (
  <View style={containerStyle}>
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      {icon && (
        <Icon
          name={icon}
          type="font-awesome-5"
          containerStyle={{marginRight: 4}}
          size={15}
          color="#21542C"
        />
      )}
      <Text style={{fontSize: 18, fontWeight: 'bold'}}>{title}</Text>
    </View>
    <Text style={{color: 'gray'}}>{subTitle}</Text>
  </View>
);
