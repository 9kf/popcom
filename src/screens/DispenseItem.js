import React, {useState, useContext, useEffect} from 'react';
import * as R from 'ramda';

import {View, Text, StyleSheet, ScrollView, RefreshControl} from 'react-native';
import {Picker} from '@react-native-community/picker';
import {
  CustomHeader,
  ItemCard,
  Counter,
  ErrorHandlingField,
} from '../components';

import {Button} from 'react-native-elements';

import {DispenseCheckoutOverlay} from '../overlays';

import {colorShade, insertCategories} from '../utils/helper';
import {AuthContext} from '../context';
import {getItems} from '../utils/routes';
import {POPCOM_URL, APP_THEME} from '../utils/constants';

import {useFetch} from '../hooks';

const DispenseItemsExtension = ({itemDetails, setItemDetails}) => {
  const addDispenseCount = index => {
    setItemDetails(
      {
        ...itemDetails[index],
        item: {
          ...itemDetails[index].item,
          dispenseCount: parseInt(itemDetails[index].item.dispenseCount) + 1,
        },
      },
      itemDetails[index].id,
      itemDetails[index].item.id,
    );
  };

  const subTractDispenseCount = index => {
    if (itemDetails[index].dispenseCount != 0) {
      setItemDetails(
        {
          ...itemDetails[index],
          item: {
            ...itemDetails[index].item,
            dispenseCount: parseInt(itemDetails[index].item.dispenseCount) - 1,
          },
        },
        itemDetails[index].id,
        itemDetails[index].item.id,
      );
    }
  };

  const setCount = R.curry((index, count) => {
    setItemDetails(
      {
        ...itemDetails[index],
        item: {
          ...itemDetails[index].item,
          dispenseCount: count,
        },
      },
      itemDetails[index].id,
      itemDetails[index].item.id,
    );
  });

  return (
    <View style={styles.itemDetailsLayout}>
      {itemDetails.map((item, index) => {
        return (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              marginBottom: 8,
            }}>
            <View>
              {index === 0 && (
                <Text style={styles.itemDetailsHeader}>BATCH/LOT NO.</Text>
              )}
              <Text style={{fontWeight: 'bold'}}>{item.batch_name}</Text>
              <Text style={{color: '#C0C0C0'}}>
                {`Exp. ${new Date(
                  item.expiration_date.split(' ')[0],
                ).toLocaleDateString()}`}
              </Text>
            </View>
            <View style={index != 0 && {alignSelf: 'center'}}>
              {index === 0 && <Text style={styles.itemDetailsHeader}>QTY</Text>}
              <Text>{`${item.quantity} ea`}</Text>
            </View>
            <View style={{alignSelf: 'center'}}>
              <Counter
                count={item.item.dispenseCount}
                addCount={() => addDispenseCount(index)}
                subtractCount={() => subTractDispenseCount(index)}
                setCount={setCount(index)}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
};

const CheckoutCount = ({onPressFunc, count = 0}) => (
  <Button
    title={`${count} Checkout`}
    onPress={() => onPressFunc()}
    buttonStyle={{backgroundColor: '#DAE5E2', borderRadius: 15}}
    titleStyle={{
      color: '#043D10',
      fontSize: 12,
      fontWeight: 'bold',
      padding: 0,
      margin: 0,
    }}
  />
);

export const DispenseItem = ({navigation}) => {
  const {getUser} = useContext(AuthContext);
  const {api_token, roles, id} = getUser();

  const {
    data: items,
    isLoading,
    doFetch: fetchItems,
    overrideData: setItems,
  } = useFetch(insertCategories(api_token));

  const [totalItemDispenseCount, setTotalItemDispenseCount] = useState(0);
  const [isCheckoutVisible, setIsCheckoutVisible] = useState(false);

  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState('');

  const [batches, setBatches] = useState([]);

  const fetchFacilities = async () => {
    const endpoint = `${POPCOM_URL}/api/get-facilities?api_token=${api_token}`;
    const request = await fetch(endpoint, {});

    if (!request.ok) {
      console.log('error');
      return;
    }

    const responseJson = await request.json();
    if (roles != 'admin') {
      const userFacility = responseJson.data.filter(
        faci => faci.users.indexOf(id) > -1,
      );
      setFacilities(userFacility);
      return;
    }
    setFacilities(responseJson.data);
  };

  const addLotNumberDispenseCountProp = batches => {
    let batchesCopy = [...batches];
    batches.forEach((batch, index) => {
      batchesCopy[index] = {...batch, item: {...batch.item, dispenseCount: 0}};
    });

    return batchesCopy;
  };

  const getFacilityBatchById = async () => {
    const body = {
      api_token: api_token,
      facility_id: selectedFacility,
    };
    const endpoint = `${POPCOM_URL}/api/get-facility-batches`;
    const request = await fetch(endpoint, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!request.ok) {
      alert('failed');
      return;
    }

    const response = await request.json();
    setBatches(addLotNumberDispenseCountProp(response.data));
  };

  useEffect(() => {
    return navigation.addListener('focus', () => {
      getItems(api_token, fetchItems);
      fetchFacilities();
    });
  }, []);

  useEffect(() => {
    getFacilityBatchById();
  }, [selectedFacility]);

  useEffect(() => {
    if (items) {
      let itemsCopy = [...items];
      let nonZeroDispenseCount = 0;

      items.forEach((item, index) => {
        const totalDispenseCount = batches
          .filter(batch => batch.item.id === item.id)
          .reduce((total, batch) => {
            return total + parseInt(batch.item.dispenseCount);
          }, 0);
        nonZeroDispenseCount += totalDispenseCount;

        itemsCopy[index] = {
          ...itemsCopy[index],
          totalDispenseCount: totalDispenseCount,
        };
      });

      setTotalItemDispenseCount(nonZeroDispenseCount);
      setItems(itemsCopy);
    }
  }, [batches]);

  return (
    <View style={styles.container}>
      <DispenseCheckoutOverlay
        onBackdropPress={() => {
          getFacilityBatchById();
          setIsCheckoutVisible(false);
        }}
        isVisible={isCheckoutVisible}
        items={items}
        batches={batches}
      />

      <CustomHeader
        title={'Dispense'}
        LeftComponentFunc={() => navigation.openDrawer()}
        RightComponent={
          <CheckoutCount
            count={totalItemDispenseCount}
            onPressFunc={() => {
              if (totalItemDispenseCount != 0) setIsCheckoutVisible(true);
            }}
          />
        }
      />

      <View style={{marginHorizontal: 16, marginBottom: 12}}>
        <ErrorHandlingField
          title={'Selected Facility'}
          style={APP_THEME.inputContainerStyle}>
          <Picker
            style={{height: 37}}
            selectedValue={selectedFacility}
            onValueChange={(value, index) => setSelectedFacility(value)}
            mode={'dropdown'}>
            {facilities.map((item, index) => (
              <Picker.Item
                key={index}
                value={item.id}
                label={item.facility_name}
              />
            ))}
          </Picker>
        </ErrorHandlingField>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => fetchItems()}
          />
        }>
        {items &&
          items.map((item, index) => {
            return (
              <ItemCard
                key={index}
                title={item.item_name}
                price={batches
                  .filter(batch => batch.item.id === item.id)
                  .reduce((total, item) => {
                    return total + parseInt(item.quantity);
                  }, 0)}
                tag={item.category}
                count={item.totalDispenseCount ? item.totalDispenseCount : 0}
                tagColor={item.categoryColor}
                tagLabelColor={colorShade(item.categoryColor)}
                showAdjustInventoryButton={true}
                type={1}>
                <DispenseItemsExtension
                  itemDetails={batches.filter(
                    batch => batch.item.id === item.id,
                  )}
                  setItemDetails={(newItemDetails, batchId, itemId) => {
                    let batchCopy = [...batches];
                    batchCopy[
                      batches.findIndex(batch => {
                        return batch.id === batchId;
                      })
                    ] = newItemDetails;
                    setBatches(batchCopy);
                  }}
                />
              </ItemCard>
            );
          })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
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
