import React, {useEffect, useContext} from 'react';

import {View, Text, StyleSheet, ScrollView, TextInput} from 'react-native';
import {Picker} from '@react-native-community/picker';
import {
  CustomHeader,
  ErrorHandlingField,
  ImagePickerComponent,
} from '../components';
import {Button, Icon} from 'react-native-elements';

import {AuthContext} from '../context';
import {APP_THEME} from '../utils/constants';
import {createItem, getItemCategoriesWithHook} from '../utils/routes';
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

export const AddItem = ({navigation}) => {
  const {getUser} = useContext(AuthContext);
  const {api_token} = getUser();

  const {data: itemCreated, errorMessage, isLoading, doFetch} = useFetch();
  const {data: categories, doFetch: fetchItemCategories} = useFetch();

  const validate = formValues => {
    let errors = {};
    const newValues = {
      ...formValues,
      [FORM_KEYS.IMAGE]: formValues[FORM_KEYS.IMAGE]?.data,
    };

    //required fields must not be empty
    Object.keys(FORM_KEYS).forEach((key, index) => {
      if (
        !newValues[FORM_KEYS[key]] ||
        newValues[FORM_KEYS[key]].toString().trim() === ''
      )
        errors[FORM_KEYS[key]] = `${FORM_KEYS[key]} must not be empty`;
    });

    return errors;
  };

  const addItem = async formValues => {
    const newValues = {
      ...formValues,
      [FORM_KEYS.IMAGE]: `data:${formValues[FORM_KEYS.IMAGE]?.type};base64,${
        formValues[FORM_KEYS.IMAGE]?.data
      }`,
    };

    createItem(newValues, doFetch);
  };

  const handleBack = () => {
    navigation.goBack();
    resetForm();
  };

  const initialState = {
    [FORM_KEYS.CATEGORY]: 1,
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
    return navigation.addListener('focus', () => {
      getItemCategoriesWithHook(api_token, fetchItemCategories);
    });
  }, []);

  useEffect(() => {
    if (itemCreated) {
      handleBack();
    }
  }, [itemCreated]);

  useEffect(() => {
    if (errorMessage) alert(errorMessage);
  }, [errorMessage]);

  return (
    <View style={styles.container}>
      <CustomHeader
        LeftComponentFunc={handleBack}
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
              {categories &&
                categories.map((item, index) => (
                  <Picker.Item
                    key={index}
                    value={item.id}
                    label={item.category_name}
                  />
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
    backgroundColor: 'white',
  },
});
