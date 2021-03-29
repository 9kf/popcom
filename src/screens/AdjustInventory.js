import React, {useEffect, useContext, useState, useRef} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import {CustomHeader, ErrorHandlingField} from '../components';
import {Button, Icon, Overlay} from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';

import {AuthContext} from '../context';
import {POPCOM_URL, APP_THEME} from '../utils/constants';
import {adjustInventory} from '../utils/api';
import {colorShade, handleInputChange} from '../utils/helper';
import {format} from 'date-fns';

const AddBatchInventory = ({isOpen, setIsOpen, addBatch}) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [expiryDate, setExpiryDate] = useState(new Date());

  const [batchName, setBatchName] = useState('');
  const [quantity, setQuantity] = useState(0);

  const handleButtonPress = () => {
    addBatch(batchName, expiryDate, quantity);
    setIsOpen(false);
  };

  const onDateChange = (event, date) => {
    setExpiryDate(date);
    setIsDatePickerOpen(false);
  };

  return (
    <Overlay
      overlayStyle={{flexDirection: 'row', marginHorizontal: 20}}
      isVisible={isOpen}
      onBackdropPress={() => setIsOpen(false)}>
      <View style={{flexGrow: 1}}>
        {isDatePickerOpen && (
          <DateTimePicker
            value={expiryDate}
            mode={'date'}
            is24Hour={true}
            display="default"
            onChange={onDateChange}
            onTouchCancel={() => setIsDatePickerOpen(false)}
          />
        )}

        <View
          style={{
            flexDirection: 'row',
            marginVertical: 12,
            alignItems: 'center',
          }}>
          <Icon name="box" type="font-awesome-5" color={'#333333'} size={16} />
          <Text
            style={{
              color: '#333333',
              marginLeft: 12,
              fontSize: 16,
              fontWeight: 'bold',
            }}>
            Add Batch Inventory
          </Text>
        </View>

        <ErrorHandlingField
          style={APP_THEME.inputContainerStyle}
          title={'Batch Name'}>
          <TextInput
            style={APP_THEME.defaultInputStyle}
            value={batchName}
            onChangeText={newText => setBatchName(newText)}
          />
        </ErrorHandlingField>

        <TouchableOpacity onPress={() => setIsDatePickerOpen(true)}>
          <ErrorHandlingField
            title={'expiry Date'}
            style={{
              ...APP_THEME.inputContainerStyle,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TextInput
              style={{...APP_THEME.defaultInputStyle, flexGrow: 1}}
              editable={false}
              value={expiryDate.toDateString()}
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

        <ErrorHandlingField
          style={APP_THEME.inputContainerStyle}
          title={'Quantity'}>
          <TextInput
            style={APP_THEME.defaultInputStyle}
            onChangeText={newText => setQuantity(newText)}
            keyboardType={'numeric'}
          />
        </ErrorHandlingField>

        <Button
          title={'Add Batch Inventory'}
          onPress={handleButtonPress}
          buttonStyle={{
            backgroundColor: '#043D10',
            borderRadius: 6,
            marginTop: 24,
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
        />
      </View>
    </Overlay>
  );
};

const AdjustInventoryOverlay = ({
  isOpen,
  setIsOpen,
  apiToken,
  batch,
  replaceBatchDetails,
}) => {
  const [expiryDate, setExpiryDate] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const expiryTextInputRef = useRef(null);

  const handleOnBackdropPress = () => {
    setIsOpen(false);
    setNewQuantity('');
    setExpiryDate('');
  };

  const handleAdjustInventory = async () => {
    try {
      setIsAdjusting(true);
      const newExpiryDate =
        expiryDate !== ''
          ? (new Date(expiryDate).getTime() / 1000).toFixed(0)
          : null;
      const quantity =
        newQuantity === '' ? batch.quantity.toString() : newQuantity;
      const response = await adjustInventory(
        apiToken,
        batch?.id,
        quantity,
        newExpiryDate,
      );
      if (response) {
        handleOnBackdropPress();
        replaceBatchDetails(batch?.id, newQuantity, expiryDate);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsAdjusting(false);
    }
  };

  const handleOnDateChange = (event, date) => {
    setExpiryDate(format(date, 'MMM dd,yyyy'));
    setIsDatePickerOpen(false);
  };

  return (
    <Overlay
      visible={isOpen}
      onBackdropPress={handleOnBackdropPress}
      overlayStyle={{margin: 32, alignSelf: 'stretch'}}>
      <View>
        {isDatePickerOpen && (
          <DateTimePicker
            value={new Date()}
            mode={'date'}
            is24Hour={true}
            display="default"
            onChange={handleOnDateChange}
            onTouchCancel={() => setIsDatePickerOpen(false)}
          />
        )}
        <Text style={{fontWeight: 'bold', fontSize: 16}}>
          {batch?.batch_name}
        </Text>
        <Text style={{marginTop: 8}}>Batch Quantity</Text>
        <TextInput
          placeholder={batch?.quantity.toString()}
          keyboardType={'numeric'}
          style={{
            borderBottomWidth: 1,
            borderBottomColor: 'black',
            paddingVertical: 0,
          }}
          value={newQuantity}
          onChangeText={handleInputChange(setNewQuantity)}
        />
        <Text style={{marginTop: 8}}>Expiry Date</Text>
        <TextInput
          ref={expiryTextInputRef}
          placeholder={
            batch
              ? format(
                  new Date(batch.expiration_date),
                  'MMM dd,yyyy',
                ).toString()
              : ''
          }
          style={{
            borderBottomWidth: 1,
            borderBottomColor: 'black',
            paddingVertical: 0,
          }}
          value={expiryDate}
          onFocus={() => {
            setIsDatePickerOpen(true);
            expiryTextInputRef.current.blur();
          }}
        />
        <Button
          title={'Adjust Inventory'}
          loading={isAdjusting}
          buttonStyle={{
            backgroundColor: '#043D10',
            borderRadius: 6,
            marginVertical: 20,
          }}
          onPress={handleAdjustInventory}
        />
      </View>
    </Overlay>
  );
};

export const AdjustInventory = ({route, navigation}) => {
  const {getUser} = useContext(AuthContext);
  const {api_token} = getUser();

  const {facility_id} = route.params;

  const {category, item_name, id, categoryColor} = route.params.item;

  const [isAddBatchOpen, setIsAddBatchOpen] = useState(false);
  const [batches, setBatches] = useState([]);

  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);

  const addBatch = async (batchName, expiryDate, quantity) => {
    const endpoint = `${POPCOM_URL}/api/add-starting-inventory`;
    const request = await fetch(endpoint, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_token: api_token,
        batch_name: batchName,
        facility_id: facility_id,
        item_id: id,
        quantity: quantity,
        uom: 'pcs',
        expiration_date: (new Date(expiryDate).getTime() / 1000).toFixed(0),
      }),
    });

    if (!request.ok) {
      alert('failed to add batch');
      return;
    }

    const response = await request.json();
    setBatches([...batches, response.data]);
  };

  const handleToggleAdjustOverlay = batch => () => {
    setSelectedBatch(batch);
    setIsAdjustOpen(true);
  };

  const replaceBatchDetails = (id, newQuantity, newExpiratyDate) => {
    const index = batches.findIndex(batch => batch.id === id);
    const newBatches = [...batches];
    newBatches[index] = {...batches[index], quantity: newQuantity};

    if (newExpiratyDate) {
      newBatches[index] = {
        ...batches[index],
        expiration_date: new Date(newExpiratyDate).toString(),
      };
    }

    setBatches(newBatches);
  };

  useEffect(() => {
    setBatches(route.params.batches);
  }, [route]);

  return (
    <View style={styles.container}>
      <CustomHeader
        LeftComponentFunc={() => {
          navigation.goBack();
        }}
        title={'Adjust Inventory'}
        type={1}
      />

      <AdjustInventoryOverlay
        isOpen={isAdjustOpen}
        setIsOpen={setIsAdjustOpen}
        batch={selectedBatch}
        replaceBatchDetails={replaceBatchDetails}
        apiToken={api_token}
      />

      {isAddBatchOpen && (
        <AddBatchInventory
          isOpen={isAddBatchOpen}
          setIsOpen={setIsAddBatchOpen}
          addBatch={addBatch}
        />
      )}

      <View style={{margin: 20, marginTop: 8}}>
        <Text style={{fontWeight: 'bold', fontSize: 18}}>{item_name}</Text>
        <View
          style={{
            ...styles.tagStyle,
            backgroundColor: categoryColor,
            marginRight: 4,
            alignSelf: 'flex-start',
          }}>
          <Icon
            name="edit"
            type="font-awesome-5"
            color={colorShade(categoryColor)}
            size={12}
            style={{marginRight: 4}}
          />
          <Text
            style={{
              ...styles.tagText,
              color: colorShade(categoryColor),
              textTransform: 'capitalize',
            }}>
            {category}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            marginTop: 24,
            alignItems: 'center',
          }}>
          <Icon name="box" type="font-awesome-5" color={'#333333'} size={18} />
          <Text
            style={{
              color: '#333333',
              marginLeft: 12,
              fontSize: 18,
              fontWeight: 'bold',
            }}>
            Inventory Data
          </Text>
          <View style={{flexGrow: 1}} />
          <Text>{`${batches.reduce((total, item) => {
            return total + parseInt(item.quantity);
          }, 0)} ea`}</Text>
        </View>
      </View>

      {batches.map((batch, index) => {
        return (
          <View
            key={index}
            style={{
              paddingHorizontal: 20,
              paddingBottom: 12,
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 8,
              borderBottomWidth: 1,
              borderBottomColor: 'gray',
            }}>
            <View>
              <Text style={{fontWeight: 'bold', fontSize: 18}}>
                {batch.batch_name}
              </Text>
              <Text style={{color: '#B7B7B7', fontSize: 12}}>{`Expiry: ${format(
                new Date(batch.expiration_date),
                'MMM, dd,yyyy',
              )}`}</Text>
            </View>
            <View style={{flexGrow: 1}} />

            <Text>{batch.quantity}</Text>

            <TouchableHighlight
              onPress={handleToggleAdjustOverlay(batch)}
              underlayColor={'#F5F5F5'}>
              <Icon
                name="edit"
                size={20}
                color="#B3B3B3"
                type="font-awesome-5"
                style={{marginLeft: 8}}
              />
            </TouchableHighlight>
          </View>
        );
      })}

      <Button
        title={'Add Batch Inventory'}
        onPress={() => setIsAddBatchOpen(true)}
        buttonStyle={{
          backgroundColor: '#043D10',
          borderRadius: 6,
          marginHorizontal: 20,
          marginTop: 24,
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
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  tagStyle: {
    padding: 5,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'gray',
  },
});
