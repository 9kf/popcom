import React, {useState} from 'react';

import {View, TextInput} from 'react-native';
import {Text, Overlay, Button, Icon} from 'react-native-elements';
import {handleInputChange} from '../utils/helper';
import {APP_THEME} from '../utils/constants';

export const ChangePassword = ({isOpen, setIsOpen, currentUser}) => {
  const [newPass, setNewPass] = useState('');

  const handleChangePass = () => {
    const newValues = {
      user_id: currentUser.id,
      first_name: currentUser.first_name,
      last_name: currentUser.last_name,
      contact_number: currentUser.contact_number,
      email: currentUser.email,
      status: 1,
      api_token: currentUser.api_token,
    };
  };

  const handleBackDropPress = () => {
    setIsOpen(false);
  };

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
