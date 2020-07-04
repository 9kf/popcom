import React from 'react';
import {View} from 'react-native';
import {Overlay, Card, Icon} from 'react-native-elements';
import {APP_THEME} from '../utils/constants';
import PropTypes from 'prop-types';

export const DispenseCheckoutOverlay = props => {
  const {overlayStyle, isVisible, onBackdropPress} = props;
  return (
    <Overlay
      overlayStyle={overlayStyle}
      isVisible={isVisible}
      onBackdropPress={onBackdropPress}>
      <View style={{padding: 8, backgroundColor: 'red'}} />
    </Overlay>
  );
};

DispenseCheckoutOverlay.propTypes = {
  overlayStyle: PropTypes.object,
  isVisible: PropTypes.bool,
  onBackdropPress: PropTypes.func,
};

DispenseCheckoutOverlay.defaultProps = {
  overlayStyle: APP_THEME.defaultOverlayStyle,
  isVisible: false,
  onBackdropPress: () => console.log('not implemented'),
};
