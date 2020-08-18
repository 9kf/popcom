import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Picker,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {Button, Icon, Overlay} from 'react-native-elements';
import {CustomHeader, RequestCard, ErrorHandlingField} from '../components';

import {APP_THEME} from '../utils/constants';

export const StatusOverlay = ({isOpen, setIsOpen, items, setActiveFilter}) => {
  return (
    <Overlay
      overlayStyle={APP_THEME.defaultOverlayStyle}
      isVisible={isOpen}
      onBackdropPress={() => setIsOpen(false)}>
      <View style={{padding: 8, flex: 1}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
          }}>
          <Icon
            name="filter"
            size={16}
            color="black"
            type="font-awesome-5"
            containerStyle={{marginRight: 12}}
          />
          <Text style={{fontWeight: 'bold', fontSize: 16}}>
            Filter by Status
          </Text>
        </View>

        <ScrollView style={{marginTop: 12}}>
          {items.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setActiveFilter(item);
                  setIsOpen(false);
                }}>
                <View style={{marginVertical: 8}}>
                  <View
                    style={{
                      marginBottom: 4,
                    }}>
                    <Text style={{fontWeight: '600', fontSize: 18}}>
                      {item}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </Overlay>
  );
};
