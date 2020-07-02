import React, {useState} from 'react';
import {StyleSheet, View, Text, TextInput, TextInputProps} from 'react-native';
import {Icon, Button} from 'react-native-elements';
import PropTypes from 'prop-types';

export const CustomTextInput = props => {
  const [isFocused, setIsFocused] = useState(false);
  const {textInputProps, focusedBorderColor} = props;

  return (
    <View
      style={
        isFocused
          ? {
              ...styles.container,
              borderWidth: 1,
              borderColor: focusedBorderColor,
            }
          : {
              ...styles.container,
              borderColor: focusedBorderColor,
            }
      }>
      <TextInput
        {...textInputProps}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </View>
  );
};

CustomTextInput.propTypes = {
  textInputProps: PropTypes.object,
  focusedBorderColor: PropTypes.string,
};

CustomTextInput.defaultProps = {
  textInputProps: {},
  focusedBorderColor: '#000',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
});
