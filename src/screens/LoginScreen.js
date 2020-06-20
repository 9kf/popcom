import React from 'react';

import {
  View,
  TextInput,
  Image,
  Text,
  ScrollView,
  StyleSheet
} from 'react-native';
import { Button } from 'react-native-elements';

const logo = require('../../images/logo/popcom-logo.png')
const title = require('../../images/title/title.png')


const LoginScreen = () => {
  return (
    <View style={styles.container}>
        <View style={styles.endsPadding}/>
        <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false} >
            <Image
                style={{margin: 10}}
                source={logo}/>
            <Image source={title}/>
            
            <View style={styles.form}>
                <TextInput placeholder={'Username / Email'}/>
                <TextInput placeholder={'Password'}/>
                <Button 
                    title={'Login'}
                    buttonStyle={styles.loginButton}
                    type={'solid'}/>
            </View>
            
            <View style={styles.footer}>
                <Text style={styles.footerText}>© 2020 Commission on Population and Development</Text>
                <Text style={styles.footerText}>All rights reserved</Text>
            </View>
        </ScrollView>
        <View style={styles.endsPadding}/>
    </View>
  );
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection: 'row'
    },
    endsPadding:{
        flexGrow: 0.3
    },
    formContainer:{
        flexGrow: 1,
        paddingTop: 50,
        alignItems: 'center'
    },
    form: {
        paddingTop: 40,
        alignSelf: 'stretch'
    },
    loginButton: {
        backgroundColor: '#043D10',
        borderRadius: 8,
        marginTop: 24
    },
    footer: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 16
    },
    footerText: {
        alignSelf: 'center',
        fontSize: 8,
        color: 'gray'
    }
})

export default LoginScreen;
