import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Icon } from 'react-native-elements';

import { AuthContext } from '../context';

const userPlaceholder = require('../../images/user-placeholder/user-placeholder.png')

export const DrawerScreen = (props) => {

    const { logout, getUser } = useContext(AuthContext);
    const { first_name, last_name, roles } = getUser();

    const drawerItems = [
        {
            iconName: 'home',
            pressFunction: () => alert('to be implemented'),
            label:'Home'
        },
        {
            iconName: 'box',
            pressFunction: () => alert('to be implemented'),
            label:'Item Master'
        },
        {
            iconName: 'store',
            pressFunction: () => alert('to be implemented'),
            label:'Inventory'
        },
        {
            iconName: 'hand-holding-heart',
            pressFunction: () => alert('to be implemented'),
            label:'Dispense Inventory'
        },
        {
            iconName: 'truck',
            pressFunction: () => alert('to be implemented'),
            label:'Request Inventory'
        },
        {
            iconName: 'truck-loading',
            pressFunction: () => alert('to be implemented'),
            label:'Receive Inventory'
        },
        {
            iconName: 'chart-area',
            pressFunction: () => alert('to be implemented'),
            label:'Generate Report'
        }
    ]

    return (
        <View style={styles.container}>
            <View style={styles.userInfo}>
                <Image source={userPlaceholder} style={styles.profilePic} resizeMode={'contain'} />
                <View style={{justifyContent:'center'}}>
                    <Text style={styles.name}>{`${first_name} ${last_name}`}</Text>
                    <Text style={styles.jobTitle}>{`${roles}`}</Text>
                </View>
            </View>

            <DrawerContentScrollView {...props} showsVerticalScrollIndicator={false}>
                <View style={{flex: 1}}>
                    {
                        drawerItems.splice(0, drawerItems.length - 4).map((item, index)=> {
                            return (
                                <DrawerItem 
                                    key={index}
                                    icon={({color, size}) => (
                                        <Icon 
                                            name={item.iconName}
                                            type="font-awesome-5"
                                            size={20} 
                                            color="#21542C" />
                                    )}
                                    label={item.label}
                                    labelStyle={{ color:"#24562F" }}
                                    onPress={item.pressFunction}
                                    style={{alignSelf:'stretch'}}
                                />
                            );
                        })
                    }

                    <Text style={styles.sectionHeader}>D I S T R I B U T I O N</Text>

                    <DrawerItem 
                        icon={({color, size}) => (
                            <Icon 
                                name="hand-holding-heart"
                                type="font-awesome-5"
                                size={20} 
                                color="#21542C" />
                        )}
                        label="Dispense Inventory"
                        labelStyle={{ color:"#24562F" }}
                        // onPress={item.pressFunction}
                        style={{alignSelf:'stretch'}}
                    />

                    <Text style={styles.sectionHeader}>S U P P L Y  C H A I N</Text>
                    
                    {
                        drawerItems.splice(1, drawerItems.length-2).map((item, index)=> {
                            return (
                                <DrawerItem 
                                    key={index}
                                    icon={({color, size}) => (
                                        <Icon 
                                            name={item.iconName}
                                            type="font-awesome-5"
                                            size={20} 
                                            color="#21542C" />
                                    )}
                                    label={item.label}
                                    labelStyle={{ color:"#24562F" }}
                                    onPress={item.pressFunction}
                                    style={{alignSelf:'stretch'}}
                                />
                            );
                        })
                    }

                    <Text style={styles.sectionHeader}>R E P O R T</Text>

                    {
                        drawerItems.splice(1, drawerItems.length).map((item, index)=> {
                            return (
                                <DrawerItem 
                                    key={index}
                                    icon={({color, size}) => (
                                        <Icon 
                                            name={item.iconName}
                                            type="font-awesome-5"
                                            size={20} 
                                            color="#21542C" />
                                    )}
                                    label={item.label}
                                    labelStyle={{ color:"#24562F" }}
                                    onPress={item.pressFunction}
                                    style={{alignSelf:'stretch'}}
                                />
                            );
                        })
                    }
                </View>
            </DrawerContentScrollView>

            <View style={styles.logoutStyle}>
                <DrawerItem 
                    icon={({color, size}) => (
                        <Icon 
                            name="power-off"
                            type="font-awesome-5"
                            size={20} 
                            color="#21542C" />
                    )}
                    label="Logout"
                    labelStyle={{ color:"#24562F" }}
                    onPress={logout}
                />
            </View>

        </View>
    )
} 

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderTopEndRadius: 20,
        borderBottomEndRadius: 20
    },
    userInfo: {
        flexDirection: 'row',
        borderTopEndRadius: 20,
        padding:20,
        justifyContent:'center',
        borderBottomWidth: 2,
        borderBottomColor: '#d3d3d3'
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
        width: 150
    },
    jobTitle: {
        color: '#2B6F3A',
        fontSize: 12
    },
    logoutStyle:{
        alignSelf:'stretch', 
        borderTopWidth: 2, 
        borderTopColor: "#d3d3d3"
    },
    sectionHeader: {
        padding: 8, 
        color:'#C6C6C6'
    }

})