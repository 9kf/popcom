import React, {useContext, useState, useEffect} from 'react';

import {View, Image, Text, ScrollView, StyleSheet} from 'react-native';

import {Button} from 'react-native-elements';

import {AuthContext} from '../context';

import {CustomTextInput} from '../components';

import {APP_THEME, POPCOM_URL} from '../utils/constants';

import {useFetch} from '../hooks';

const logo = require('../../images/logo/popcom-logo.png');
const title = require('../../images/title/title.png');

export const LoginScreen = () => {
  const {login} = useContext(AuthContext);

  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const {data, isLoading, fetchData} = useFetch();

  const resetForm = () => {
    setUserName('');
    setPassword('');
  };

  const handleLogin = async ev => {
    const endpoint =
      POPCOM_URL + `/api/login?email=${userName}&password=${password}`;
    const options = {
      headers: {
        accept: 'application/json',
      },
      method: 'post',
    };
    fetchData(endpoint, options);
  };

  useEffect(() => {
    if (data) {
      login(data);
      resetForm();
    }
  }, [data]);

  return (
    <View style={styles.container}>
      <View style={styles.endsPadding} />
      <ScrollView
        contentContainerStyle={styles.formContainer}
        showsVerticalScrollIndicator={false}>
        <Image style={{margin: 10}} source={logo} />
        <Image source={title} />

        <View style={styles.form}>
          <CustomTextInput
            textInputProps={{
              value: userName,
              placeholder: 'Username / Email',
              onChangeText: newText => setUserName(newText),
            }}
            focusedBorderColor={APP_THEME.primaryColor}
          />
          <CustomTextInput
            textInputProps={{
              value: password,
              placeholder: 'Password',
              secureTextEntry: true,
              onChangeText: newText => setPassword(newText),
            }}
            focusedBorderColor={APP_THEME.primaryColor}
          />
          <Button
            title={'Login'}
            buttonStyle={styles.loginButton}
            loading={isLoading}
            loadingStyle={styles.disabledLoginButton}
            type={'solid'}
            onPress={handleLogin}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2020 Commission on Population and Development
          </Text>
          <Text style={styles.footerText}>All rights reserved</Text>
        </View>
      </ScrollView>
      <View style={styles.endsPadding} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  endsPadding: {
    flexGrow: 0.3,
  },
  formContainer: {
    flexGrow: 1,
    paddingTop: 50,
    alignItems: 'center',
  },
  form: {
    paddingTop: 40,
    alignSelf: 'stretch',
  },
  loginButton: {
    backgroundColor: APP_THEME.primaryColor,
    borderRadius: 8,
    marginTop: 12,
  },
  disabledLoginButton: {
    backgroundColor: APP_THEME.primaryColor,
    borderRadius: 8,
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  footerText: {
    alignSelf: 'center',
    fontSize: 8,
    color: 'gray',
  },
});
