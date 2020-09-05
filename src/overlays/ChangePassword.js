import React, {useState, useEffect, useContext} from 'react';

import {View, TextInput} from 'react-native';
import {Text, Overlay, Button, Icon} from 'react-native-elements';
import {handleInputChange} from '../utils/helper';

import {AuthContext} from '../context';
import {editUser} from '../utils/routes';
import {useFetch} from '../hooks';

export const ChangePassword = ({isOpen, setIsOpen, currentUser}) => {
  const {logout} = useContext(AuthContext);

  const {
    data: userEdit,
    errorMessage: userEditError,
    doFetch: _userEdit,
  } = useFetch();
  const [newPass, setNewPass] = useState('');

  const handleChangePass = () => {
    const newValues = {
      user_id: currentUser.id,
      first_name: currentUser.first_name,
      last_name: currentUser.last_name,
      contact_number: currentUser.contact_number,
      email: currentUser.email,
      password: newPass,
      status: 1,
      api_token: currentUser.api_token,
    };

    editUser(newValues, _userEdit);
  };

  const handleBackDropPress = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (userEdit) logout();
  }, [userEdit]);

  useEffect(() => {
    if (userEditError) alert(userEditError);
  }, [userEditError]);

  return (
    <View>
      <Overlay
        visible={isOpen}
        onBackdropPress={handleBackDropPress}
        overlayStyle={{margin: 32, alignSelf: 'stretch'}}>
        <View style={{width: '100%'}}>
          <Text style={{fontSize: 18, fontWeight: 'bold'}}>
            Change Password
          </Text>
          <TextInput
            style={{
              borderBottomWidth: 1,
              borderBottomColor: 'black',
              marginVertical: 12,
            }}
            secureTextEntry
            placeholder={'New Password'}
            onChangeText={handleInputChange(setNewPass)}
            value={newPass}
          />
          <Button
            title={'Change'}
            //   loading={loadingCreateUser}
            disabled={newPass === ''}
            disabledTitleStyle={{color: 'gray'}}
            buttonStyle={{
              backgroundColor: '#043D10',
              borderRadius: 6,
            }}
            onPress={handleChangePass}
          />
        </View>
      </Overlay>
    </View>
  );
};
