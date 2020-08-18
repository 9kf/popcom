import React, {useState, useEffect} from 'react';

import {View} from 'react-native';
import {DrawerNavigation} from './navigation';
import {Login, SplashScreen} from './screens';

import AsyncStorage from '@react-native-community/async-storage';
import {AuthContext} from './context';

const App = () => {
  const [user, setUser] = useState(null);
  const [isRetrieving, setIsRetrieving] = useState(true);

  const login = userDetails => {
    try {
      AsyncStorage.setItem('user_data', JSON.stringify(userDetails), err =>
        setUser(userDetails),
      );
    } catch (e) {
      console.log(e);
    }
  };

  const authContext = {
    login: login,
    logout: async () => {
      await AsyncStorage.removeItem('user_data', () => setUser(null));
    },
    getUser: () => {
      return user;
    },
  };

  const retrieveUserData = async () => {
    try {
      await AsyncStorage.getItem('user_data', (err, result) => {
        if (result) {
          setUser(JSON.parse(result));
        }

        setIsRetrieving(false);
      });
    } catch (e) {
      setIsRetrieving(false);
      console.log(e);
    }
  };

  useEffect(() => {
    retrieveUserData();
  }, []);

  return (
    <AuthContext.Provider value={authContext}>
      {isRetrieving ? (
        <SplashScreen />
      ) : (
        <View style={{flex: 1}}>{user ? <DrawerNavigation /> : <Login />}</View>
      )}
    </AuthContext.Provider>
  );
};

export default App;
