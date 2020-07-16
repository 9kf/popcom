import React from 'react';

import {View, Text, StyleSheet} from 'react-native';

import {Button} from 'react-native-elements';
import {APP_THEME} from '../utils/constants';

export const InventoryExtension = ({
  itemDetails,
  navigation,
  item,
  facilityId,
  showAdjustInventory = true,
}) => {
  return (
    <View style={styles.itemDetailsLayout}>
      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 1, paddingLeft: 12}}>
          <Text style={styles.itemDetailsHeader}>BATCH/LOT NO.</Text>
          {itemDetails.map((item, index) => {
            return (
              <Text key={index} style={{fontWeight: 'bold'}}>
                {item.batch_name}
              </Text>
            );
          })}
        </View>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text style={styles.itemDetailsHeader}>EXPIRY DATE</Text>
          {itemDetails.map((item, index) => {
            return (
              <Text key={index} style={{color: '#C0C0C0'}}>
                {new Date(
                  item.expiration_date.split(' ')[0],
                ).toLocaleDateString()}
              </Text>
            );
          })}
        </View>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text style={styles.itemDetailsHeader}>QTY</Text>
          {itemDetails.map((item, index) => {
            return <Text key={index}>{`${item.quantity} ea`}</Text>;
          })}
        </View>
      </View>
      {showAdjustInventory && (
        <Button
          title={'Adjust Inventory'}
          buttonStyle={{
            marginHorizontal: 20,
            marginTop: 16,
            backgroundColor: APP_THEME.primaryColor,
            borderRadius: 8,
          }}
          titleStyle={{
            fontSize: 14,
            fontWeight: 'bold',
          }}
          type={'solid'}
          onPress={() => {
            navigation.navigate('AdjustInventory', {
              item: item,
              facility_id: facilityId,
              batches: itemDetails,
            });
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  itemDetailsLayout: {
    paddingVertical: 10,
    paddingHorizontal: 0,
    backgroundColor: '#F1F3F4',
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
  },
  itemDetailsHeader: {
    color: '#C0C0C0',
    fontSize: 11,
    marginBottom: 4,
  },
});
