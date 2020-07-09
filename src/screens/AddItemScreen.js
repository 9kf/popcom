import React, {useEffect, useContext} from 'react';
import * as R from 'ramda';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Picker,
  Platform,
} from 'react-native';

import {
  CustomHeader,
  ErrorHandlingField,
  ImagePickerComponent,
} from '../components';

import {Button, Icon} from 'react-native-elements';

import {AuthContext} from '../context';

import {CATEGORIES, POPCOM_URL, APP_THEME} from '../utils/constants';

import {useForm, useFetch} from '../hooks';

const FORM_KEYS = {
  ITEM_SKU: 'item_sku',
  ITEM_NAME: 'item_name',
  ITEM_DESCRIPTION: 'item_description',
  CATEGORY: 'category',
  IMAGE: 'image',
  STATUS: 'status',
  API_TOKEN: 'api_token',
};

export const AddItemScreen = ({navigation}) => {
  const {getUser} = useContext(AuthContext);
  const {api_token} = getUser();

  const {data, errorMessage, isLoading, fetchData} = useFetch();

  const validate = formValues => {
    let errors = {};
    const newValues = R.assoc(
      FORM_KEYS.IMAGE,
      formValues[FORM_KEYS.IMAGE]?.data,
      formValues,
    );
    //required fields must not be empty
    Object.keys(FORM_KEYS).forEach((key, index) => {
      if (!newValues[FORM_KEYS[key]] || newValues[FORM_KEYS[key]].trim() === '')
        errors[FORM_KEYS[key]] = `${FORM_KEYS[key]} must not be empty`;
    });

    console.log(errors);
    return errors;
  };

  const createFormData = (image, body) => {
    const data = new FormData();

    data.append('photo', {
      name: image.fileName,
      type: image.type,
      uri:
        Platform.OS === 'android'
          ? image.uri
          : image.uri.replace('file://', ''),
    });

    Object.keys(body).forEach(key => {
      data.append(key, body[key]);
    });

    return data;
  };

  const addItem = async formValues => {
    // const newValues = R.assoc(
    //   FORM_KEYS.IMAGE,
    //   formValues[FORM_KEYS.IMAGE]?.data,
    //   formValues,
    // );
    const newValues = R.dissoc(FORM_KEYS.IMAGE, formValues);
    const params = new URLSearchParams(newValues);
    const options = {
      headers: {
        accept: 'application/json',
      },
      method: 'post',
    };
    const endpoint = POPCOM_URL + `/api/create-item?${params.toString()}`;
    fetchData(endpoint, options, () => alert('Failed to add the item'));
  };

  const initialState = {
    [FORM_KEYS.CATEGORY]: CATEGORIES[0].name,
    [FORM_KEYS.API_TOKEN]: api_token,
    [FORM_KEYS.STATUS]: '1',
  };
  const {
    onFieldValueChange,
    onFormSubmit,
    resetForm,
    errors,
    formValues,
  } = useForm(initialState, addItem, validate);

  useEffect(() => {
    if (data) {
      navigation.navigate('ItemMaster');
      resetForm();
    }
  }, [data]);

  return (
    <View style={styles.container}>
      <CustomHeader
        LeftComponentFunc={() => {
          resetForm();
          navigation.navigate('ItemMaster');
        }}
        title={'Create Item'}
        type={1}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImagePickerComponent
          setImage={onFieldValueChange(FORM_KEYS.IMAGE)}
          image={formValues[FORM_KEYS.IMAGE]}
          errorMessage={errors[FORM_KEYS.IMAGE]}
        />
        <View
          style={{
            marginHorizontal: 20,
            paddingVertical: 20,
          }}>
          <View style={{flexDirection: 'row', marginBottom: 12}}>
            <Icon
              name="box"
              type="font-awesome-5"
              color={'#333333'}
              size={16}
            />
            <Text style={{color: '#333333', marginLeft: 12, fontSize: 12}}>
              Item Information
            </Text>
          </View>
          <ErrorHandlingField
            title={'Item Name'}
            errorMessage={errors[FORM_KEYS.ITEM_NAME]}
            style={APP_THEME.inputContainerStyle}>
            <TextInput
              value={formValues[FORM_KEYS.ITEM_NAME]}
              onChangeText={newValue =>
                onFieldValueChange(FORM_KEYS.ITEM_NAME, newValue)
              }
              style={APP_THEME.defaultInputStyle}
            />
          </ErrorHandlingField>
          <ErrorHandlingField
            title={'Barcode / SKU'}
            errorMessage={errors[FORM_KEYS.ITEM_SKU]}
            style={APP_THEME.inputContainerStyle}>
            <TextInput
              value={formValues[FORM_KEYS.ITEM_SKU]}
              onChangeText={newValue =>
                onFieldValueChange(FORM_KEYS.ITEM_SKU, newValue)
              }
              style={APP_THEME.defaultInputStyle}
            />
          </ErrorHandlingField>
          <ErrorHandlingField
            errorMessage={errors[FORM_KEYS.CATEGORY]}
            title={'Item Category'}
            style={APP_THEME.inputContainerStyle}>
            <Picker
              style={{height: 37}}
              selectedValue={formValues[FORM_KEYS.CATEGORY]}
              onValueChange={(value, index) =>
                onFieldValueChange(FORM_KEYS.CATEGORY, value)
              }
              mode={'dropdown'}>
              {CATEGORIES.map((item, index) => (
                <Picker.Item key={index} value={item.name} label={item.name} />
              ))}
            </Picker>
          </ErrorHandlingField>
          <ErrorHandlingField
            errorMessage={errors[FORM_KEYS.ITEM_DESCRIPTION]}
            title={'Item Description'}
            style={APP_THEME.inputContainerStyle}>
            <TextInput
              multiline={true}
              numberOfLines={5}
              value={formValues[FORM_KEYS.ITEM_DESCRIPTION]}
              onChangeText={newValue =>
                onFieldValueChange(FORM_KEYS.ITEM_DESCRIPTION, newValue)
              }
              style={{...APP_THEME.defaultInputStyle, textAlignVertical: 'top'}}
            />
          </ErrorHandlingField>
        </View>

        <Button
          title={'Add New Item'}
          buttonStyle={{
            backgroundColor: '#043D10',
            borderRadius: 6,
            marginHorizontal: 20,
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
          loading={isLoading}
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
