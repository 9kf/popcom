import React, {useContext, useEffect} from 'react';

import {View, Text, StyleSheet, ScrollView, TextInput} from 'react-native';
import {Picker} from '@react-native-community/picker';
import {
  CustomHeader,
  ErrorHandlingField,
  PlaceFinder,
  ImagePickerComponent,
} from '../components';
import {Button, Icon} from 'react-native-elements';

import {AuthContext} from '../context';
import {useFetch, useForm} from '../hooks';
import {APP_THEME} from '../utils/constants';
import {getFacilityTypesWithHook, createFacility} from '../utils/routes';

const FORM_KEYS = {
  IMAGE: 'image',
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

export const AddFacility = ({navigation}) => {
  const {getUser} = useContext(AuthContext);
  const {api_token} = getUser();

  const {
    data: facilityCreated,
    isLoading: loadingCreateFacility,
    errorMessage: createFacilityError,
    doFetch: _createFacility,
  } = useFetch();

  const {data: facilityTypes, doFetch: fetchFacilityTypes} = useFetch();

  const getRequestBodyFromValues = formValues => {
    return {
      ...formValues,
      [FORM_KEYS.ADDRESS]: formValues[FORM_KEYS.ADDRESS]?.place_name,
      [FORM_KEYS.PROVINCE]: formValues[FORM_KEYS.ADDRESS]?.context[1]?.text,
      [FORM_KEYS.LONGITUDE]: formValues[FORM_KEYS.ADDRESS]?.center[0],
      [FORM_KEYS.LATITUDE]: formValues[FORM_KEYS.ADDRESS]?.center[1],
      [FORM_KEYS.IMAGE]: `data:${formValues[FORM_KEYS.IMAGE]?.type};base64,${
        formValues[FORM_KEYS.IMAGE]?.data
      }`,
    };
  };

  const validate = formValues => {
    let errors = {};

    const newValues = getRequestBodyFromValues(formValues);

    const requiredFields = Object.keys(FORM_KEYS).filter(
      key => key != 'LONGITUDE' && key != 'LATITUDE',
    );

    //required fields must not be empty
    requiredFields.forEach(key => {
      if (
        !newValues[FORM_KEYS[key]] ||
        newValues[FORM_KEYS[key]].toString().trim() === ''
      )
        errors[FORM_KEYS[key]] = `${FORM_KEYS[key]} must not be empty`;
    });

    return errors;
  };

  const handleCreateFacility = async formValues => {
    const requestBody = getRequestBodyFromValues(formValues);
    createFacility(requestBody, _createFacility);
  };

  const initialState = {
    [FORM_KEYS.FACILITY_TYPE]: 1,
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
  } = useForm(initialState, handleCreateFacility, validate);

  const handleBack = () => {
    navigation.goBack();
    resetForm();
  };

  useEffect(() => {
    return navigation.addListener('focus', () => {
      getFacilityTypesWithHook(api_token, fetchFacilityTypes);
    });
  }, []);

  useEffect(() => {
    if (facilityCreated) {
      handleBack();
    }
  }, [facilityCreated]);

  useEffect(() => {
    if (createFacilityError) alert(createFacilityError);
  }, [createFacilityError]);

  return (
    <View style={styles.container}>
      <CustomHeader
        LeftComponentFunc={handleBack}
        title={'Add Facility'}
        type={1}
      />
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
            title={'Facility Name'}
            style={APP_THEME.inputContainerStyle}
            errorMessage={errors[FORM_KEYS.FACILITY_NAME]}>
            <TextInput
              value={formValues[FORM_KEYS.FACILITY_NAME]}
              onChangeText={newValue =>
                onFieldValueChange(FORM_KEYS.FACILITY_NAME, newValue)
              }
              style={APP_THEME.defaultInputStyle}
            />
          </ErrorHandlingField>
          <ErrorHandlingField
            title={'Facility Type'}
            errorMessage={errors[FORM_KEYS.FACILITY_TYPE]}
            style={APP_THEME.inputContainerStyle}>
            <Picker
              style={{height: 37}}
              selectedValue={formValues[FORM_KEYS.FACILITY_TYPE]}
              onValueChange={(value, index) =>
                onFieldValueChange(FORM_KEYS.FACILITY_TYPE, value)
              }
              mode={'dropdown'}>
              {facilityTypes &&
                facilityTypes.map((type, index) => (
                  <Picker.Item key={index} value={type.id} label={type.type} />
                ))}
            </Picker>
          </ErrorHandlingField>

          <PlaceFinder
            title={'Facility Location'}
            setValue={onFieldValueChange(FORM_KEYS.ADDRESS)}
            value={formValues[FORM_KEYS.ADDRESS]}
            errorBorderColor={'red'}
            errorMessage={errors[FORM_KEYS.ADDRESS]}
          />

          <View style={{flexDirection: 'row'}}>
            <ErrorHandlingField
              title={'Province'}
              style={APP_THEME.inputContainerStyle}
              errorMessage={errors[FORM_KEYS.PROVINCE]}>
              <TextInput
                value={formValues[FORM_KEYS.ADDRESS]?.context[1].text}
                editable={false}
                style={{...APP_THEME.defaultInputStyle, color: 'black'}}
              />
            </ErrorHandlingField>

            <View style={{padding: 8}} />

            <ErrorHandlingField
              title={'Region'}
              style={APP_THEME.inputContainerStyle}
              errorMessage={errors[FORM_KEYS.REGION]}>
              <TextInput
                value={formValues[FORM_KEYS.REGION]}
                keyboardType={'numeric'}
                onChangeText={newValue =>
                  onFieldValueChange(FORM_KEYS.REGION, newValue)
                }
                style={APP_THEME.defaultInputStyle}
              />
            </ErrorHandlingField>
          </View>
        </View>

        <View
          style={{
            marginHorizontal: 20,
            marginTop: 20,
          }}>
          <View style={{flexDirection: 'row', marginBottom: 12}}>
            <Icon
              name="user-alt"
              type="font-awesome-5"
              color={'#333333'}
              size={16}
            />
            <Text style={{color: '#333333', marginLeft: 12, fontSize: 12}}>
              Facility User
            </Text>
          </View>

          <View style={{marginTop: 8, marginBottom: 24}}>
            <ImagePickerComponent
              setImage={onFieldValueChange(FORM_KEYS.IMAGE)}
              image={formValues[FORM_KEYS.IMAGE]}
              errorMessage={errors[FORM_KEYS.IMAGE]}
            />
          </View>

          <ErrorHandlingField
            style={APP_THEME.inputContainerStyle}
            title={'First Name'}
            errorMessage={errors[FORM_KEYS.FIRST_NAME]}>
            <TextInput
              value={formValues[FORM_KEYS.FIRST_NAME]}
              onChangeText={newValue =>
                onFieldValueChange(FORM_KEYS.FIRST_NAME, newValue)
              }
              style={APP_THEME.defaultInputStyle}
            />
          </ErrorHandlingField>

          <ErrorHandlingField
            style={APP_THEME.inputContainerStyle}
            title={'Last Name'}
            errorMessage={errors[FORM_KEYS.LAST_NAME]}>
            <TextInput
              value={formValues[FORM_KEYS.LAST_NAME]}
              onChangeText={newValue =>
                onFieldValueChange(FORM_KEYS.LAST_NAME, newValue)
              }
              style={APP_THEME.defaultInputStyle}
            />
          </ErrorHandlingField>

          <ErrorHandlingField
            style={APP_THEME.inputContainerStyle}
            title={'Email'}
            errorMessage={errors[FORM_KEYS.EMAIL]}>
            <TextInput
              value={formValues[FORM_KEYS.EMAIL]}
              onChangeText={newValue =>
                onFieldValueChange(FORM_KEYS.EMAIL, newValue)
              }
              style={APP_THEME.defaultInputStyle}
            />
          </ErrorHandlingField>
          <ErrorHandlingField
            style={APP_THEME.inputContainerStyle}
            title={'Password'}
            errorMessage={errors[FORM_KEYS.PASSWORD]}>
            <TextInput
              value={formValues[FORM_KEYS.PASSWORD]}
              onChangeText={newValue =>
                onFieldValueChange(FORM_KEYS.PASSWORD, newValue)
              }
              secureTextEntry={true}
              style={APP_THEME.defaultInputStyle}
            />
          </ErrorHandlingField>
          <ErrorHandlingField
            style={APP_THEME.inputContainerStyle}
            title={'Contact Number'}
            errorMessage={errors[FORM_KEYS.CONTACT_NUMBER]}>
            <TextInput
              value={formValues[FORM_KEYS.CONTACT_NUMBER]}
              onChangeText={newValue =>
                onFieldValueChange(FORM_KEYS.CONTACT_NUMBER, newValue)
              }
              keyboardType={'numeric'}
              style={APP_THEME.defaultInputStyle}
            />
          </ErrorHandlingField>
        </View>

        <Button
          title={'Add Facility'}
          loading={loadingCreateFacility}
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
    backgroundColor: 'white',
  },
});

const mapStyle = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 400,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
