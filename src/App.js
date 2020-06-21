import React, { useState, useMemo } from 'react';
import {
  View,
} from 'react-native';

import { AuthContext } from './context';

import { DrawerNavigation } from './navigation'
import { LoginScreen } from './screens'

const App = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const authContext = useMemo(()=>{
    return {
      login: (userDetails) => { 
        setUser(userDetails);
        setIsAuthenticated(true);
       }, 
      logout: () => {
        setUser(null);
        setIsAuthenticated(false);
      },
      getUser: () => { return user.data }
    }
  },[]);

  return (
    <AuthContext.Provider value={authContext}>
      <View style={{flex:1}}>
        {
          isAuthenticated ? 
          <DrawerNavigation/>
          :
          <LoginScreen/>
        }
      </View>
    </AuthContext.Provider>
  );
};

export default App;
