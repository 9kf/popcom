import React, {useContext, useState} from 'react';
import {View, Text, ScrollView, TextInput, StyleSheet} from 'react-native';
import {Overlay, Button, Icon, Divider} from 'react-native-elements';
import {APP_THEME} from '../utils/constants';
import PropTypes from 'prop-types';
import {AuthContext} from '../context';
import {getTagColor, getTagLabelColor} from '../utils/helper';
import {adjustInventory} from '../utils/api';

export const DispenseCheckoutOverlay = props => {
  const {getUser} = useContext(AuthContext);
  const {api_token, first_name, last_name} = getUser();
  const {overlayStyle, isVisible, onBackdropPress, items, batches} = props;

  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    let promises = [];
    const tbCheckoutBatches = batches.filter(
      batch => batch.item.dispenseCount > 0,
    );
    for (const batch of tbCheckoutBatches) {
      const newQuantity =
        parseInt(batch.quantity) - parseInt(batch.item.dispenseCount);
      promises.push(adjustInventory(api_token, batch.id, newQuantity));
    }

    try {
      await Promise.all(promises);
      setIsLoading(false);
      onBackdropPress();
    } catch (e) {
      console.log(e);
      alert('There were some items that failed to dispense');
      setIsLoading(false);
    }
  };

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

                      {batches
                        .filter(
                          batch =>
                            batch.item.id === item.id &&
                            batch.item.dispenseCount > 0,
                        )
                        .map(batch => {
                          return (
                            <Text
                              style={{color: '#B7B7B7', fontSize: 12}}>{`(x${
                              batch.item.dispenseCount
                            }) ${batch.batch_name} Exp. ${new Date(
                              batch.expiration_date.split(' ')[0],
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
          loading={isLoading}
          onPress={() => handleCheckout()}
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
