import React, {useContext} from 'react';
import {View, Text, ScrollView, TextInput, StyleSheet} from 'react-native';
import {Overlay, Button, Icon, Divider} from 'react-native-elements';
import {APP_THEME} from '../utils/constants';
import PropTypes from 'prop-types';
import {AuthContext} from '../context';
import {getTagColor, getTagLabelColor} from '../utils/helper';

export const DispenseCheckoutOverlay = props => {
  const {getUser} = useContext(AuthContext);
  const {api_token, first_name, last_name} = getUser();

  const {overlayStyle, isVisible, onBackdropPress, items, lotNumbers} = props;
  return (
    <Overlay
      overlayStyle={overlayStyle}
      isVisible={isVisible}
      onBackdropPress={onBackdropPress}>
      <View style={{padding: 8, flex: 1}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
          }}>
          <Icon
            name="cart-plus"
            size={16}
            color="black"
            type="font-awesome-5"
            containerStyle={{marginRight: 12}}
          />
          <Text style={{fontWeight: 'bold', fontSize: 16}}>
            Checkout Summary
          </Text>
        </View>

        <ScrollView>
          {items
            .filter(item => item.totalDispenseCount != 0)
            .map((item, index) => {
              return (
                <View>
                  <View key={index} style={{flexDirection: 'row'}}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontSize: 16,
                        marginRight: 12,
                      }}>{`x${item.totalDispenseCount}`}</Text>

                    <View>
                      <Text>{item.item_name}</Text>

                      <View
                        style={{
                          ...styles.tagStyle,
                          backgroundColor: getTagColor(item.category),
                          marginBottom: 8,
                        }}>
                        <Icon
                          name="edit"
                          type="font-awesome-5"
                          color={getTagLabelColor(item.category)}
                          size={8}
                          style={{marginRight: 4}}
                        />
                        <Text
                          style={{
                            ...styles.tagText,
                            color: getTagLabelColor(item.category),
                          }}>
                          {item.category}
                        </Text>
                      </View>

                      {lotNumbers
                        .filter(
                          ln => ln.itemId === item.id && ln.dispenseCount > 0,
                        )
                        .map(lnf => {
                          return (
                            <Text
                              style={{color: '#B7B7B7', fontSize: 12}}>{`(x${
                              lnf.dispenseCount
                            }) Lot#${lnf.number} Exp. ${new Date(
                              lnf.expiry,
                            ).toLocaleDateString()}`}</Text>
                          );
                        })}
                    </View>
                  </View>

                  <Divider
                    style={{backgroundColor: '#B7B7B7', marginVertical: 12}}
                  />
                </View>
              );
            })}
        </ScrollView>

        {/* <View style={{flexDirection: 'row'}}>
          <Text>{`By: ${first_name} ${last_name}`}</Text>
        </View> */}

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 4,
          }}>
          <Icon
            name="pen-square"
            size={16}
            color="black"
            type="font-awesome-5"
            containerStyle={{marginRight: 12}}
          />
          <Text style={{fontWeight: 'bold', fontSize: 16}}>Notes</Text>
        </View>

        <TextInput
          placeholder={'Type something...'}
          numberOfLines={5}
          style={{
            backgroundColor: '#EBEBEB',
            borderRadius: 8,
            textAlignVertical: 'top',
            marginBottom: 12,
          }}
        />

        <Button
          title={'Confirm'}
          buttonStyle={{
            backgroundColor: APP_THEME.primaryColor,
            borderRadius: 8,
          }}
        />
      </View>
    </Overlay>
  );
};

DispenseCheckoutOverlay.propTypes = {
  overlayStyle: PropTypes.object,
  isVisible: PropTypes.bool,
  onBackdropPress: PropTypes.func,
  items: PropTypes.array,
  lotNumbers: PropTypes.array,
};

DispenseCheckoutOverlay.defaultProps = {
  overlayStyle: APP_THEME.defaultOverlayStyle,
  isVisible: false,
  onBackdropPress: () => console.log('not implemented'),
  items: [],
  lotNumbers: [],
};

const styles = StyleSheet.create({
  tagStyle: {
    padding: 5,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  tagText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'gray',
  },
});
