import React, {useState, useMemo} from 'react';
import {View} from 'react-native';

import {AuthContext} from './context';

import {DrawerNavigation} from './navigation';
import {LoginScreen, InventoryScreen} from './screens';

const App = () => {
  const [user, setUser] = useState(null);

  const authContext = {
    login: userDetails => {
      setUser(userDetails);
    },
    logout: () => {
      setUser(null);
    },
    getUser: () => {
      return user.data;
    },
  };

  return (
    <AuthContext.Provider value={authContext}>
      <View style={{flex: 1}}>
        {user ? <DrawerNavigation /> : <LoginScreen />}
      </View>
    </AuthContext.Provider>
  );
};

export default App;
