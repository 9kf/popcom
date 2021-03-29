import React, {useEffect, useContext} from 'react';

import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Image,
  TouchableHighlight,
  Alert,
  TextInput,
} from 'react-native';
import {Icon, Button} from 'react-native-elements';
import {
  CustomHeader,
  TextCombo,
  ImagePickerComponent,
  ErrorHandlingField,
} from '../components';

import {AuthContext} from '../context';
import {getUsers, addFacilityUser, addUserToFacility} from '../utils/routes';
import {APP_THEME} from '../utils/constants';
import {useFetch, useForm} from '../hooks';

const logo = require('../../images/logo/popcom-logo.png');

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
const Tab = createMaterialTopTabNavigator();

const AddfromCurrentUsers = ({
  navigation,
  apiToken,
  registeredUsers,
  facilityName,
  facilityId,
}) => {
  const getAvailableFacilityUsers = currFacilityUsers => facilityUsers => {
    const currentFacilityUsersEmail = currFacilityUsers.map(
      user => user.user.email,
    );

    return facilityUsers.filter(
      user => currentFacilityUsersEmail.indexOf(user.email) < 0,
    );
  };

  const {
    data: users,
    isLoading: loadingUsers,
    errorMessage: usersError,
    doFetch: fetchUsers,
  } = useFetch(getAvailableFacilityUsers(registeredUsers));

  const {
    data: addUser,
    errorMessage: addUserError,
    doFetch: _addUserToFacility,
  } = useFetch();

  const handleUsersReload = () => getUsers(apiToken, fetchUsers);

  const handleAddUser = userId => async () => {
    addUserToFacility(apiToken, userId, facilityId, _addUserToFacility);
  };

  const handleAvailableUserPress = user => () => {
    Alert.alert(
      'Confirm',
      `Add ${user.first_name} to the ${facilityName} facility?`,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: handleAddUser(user.id)},
      ],
      {cancelable: false},
    );
  };

  useEffect(() => {
    return navigation.addListener('focus', () => {
      handleUsersReload();
    });
  }, []);

  useEffect(() => {
    if (addUser) navigation.navigate('Facilities');
  }, [addUser]);

  useEffect(() => {
    if (addUserError) alert(addUserError);
  }, [addUserError]);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loadingUsers}
            onRefresh={handleUsersReload}
          />
        }>
        {users?.map((user, index) => {
          const fullName = `${user.last_name}, ${user.first_name}`;

          return (
            <TouchableHighlight
              key={index}
              onPress={handleAvailableUserPress(user)}
              underlayColor={'#F5F5F5'}
              style={{marginVertical: 4, marginHorizontal: 8}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  style={{height: 32, width: 32, marginRight: 10}}
                  source={
                    user.image
                      ? {uri: `https://popcom.app/images/${user.image}`}
                      : logo
                  }
                  resizeMode={'contain'}
                />
                <TextCombo title={fullName} subTitle={user.email} />
              </View>
            </TouchableHighlight>
          );
        })}
      </ScrollView>
    </View>
  );
};

const FORM_KEYS = {
  API_TOKEN: 'api_token',
  IMAGE: 'image',
  FACILITY_ID: 'facility_id',
  FIRST_NAME: 'first_name',
  LAST_NAME: 'last_name',
  CONTACT_NUMBER: 'contact_number',
  EMAIL: 'email',
  PASSWORD: 'password',
};

