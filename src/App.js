import React, {useState, useEffect} from 'react';
import {View, AsyncStorage} from 'react-native';

import {AuthContext} from './context';

import {DrawerNavigation} from './navigation';
import {LoginScreen, InventoryScreen} from './screens';

const App = () => {
  const [user, setUser] = useState(null);

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
      return user
        ? user.data
        : {first_name: 'ohoy', last_name: 'oyea', roles: 'huhuhu'};
    },
  };

  const retrieveUserData = async () => {
    try {
      await AsyncStorage.getItem('user_data', (err, result) => {
        if (result) login(JSON.parse(result));
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    retrieveUserData();
  }, []);

  return (
    <AuthContext.Provider value={authContext}>
      <View style={{flex: 1}}>
        {/* <DrawerNavigation /> */}
        {user ? <DrawerNavigation /> : <LoginScreen />}
      </View>
    </AuthContext.Provider>
  );
};

export default App;
