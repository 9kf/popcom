import React, {useContext, useState} from 'react';

import {View, Text, StyleSheet, Image} from 'react-native';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {Icon} from 'react-native-elements';
import {ChangePassword} from '../overlays';

import {AuthContext} from '../context';

const logo = require('../../images/logo/popcom-logo.png');

export const Drawer = props => {
  const {logout, getUser} = useContext(AuthContext);
  const {first_name, last_name, roles, image} = getUser();

  const [activeItem, setActiveItem] = useState(0);
  const [isChangePassOpen, setIsChangePassOpen] = useState(false);

  const drawerItems = [
    {
      iconName: 'home',
      pressFunction: () => props.navigation.navigate('Home'),
      label: 'Home',
    },
    {
      iconName: 'box',
      pressFunction: () => props.navigation.navigate('ItemMaster'),
      label: 'Item Master',
    },
    {
      iconName: 'cart-plus',
      pressFunction: () => props.navigation.navigate('Inventory'),
      label: 'Inventory',
    },
    {
      iconName: 'store',
      pressFunction: () => props.navigation.navigate('Facilities'),
      label: 'Facility',
    },
    {
      iconName: 'hand-holding-heart',
      pressFunction: () => props.navigation.navigate('Dispense'),
      label: 'Dispense Inventory',
    },
    {
      iconName: 'truck',
      pressFunction: () => props.navigation.navigate('RequestInventory'),
      label: 'Request Inventory',
    },
    {
      iconName: 'shopping-basket',
      pressFunction: () => props.navigation.navigate('PrepareInventory'),
      label: 'Prepare Inventory',
    },
    {
      iconName: 'truck-loading',
      pressFunction: () => props.navigation.navigate('ReceiveInventory'),
      label: 'Receive Inventory',
    },
    {
      iconName: 'chart-area',
      pressFunction: () => props.navigation.navigate('GenerateReport'),
      label: 'Generate Report',
    },
  ];

  const handleChangePasswordPress = () => {
    setIsChangePassOpen(true);
  };

  const handleItemPress = (pressFunc, index) => () => {
    pressFunc();
    setActiveItem(index);
  };

  return (
    <View style={styles.container}>
      <ChangePassword
        currentUser={getUser()}
        isOpen={isChangePassOpen}
        setIsOpen={setIsChangePassOpen}
      />

      <View style={styles.userInfo}>
        <Image
          source={image ?? logo}
          style={styles.profilePic}
          resizeMode={'contain'}
        />
        <View style={{justifyContent: 'center'}}>
          <Text style={styles.name}>{`${first_name} ${last_name}`}</Text>
          <Text style={styles.jobTitle}>{`${roles}`}</Text>
          <Text
            style={styles.changePassword}
            onPress={handleChangePasswordPress}>
            Change Password
          </Text>
        </View>
      </View>

      <DrawerContentScrollView {...props} showsVerticalScrollIndicator={false}>
        <View style={{flex: 1}}>
          {drawerItems.map((item, index) => {
            if (index <= 3) {
              return (
                <DrawerItem
                  key={index}
                  icon={({color, size}) => (
                    <Icon
                      name={item.iconName}
                      type="font-awesome-5"
                      size={15}
                      color="#21542C"
                    />
                  )}
                  label={item.label}
                  labelStyle={styles.drawerItemLabel}
                  onPress={handleItemPress(item.pressFunction, index)}
                  style={{
                    alignSelf: 'stretch',
                    backgroundColor: index === activeItem ? '#E9F0EA' : 'white',
                  }}
                />
              );
            }
          })}

          <Text style={styles.sectionHeader}>D I S T R I B U T I O N</Text>

          {drawerItems.map((item, index) => {
            if (index === 4) {
              return (
                <DrawerItem
                  key={index}
                  icon={({color, size}) => (
                    <Icon
                      name={item.iconName}
                      type="font-awesome-5"
                      size={15}
                      color="#21542C"
                    />
                  )}
                  label={item.label}
                  labelStyle={styles.drawerItemLabel}
                  onPress={handleItemPress(item.pressFunction, index)}
                  style={{
                    alignSelf: 'stretch',
                    backgroundColor: index === activeItem ? '#E9F0EA' : 'white',
                  }}
                />
              );
            }
          })}

          <Text style={styles.sectionHeader}>S U P P L Y C H A I N</Text>

          {drawerItems.map((item, index) => {
            if (index > 4 && index < 8) {
              return (
                <DrawerItem
                  key={index}
                  icon={({color, size}) => (
                    <Icon
                      name={item.iconName}
                      type="font-awesome-5"
                      size={15}
                      color="#21542C"
                    />
                  )}
                  label={item.label}
                  labelStyle={styles.drawerItemLabel}
                  onPress={handleItemPress(item.pressFunction, index)}
                  style={{
                    alignSelf: 'stretch',
                    backgroundColor: index === activeItem ? '#E9F0EA' : 'white',
                  }}
                />
              );
            }
          })}

          <Text style={styles.sectionHeader}>R E P O R T</Text>

          {drawerItems.map((item, index) => {
            if (index === drawerItems.length - 1) {
              return (
                <DrawerItem
                  key={index}
                  icon={({color, size}) => (
                    <Icon
                      name={item.iconName}
                      type="font-awesome-5"
                      size={15}
                      color="#21542C"
                    />
                  )}
                  label={item.label}
                  labelStyle={styles.drawerItemLabel}
                  onPress={handleItemPress(item.pressFunction, index)}
                  style={{
                    alignSelf: 'stretch',
                    backgroundColor: index === activeItem ? '#E9F0EA' : 'white',
                  }}
                />
              );
            }
          })}
        </View>
      </DrawerContentScrollView>

      <View style={styles.logoutStyle}>
        <DrawerItem
          icon={({color, size}) => (
            <Icon
              name="power-off"
              type="font-awesome-5"
              size={15}
              color="#21542C"
            />
          )}
          label="Logout"
          labelStyle={styles.drawerItemLabel}
          onPress={logout}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopEndRadius: 6,
    borderBottomEndRadius: 6,
  },
  userInfo: {
    flexDirection: 'row',
    borderTopEndRadius: 6,
    padding: 20,
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#d3d3d3',
  },
  profilePic: {
    borderRadius: 40,
    width: 70,
    height: 70,
    marginRight: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    width: 150,
  },
  jobTitle: {
    color: '#2B6F3A',
    fontSize: 12,
  },
  changePassword: {
    color: '#2B6F3A',
    fontSize: 12,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    marginTop: 8,
  },
  logoutStyle: {
    alignSelf: 'stretch',
    borderTopWidth: 2,
    borderColor: '#d3d3d3',
  },
  sectionHeader: {
    paddingLeft: 8,
    color: '#C6C6C6',
  },
  drawerItemLabel: {
    color: '#24562F',
    fontSize: 13,
  },
});
