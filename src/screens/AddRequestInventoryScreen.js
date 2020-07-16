import React, {useState, useContext, useEffect} from 'react';
import * as R from 'ramda';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Picker,
  TouchableOpacity,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';

import {CustomHeader, ErrorHandlingField} from '../components';

import {Button, Icon, Overlay} from 'react-native-elements';

import {AuthContext} from '../context';

import {
  createRequestInventory,
  editRequestInventory,
  getItems,
  getFacilities,
} from '../utils/api';

import {APP_THEME} from '../utils/constants';

const ItemsOverlay = ({
  isOpen,
  setIsOpen,
  items,
  selectedItems,
  setSelectedItems,
}) => {
  const handleOnTouch = (itemName, itemId) => {
    setSelectedItems([
      ...selectedItems,
      {item_id: itemId, item: {item_name: itemName}, quantity: 0, uom: 'pcs'},
    ]);
    setIsOpen(false);
  };

  return (
    <Overlay
      overlayStyle={APP_THEME.defaultOverlayStyle}
      isVisible={isOpen}
      onBackdropPress={() => setIsOpen(false)}>
      <View>
        {items.map(item => {
          return (
            <TouchableOpacity
              onPress={() => handleOnTouch(item.item_name, item.id)}>
              <View style={{paddingHorizontal: 10, marginVertical: 8}}>
                <Text>{item.item_name}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </Overlay>
  );
};

export const addRequestInventoryScreen = ({route, navigation}) => {
  const {getUser} = useContext(AuthContext);
  const {api_token} = getUser();

  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isItemPickerOpen, setIsItemPickerOpen] = useState(false);

  const [facilities, setFacilities] = useState([]);
  const [requestingFacility, setRequestingFacility] = useState(null);
  const [supplyingFacility, setSupplyingFacility] = useState(null);

  const [deliveryDate, setRequestedDeliveryDate] = useState(new Date());
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const [message, setMessage] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const clearForm = () => {
    setItems([]);
    setSelectedItems([]);

    setFacilities([]);
    setRequestingFacility(null);
    setSupplyingFacility(null);

    setRequestedDeliveryDate(new Date());

    setMessage('');
  };

  const onDateChange = (event, selectedDate) => {
    setRequestedDeliveryDate(selectedDate);
    setIsDatePickerVisible(false);
  };

  const handleCreateRequestInventory = async () => {
    try {
      setIsLoading(true);
      const newItems = [];

      selectedItems.forEach(item => {
        const newItem = R.dissoc('itemName', item);
        newItems.push(newItem);
      });

      let request;

      if (!route.params) {
        request = await createRequestInventory(
          api_token,
          requestingFacility,
          supplyingFacility,
          newItems,
          message,
          new Date(deliveryDate),
        );
      } else {
        request = await editRequestInventory(
          api_token,
          route.params.id,
          requestingFacility,
          supplyingFacility,
          newItems,
          message,
          new Date(deliveryDate),
        );
      }
      setIsLoading(false);

      if (request === 1) {
        clearForm();
        navigation.goBack();
      }
    } catch (e) {
      setIsLoading(false);

      console.log(e);
    }
  };

  useEffect(() => {
    return navigation.addListener('focus', () => {
      getFacilities(api_token).then(data => setFacilities(data));
      getItems(api_token).then(data => setItems(data));
    });
  }, []);

  useEffect(() => {
    if (route.params) {
      const request = route.params;
      setRequestingFacility(request.receiving_facility_id);
      setSupplyingFacility(request.supplying_facility_id);
      setRequestedDeliveryDate(
        new Date(request.expected_delivery_date.split(' ')[0]),
      );
      setMessage(request.message);
      setSelectedItems(
        request.items.map(i => {
          return {
            item_id: i.item_id,
            item: {item_name: i.item.item_name},
            quantity: i.quantity,
            uom: 'pcs',
          };
        }),
      );
    }
  }, [route]);

  return (
    <View style={styles.container}>
      <CustomHeader
        LeftComponentFunc={() => {
          clearForm();
          navigation.goBack();
        }}
        title={!route.params ? 'Create Request Inventory' : 'Edit Request'}
        type={1}
      />

      {isDatePickerVisible && (
        <DateTimePicker
          value={deliveryDate}
          mode={'date'}
          is24Hour={true}
          display="default"
          onChange={onDateChange}
          onTouchCancel={() => setIsDatePickerVisible(false)}
        />
      )}

      {
        <ItemsOverlay
          isOpen={isItemPickerOpen}
          setIsOpen={setIsItemPickerOpen}
          items={items}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
        />
      }

      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            marginHorizontal: 20,
            marginTop: 20,
          }}>
          <View style={{flexDirection: 'row', marginBottom: 12}}>
            <Icon
              name="store"
              type="font-awesome-5"
              color={'#333333'}
              size={16}
            />
            <Text style={{color: '#333333', marginLeft: 12, fontSize: 12}}>
              Facility Information
            </Text>
          </View>

          <ErrorHandlingField
            title={'Receiving Facility'}
            style={APP_THEME.inputContainerStyle}>
            <Picker
              style={{height: 37}}
              selectedValue={requestingFacility}
              onValueChange={(value, index) => setRequestingFacility(value)}
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

          <ErrorHandlingField
            title={'Supplying Facility'}
            style={APP_THEME.inputContainerStyle}>
            <Picker
              style={{height: 37}}
              selectedValue={supplyingFacility}
              onValueChange={(value, index) => setSupplyingFacility(value)}
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

          <TouchableOpacity onPress={() => setIsDatePickerVisible(true)}>
            <ErrorHandlingField
              title={'Requested Delivery Date'}
              style={{
                ...APP_THEME.inputContainerStyle,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TextInput
                style={{...APP_THEME.defaultInputStyle, flexGrow: 1}}
                editable={false}
                value={deliveryDate.toDateString()}
              />
              <Icon
                name="pen-square"
                size={16}
                color="black"
                type="font-awesome-5"
                containerStyle={{marginRight: 12}}
              />
            </ErrorHandlingField>
          </TouchableOpacity>
        </View>

        <View
          style={{
            marginHorizontal: 20,
            marginTop: 20,
          }}>
          <View style={{flexDirection: 'row', marginBottom: 12}}>
            <Icon
              name="shopping-cart"
              type="font-awesome-5"
              color={'#333333'}
              size={16}
            />
            <Text style={{color: '#333333', marginLeft: 12, fontSize: 12}}>
              Requested Items
            </Text>
          </View>

          <Button
            title={'Select Items'}
            buttonStyle={{
              backgroundColor: '#043D10',
              borderRadius: 6,
              marginHorizontal: 20,
            }}
            containerStyle={{marginBottom: 12}}
            onPress={() => setIsItemPickerOpen(true)}
          />

          <View>
            {selectedItems.length != 0 && (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{color: 'gray'}}>ITEM</Text>
                <View style={{flexGrow: 1}} />
                <Text style={{color: 'gray'}}>QTY</Text>

                <Icon
                  name="pen-square"
                  size={20}
                  color="white"
                  type="font-awesome-5"
                  containerStyle={{marginLeft: 12}}
                />
              </View>
            )}

            {selectedItems.map((item, index) => {
              return (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text>{item.item.item_name}</Text>
                  <View style={{flexGrow: 1}} />

                  <TextInput
                    keyboardType={'numeric'}
                    onChangeText={newText => {
                      const newValues = [...selectedItems];
                      (newValues[index] = {
                        ...selectedItems[index],
                        quantity: newText ? parseInt(newText) : 0,
                      }),
                        setSelectedItems(newValues);
                    }}
                    style={{height: 37}}
                    value={item.quantity.toString()}
                  />
                  <Icon
                    name="times"
                    size={20}
                    color="red"
                    type="font-awesome-5"
                    containerStyle={{marginLeft: 12}}
                    onPress={() => {
                      const newValues = R.remove(index, 1, selectedItems);
                      setSelectedItems(newValues);
                    }}
                  />
                </View>
              );
            })}
          </View>
        </View>

        <View style={{marginHorizontal: 20, marginTop: 40}}>
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
            value={message}
            onChangeText={newText => setMessage(newText)}
            style={{
              backgroundColor: '#EBEBEB',
              borderRadius: 8,
              textAlignVertical: 'top',
              marginBottom: 12,
            }}
          />
        </View>

        <Button
          title={!route.params ? 'Create Request Inventory' : 'Edit Request'}
          loading={isLoading}
          buttonStyle={{
            backgroundColor: '#043D10',
            borderRadius: 6,
            margin: 20,
          }}
          icon={
            <Icon
              name="plus"
              size={10}
              color="white"
              type="font-awesome-5"
              style={{marginRight: 8}}
            />
          }
          onPress={handleCreateRequestInventory}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9FC',
  },
});
