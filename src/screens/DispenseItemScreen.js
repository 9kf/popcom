import React, {useState, useContext, useEffect} from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Picker,
} from 'react-native';

import {
  CustomHeader,
  ItemCard,
  Counter,
  ErrorHandlingField,
} from '../components';

import {Button} from 'react-native-elements';

import {DispenseCheckoutOverlay} from '../overlays';

import {
  getTagColor,
  getTagLabelColor,
  getTotalItemCount,
} from '../utils/helper';
import {AuthContext} from '../context';
import {POPCOM_URL, APP_THEME} from '../utils/constants';

import {MockApiContext} from '../utils/mockAPI';
import {useFetch} from '../hooks';

const DispenseItemsExtension = ({itemDetails, setItemDetails}) => {
  const addDispenseCount = index => {
    setItemDetails(
      {
        ...itemDetails[index],
        dispenseCount: itemDetails[index].dispenseCount + 1,
      },
      itemDetails[index].number,
    );
  };

  const subTractDispenseCount = index => {
    if (itemDetails[index].dispenseCount != 0) {
      setItemDetails(
        {
          ...itemDetails[index],
          dispenseCount: itemDetails[index].dispenseCount - 1,
        },
        itemDetails[index].number,
      );
    }
  };

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
              <Text style={{fontWeight: 'bold'}}>{`LOT#${item.number}`}</Text>
              <Text style={{color: '#C0C0C0'}}>
                {`Exp. ${new Date(item.expiry).toLocaleDateString()}`}
              </Text>
            </View>
            <View style={index != 0 && {alignSelf: 'center'}}>
              {index === 0 && <Text style={styles.itemDetailsHeader}>QTY</Text>}
              <Text>{`${item.quantity} ea`}</Text>
            </View>
            <View style={{alignSelf: 'center'}}>
              <Counter
                count={item.dispenseCount}
                addCount={() => addDispenseCount(index)}
                subtractCount={() => subTractDispenseCount(index)}
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

export const DispenseItemScreen = ({navigation}) => {
  const [items, setItems] = useState([]);
  const {getUser} = useContext(AuthContext);
  const {api_token} = getUser();
  const {data, errorMessage, isLoading, fetchData} = useFetch();
  const {lotNumbers} = useContext(MockApiContext);

  const [stateLotNumbers, setStateLotNumbers] = useState([]);
  const [totalItemDispenseCount, setTotalItemDispenseCount] = useState(0);
  const [isCheckoutVisible, setIsCheckoutVisible] = useState(false);

  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState('');

  const fetchItems = async () => {
    const endpoint = `${POPCOM_URL}/api/get-items?api_token=${api_token}`;
    const options = {
      headers: {
        accept: 'application/json',
      },
      method: 'post',
    };
    fetchData(endpoint, options, () => alert('Failed to get list of items'));
  };

  const fetchFacilities = async () => {
    const endpoint = `${POPCOM_URL}/api/get-facilities?api_token=${api_token}`;
    const request = await fetch(endpoint, {});

    if (!request.ok) {
      console.log('error');
      return;
    }

    const responseJson = await request.json();
    setFacilities(responseJson.data);
  };

  const addLotNumberDispenseCountProp = () => {
    let lotNumbersCopy = [...lotNumbers];
    lotNumbers.forEach((item, index) => {
      lotNumbersCopy[index] = {...item, dispenseCount: 0};
    });

    return lotNumbersCopy;
  };

  const addItemDispenseCountProp = items => {
    let itemsCopy = [...items];

    items.forEach((item, index) => {
      itemsCopy[index] = {...item, totalDispenseCount: 0};
    });

    return itemsCopy;
  };

  useEffect(() => {
    return navigation.addListener('focus', () => {
      fetchItems();
      fetchFacilities();
      setStateLotNumbers(addLotNumberDispenseCountProp());
    });
  }, []);

  useEffect(() => {
    let itemsCopy = [...items];
    let nonZeroDispenseCount = 0;
    items.forEach((item, index) => {
      const totalDispenseCount = stateLotNumbers
        .filter(sln => sln.itemId === item.id)
        .reduce((total, item) => {
          return total + item.dispenseCount;
        }, 0);

      itemsCopy[index] = {
        ...itemsCopy[index],
        totalDispenseCount: totalDispenseCount,
      };
      if (totalDispenseCount > 0) nonZeroDispenseCount++;
    });

    setTotalItemDispenseCount(nonZeroDispenseCount);
    setItems(itemsCopy);
  }, [stateLotNumbers]);

  useEffect(() => {
    if (data) setItems(addItemDispenseCountProp(data.data));
  }, [data]);

  return (
    <View style={styles.container}>
      <DispenseCheckoutOverlay
        onBackdropPress={() => setIsCheckoutVisible(false)}
        isVisible={isCheckoutVisible}
        items={items}
        lotNumbers={stateLotNumbers}
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
        {items.map((item, index) => {
          return (
            <ItemCard
              title={item.item_name}
              price={getTotalItemCount(
                lotNumbers.filter(num => num.itemId === item.id),
              )}
              count={item.totalDispenseCount}
              tag={item.category}
              tagColor={getTagColor(item.category)}
              tagLabelColor={getTagLabelColor(item.category)}
              showAdjustInventoryButton={true}
              type={1}>
              <DispenseItemsExtension
                itemDetails={stateLotNumbers.filter(
                  num => num.itemId === item.id,
                )}
                setItemDetails={(newItemDetails, i) => {
                  let lotNumbersCopy = [...stateLotNumbers];
                  lotNumbersCopy[
                    stateLotNumbers.findIndex(sln => {
                      return sln.number === i;
                    })
                  ] = newItemDetails;
                  setStateLotNumbers(lotNumbersCopy);
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
    backgroundColor: '#F5F9FC',
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
