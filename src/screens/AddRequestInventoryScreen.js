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

import {CustomHeader, ErrorHandlingField, PlaceFinder} from '../components';

import {Button, Icon, Overlay} from 'react-native-elements';

import {AuthContext} from '../context';

import {useFetch, useForm} from '../hooks';

import {FACILITY_TYPE, POPCOM_URL, APP_THEME} from '../utils/constants';

const FORM_KEYS = {
  FIRST_NAME: 'first_name',
  LAST_NAME: 'last_name',
  CONTACT_NUMBER: 'contact_number',
  EMAIL: 'email',
  PASSWORD: 'password',
  USER_STATUS: 'user_status',
  FACILITY_NAME: 'facility_name',
  ADDRESS: 'address',
  REGION: 'region',
  PROVINCE: 'province',
  LONGITUDE: 'longitude',
  LATITUDE: 'latitude',
  FACILITY_TYPE: 'facility_type',
  FACILITY_STATUS: 'facility_status',
  API_TOKEN: 'api_token',
};

const ItemsOverlay = ({
  isOpen,
  setIsOpen,
  items,
  selectedItems,
  setSelectedItems,
}) => {
  const handleOnTouch = itemName => {
    setSelectedItems([...selectedItems, {itemName: itemName, quantity: '0'}]);
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
            <TouchableOpacity onPress={() => handleOnTouch(item.item_name)}>
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

export const addRequestInventoryScreen = ({navigation}) => {
  const {getUser} = useContext(AuthContext);
  const {api_token} = getUser();
  const {data, isLoading, errorMessage, fetchData} = useFetch();

  const getRequestBodyFromValues = formValues => {
    return R.pipe(
      R.assoc(FORM_KEYS.ADDRESS, formValues[FORM_KEYS.ADDRESS]?.place_name),
      R.assoc(
        FORM_KEYS.PROVINCE,
        formValues[FORM_KEYS.ADDRESS]?.context[1].text,
      ),
      R.assoc(FORM_KEYS.LONGITUDE, formValues[FORM_KEYS.ADDRESS]?.center[0]),
      R.assoc(FORM_KEYS.LATITUDE, formValues[FORM_KEYS.ADDRESS]?.center[1]),
    )(formValues);
  };

  const validate = formValues => {
    let errors = {};

    const newValues = getRequestBodyFromValues(formValues);

    const requiredFields = Object.keys(FORM_KEYS).filter(
      key => key != 'LONGITUDE' && key != 'LATITUDE',
    );

    //required fields must not be empty
    requiredFields.forEach(key => {
      if (!newValues[FORM_KEYS[key]] || newValues[FORM_KEYS[key]].trim() === '')
        errors[FORM_KEYS[key]] = `${FORM_KEYS[key]} must not be empty`;
    });

    console.log(errors);

    return errors;
  };

  const addRequestInventory = async formValues => {
    const requestBody = new URLSearchParams(
      getRequestBodyFromValues(formValues),
    );
    const endpoint = `${POPCOM_URL}/api/create-facility?${requestBody.toString()}`;
    const options = {
      headers: {
        accept: 'application/json',
      },
      method: 'post',
    };
    fetchData(endpoint, options, () => alert('failed to create facility'));
  };

  const initialState = {
    [FORM_KEYS.FACILITY_TYPE]: FACILITY_TYPE[0].name,
    [FORM_KEYS.API_TOKEN]: api_token,
    [FORM_KEYS.USER_STATUS]: '1',
    [FORM_KEYS.FACILITY_STATUS]: '1',
  };
  const {
    onFieldValueChange,
    onFormSubmit,
    resetForm,
    errors,
    formValues,
  } = useForm(initialState, addRequestInventory, validate);

  useEffect(() => {
    if (data) {
      resetForm();
      //   navigation.navigate('Facilities');
    }
  }, [data]);

  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isItemPickerOpen, setIsItemPickerOpen] = useState(false);

  const [facilities, setFacilities] = useState([]);
  const [requestingFacility, setRequestingFacility] = useState(null);
  const [supplyingFacility, setSupplyingFacility] = useState(null);

  const [deliveryDate, setRequestedDeliveryDate] = useState(new Date());
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const onDateChange = (event, selectedDate) => {
    setRequestedDeliveryDate(selectedDate);
    setIsDatePickerVisible(false);
  };

  const getFacilities = async () => {
    const endpoint = `${POPCOM_URL}/api/get-facilities?api_token=${api_token}`;
    const request = await fetch(endpoint);
    console.log(request);
    if (!request.ok) {
      alert('failed to get facilities');
      return;
    }

    const response = await request.json();
    setFacilities(response.data);
  };

  const getItems = async () => {
    const endpoint = `${POPCOM_URL}/api/get-items?api_token=${api_token}`;
    const options = {
      headers: {
        accept: 'application/json',
      },
      method: 'post',
    };

    const request = await fetch(endpoint, options);

    if (!request.ok) {
      alert('failed to get items');
      return;
    }

    const response = await request.json();
    setItems(response.data);
  };

  useEffect(() => {
    return navigation.addListener('focus', () => {
      getFacilities();
      getItems();
    });
  }, []);

  return (
    <View style={styles.container}>
      <CustomHeader
        LeftComponentFunc={() => {
          resetForm();
          navigation.navigate('RequestInventory');
        }}
        title={'Create Request Inventory'}
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
            title={'Requesting Facility'}
            style={APP_THEME.inputContainerStyle}>
            <Picker
              style={{height: 37}}
              //   selectedValue={formValues[FORM_KEYS.FACILITY_TYPE]}
              //   onValueChange={(value, index) =>
              //     onFieldValueChange(FORM_KEYS.FACILITY_TYPE, value)
              //   }
              mode={'dropdown'}>
              {facilities.map((item, index) => (
                <Picker.Item
                  key={index}
                  value={item.facility_name}
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
              //   selectedValue={formValues[FORM_KEYS.FACILITY_TYPE]}
              //   onValueChange={(value, index) =>
              //     onFieldValueChange(FORM_KEYS.FACILITY_TYPE, value)
              //   }
              mode={'dropdown'}>
              {facilities.map((item, index) => (
                <Picker.Item
                  key={index}
                  value={item.facility_name}
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
                  <Text>{item.itemName}</Text>
                  <View style={{flexGrow: 1}} />

                  <TextInput
                    keyboardType={'numeric'}
                    onChangeText={newText => {
                      const newValues = [...selectedItems];
                      (newValues[index] = {
                        ...selectedItems[index],
                        quantity: newText,
                      }),
                        setSelectedItems(newValues);
                    }}
                    style={{height: 37}}
                    value={item.quantity}
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
            style={{
              backgroundColor: '#EBEBEB',
              borderRadius: 8,
              textAlignVertical: 'top',
              marginBottom: 12,
            }}
          />
        </View>

        <Button
          title={'Create Request Facility'}
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
          onPress={onFormSubmit}
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
