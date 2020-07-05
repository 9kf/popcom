import React from 'react';
import {View, Text} from 'react-native';

export const ErrorHandlingField = ({
  title,
  errorMessage,
  style,
  errorBorderColor = 'red',
  children,
}) => (
  <View style={{flexGrow: 1}}>
    <Text
      style={{
        color: errorMessage ? errorBorderColor : 'gray',
        fontSize: 10,
        marginLeft: 4,
        marginBottom: 2,
      }}>
      {title}
    </Text>
    <View
      style={
        errorMessage
          ? {...style, borderWidth: 1, borderColor: errorBorderColor}
          : style
      }>
      {children}
    </View>
  </View>
);