const CreateNewUser = ({navigation, facilityId, apiToken}) => {
  const {
    data: createUser,
    errorMessage: createUserError,
    isLoading: loadingCreateUser,
    doFetch: _createUser,
  } = useFetch();

  const handleValidate = () => {
    let errors = {};

    return errors;
  };

  const handleCreateUser = async formValues => {
    const newValues = {
      ...formValues,
      [FORM_KEYS.IMAGE]: `data:${formValues[FORM_KEYS.IMAGE]?.type};base64,${
        formValues[FORM_KEYS.IMAGE]?.data
      }`,
      [FORM_KEYS.FACILITY_ID]: facilityId,
    };

    addFacilityUser(newValues, _createUser).then(() => {
      resetForm();
      alert('Successfully created user');
      navigation.navigate('Facilities');
    });
  };

  let initialState = {
    [FORM_KEYS.API_TOKEN]: apiToken,
  };

  const {
    onFieldValueChange,
    onFormSubmit,
    resetForm,
    errors,
    formValues,
  } = useForm(initialState, handleCreateUser, handleValidate);

  useEffect(() => {
    if (createUserError) alert(createUserError);
  }, [createUserError]);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={{padding: 16}}>
        <View style={{marginVertical: 16}}>
          <ImagePickerComponent
            setImage={onFieldValueChange(FORM_KEYS.IMAGE)}
            image={formValues[FORM_KEYS.IMAGE]}
            errorMessage={errors[FORM_KEYS.IMAGE]}
          />
        </View>

        <ErrorHandlingField
          title={'First Name'}
          errorMessage={errors[FORM_KEYS.FIRST_NAME]}
          style={APP_THEME.inputContainerStyle}>
          <TextInput
            value={formValues[FORM_KEYS.FIRST_NAME]}
            onChangeText={newValue =>
              onFieldValueChange(FORM_KEYS.FIRST_NAME, newValue)
            }
            style={APP_THEME.defaultInputStyle}
          />
        </ErrorHandlingField>

        <ErrorHandlingField
          title={'Last Name'}
          errorMessage={errors[FORM_KEYS.LAST_NAME]}
          style={APP_THEME.inputContainerStyle}>
          <TextInput
            value={formValues[FORM_KEYS.LAST_NAME]}
            onChangeText={newValue =>
              onFieldValueChange(FORM_KEYS.LAST_NAME, newValue)
            }
            style={APP_THEME.defaultInputStyle}
          />
        </ErrorHandlingField>

        <ErrorHandlingField
          title={'Email'}
          errorMessage={errors[FORM_KEYS.EMAIL]}
          style={APP_THEME.inputContainerStyle}>
          <TextInput
            value={formValues[FORM_KEYS.EMAIL]}
            keyboardType="email-address"
            autoCapitalize="none"
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
            autoCapitalize="none"
            onChangeText={newValue =>
              onFieldValueChange(FORM_KEYS.PASSWORD, newValue)
            }
            secureTextEntry={true}
            style={APP_THEME.defaultInputStyle}
          />
        </ErrorHandlingField>

        <ErrorHandlingField
          title={'Contact'}
          errorMessage={errors[FORM_KEYS.CONTACT_NUMBER]}
          style={APP_THEME.inputContainerStyle}>
          <TextInput
            value={formValues[FORM_KEYS.CONTACT_NUMBER]}
            keyboardType="numeric"
            onChangeText={newValue =>
              onFieldValueChange(FORM_KEYS.CONTACT_NUMBER, newValue)
            }
            style={APP_THEME.defaultInputStyle}
          />
        </ErrorHandlingField>

        <Button
          title={'Create User'}
          loading={loadingCreateUser}
          buttonStyle={{
            backgroundColor: '#043D10',
            borderRadius: 6,
            marginVertical: 20,
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

export const AddUser = ({navigation, route}) => {
  const {users, facilityName, facilityId} = route.params;

  const {getUser} = useContext(AuthContext);
  const {api_token} = getUser();

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        LeftComponentFunc={handleBack}
        title={'Add Facility User'}
        type={1}
      />
      <Tab.Navigator
        initialRouteName="CreateNewUser"
        swipeEnabled
        tabBarOptions={{
          activeTintColor: 'green',
          inactiveTintColor: 'gray',
          indicatorStyle: {backgroundColor: 'green'},
          labelStyle: {fontSize: 10},
          style: {backgroundColor: styles.container.backgroundColor},
        }}>
        <Tab.Screen name="CreateNewUser" options={{tabBarLabel: 'New User'}}>
          {props => (
            <CreateNewUser
              {...props}
              facilityId={facilityId}
              apiToken={api_token}
            />
          )}
        </Tab.Screen>
        <Tab.Screen
          name="AddFromCurrentUser"
          options={{tabBarLabel: 'Available Users'}}>
          {props => (
            <AddfromCurrentUsers
              {...props}
              apiToken={api_token}
              facilityId={facilityId}
              registeredUsers={users}
              facilityName={facilityName}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
