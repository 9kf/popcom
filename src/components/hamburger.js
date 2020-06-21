import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-elements';


export const Hamburger = ({onPressFunction}) => (
    <View style={styles.iconStyle}>
        <Icon name='bars'
            type="font-awesome"
            color="#fff"
            onPress={onPressFunction} />
    </View>
)

const styles = StyleSheet.create({
    iconStyle: {
        paddingLeft: 20
    }
})