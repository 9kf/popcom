import React, {useEffect, useContext, useMemo} from 'react';

import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {Text, Button} from 'react-native-elements';

import {AuthContext} from '../context';
import {APP_THEME} from '../utils/constants';
import {getLocalDateFromExpiration} from '../utils/helper';
import {getBatchesByFacilityId} from '../utils/routes';
import {useFetch} from '../hooks';

export const ItemBatchInfo = ({navigation, facilityId, item}) => {
  const {getUser} = useContext(AuthContext);
  const {api_token} = getUser();
  const {data: batches, isLoading, doFetch: fetchBatches} = useFetch();

  const mBatches = useMemo(() => {
    if (batches) return batches.filter(batch => batch.item_id === item?.id);

    return batches ?? [];
  }, [batches]);

  const adjustInventory = () => {
    navigation.navigate('AdjustInventory', {
      item: item,
      facility_id: facilityId,
      batches: mBatches,
    });
  };

  useEffect(() => {
    if (facilityId) getBatchesByFacilityId(api_token, facilityId, fetchBatches);
  }, [facilityId]);

  return (
    <View>
      {isLoading ? (
        <ActivityIndicator size={'small'} color={APP_THEME.primaryColor} />
      ) : (
        <View style={{flexDirection: 'row', paddingStart: 28}}>
          <View style={styles.itemBatchesInfo}>
            <Text style={styles.itemBatchesHeader}>BATCH/LOT NO.</Text>
            {mBatches.map((batch, index) => (
              <Text key={index} style={{color: '#C0C0C0'}}>
                {batch.batch_name}
              </Text>
            ))}
          </View>

          <View style={styles.itemBatchesInfo}>
            <Text style={styles.itemBatchesHeader}>EXPIRY DATE</Text>
            {mBatches.map((batch, index) => {
              return (
                <Text key={index} style={{color: '#C0C0C0'}}>
                  {getLocalDateFromExpiration(batch.expiration_date)}
                </Text>
              );
            })}
          </View>

          <View style={styles.itemBatchesInfo}>
            <Text style={styles.itemBatchesHeader}>QTY</Text>
            {mBatches.map((batch, index) => {
              return (
                <Text key={index} style={{color: '#C0C0C0'}}>{`${
                  batch.quantity
                } ea`}</Text>
              );
            })}
          </View>
        </View>
      )}

      <Button
        onPress={adjustInventory}
        title={'Adjust Inventory'}
        buttonStyle={styles.adjustInventoryButton}
        titleStyle={styles.adjustInventoryButtonTitle}
        type={'solid'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  itemBatchesHeader: {
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 4,
  },
  itemBatchesInfo: {
    flex: 1,
    alignItems: 'center',
  },
  adjustInventoryButton: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: APP_THEME.primaryColor,
    borderRadius: 8,
  },
  adjustInventoryButtonTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
