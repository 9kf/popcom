import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import {CustomHeader, RequestCard} from '../components';

import {APP_THEME} from '../utils/constants';

export const PrepareInventoryScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <CustomHeader
        title={'Request Inventory'}
        LeftComponentFunc={() => navigation.openDrawer()}
      />

      <RequestCard>
        <View style={{flexDirection: 'row'}}>
          <Text style={{color: '#B4B4B4'}}>ITEM NAME</Text>
          <View style={{flexGrow: 1}} />
          <Text style={{color: '#B4B4B4'}}>REQUESTED QTY</Text>
        </View>

        <View style={{flexDirection: 'row'}}>
          <Text>Trust Chocolate Condom</Text>
          <View style={{flexGrow: 1}} />
          <Text>1000 ea</Text>
        </View>

        <View style={{flexDirection: 'row'}}>
          <Text>Mango Female Condom</Text>
          <View style={{flexGrow: 1}} />
          <Text>1200 ea</Text>
        </View>

        <View style={{flexDirection: 'row'}}>
          <Text>IUD</Text>
          <View style={{flexGrow: 1}} />
          <Text>300 ea</Text>
        </View>

        <View style={{flexDirection: 'row', marginTop: 12}}>
          <Button
            title={' Accept '}
            buttonStyle={{
              backgroundColor: APP_THEME.primaryColor,
              borderRadius: 8,
            }}
            containerStyle={{flexGrow: 1, margin: 12}}
          />
          <Button
            title={'Reject'}
            buttonStyle={{backgroundColor: '#E74C3C', borderRadius: 8}}
            containerStyle={{flexGrow: 1, margin: 12}}
          />
        </View>
      </RequestCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
