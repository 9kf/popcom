import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity
} from 'react-native';

import { Card, Icon } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';

const title = require('../../images/title/title.png')

const HomeScreen = ({navigation}) => {
  return (
    <View style={profileStyles.container}>
        <View style={profileStyles.profileSection}>
            <TouchableOpacity onPress={()=> navigation.openDrawer()}>
                <Image source={title} style={profileStyles.profilePic} resizeMode={'contain'} />
            </TouchableOpacity>
            <View style={profileStyles.profileInfoSection}>
                <Text style={profileStyles.userName}>Welcome Diane</Text>
                <Text style={profileStyles.subHeaderText}>What are your goals today?</Text>
            </View>
        </View>

        <View style={numbersStyles.numbersSection}>
            <View style={{ flexGrow: 1, alignSelf: 'stretch', paddingLeft: 40 }}>
                <Text style={numbersStyles.numbersHeader}>Total Dispense Transactions</Text>
                <Text style={numbersStyles.numbersStats}>288</Text>
            </View>
            <View style={{ flexGrow: 1 }}>
                <Text style={numbersStyles.numbersHeader}>Total Inventory Count</Text>
                <Text style={numbersStyles.numbersStats}>10,582</Text>
            </View>
        </View>

        <View style={optionStyles.optionsSection}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{flexDirection: 'row'}}>
                    <Card containerStyle={optionStyles.card}>
                        <Icon name='area-chart'
                            type="font-awesome"
                            size={42}
                            color="#0984E3"
                            style={{ marginBottom: 4 }} />
                        <Text style={{fontSize: 12, color:'#0984E3', alignSelf:'center'}}>Generate</Text>
                        <Text style={{fontSize: 12, color:'#0984E3', alignSelf:'center'}}>Report</Text>
                    </Card>
                    <Card containerStyle={optionStyles.card}>
                        <Icon name='boxes'
                            type="font-awesome-5"
                            size={42}
                            color="#00CEC9"
                            style={{ marginBottom: 4 }} />
                        <Text style={{fontSize: 12, color:'#00CEC9', alignSelf:'center'}}>View</Text>
                        <Text style={{fontSize: 12, color:'#00CEC9', alignSelf:'center'}}>Inventory</Text>
                    </Card>
                </View>

                <View style={{flexDirection: 'row'}}>
                    <Card containerStyle={optionStyles.card}>
                        <Icon name='box-open'
                            type="font-awesome-5"
                            size={42}
                            color="#DC4E4F"
                            style={{ marginBottom: 4 }} />
                        <Text style={{fontSize: 12, color:'#DC4E4F', alignSelf:'center'}}>View</Text>
                        <Text style={{fontSize: 12, color:'#DC4E4F', alignSelf:'center'}}>All Items</Text>
                    </Card>
                    <Card containerStyle={optionStyles.card}>
                        <Icon name='truck'
                            type="font-awesome"
                            size={42}
                            color="#E17055"
                            style={{ marginBottom: 4 }} />
                        <Text style={{fontSize: 12, color:'#E17055', alignSelf:'center'}}>Inventory</Text>
                        <Text style={{fontSize: 12, color:'#E17055', alignSelf:'center'}}>Request</Text>
                    </Card>
                </View>

                <View style={{flexDirection: 'row'}}>
                    <Card containerStyle={optionStyles.card}>
                        <Icon name='truck-loading'
                            type="font-awesome-5"
                            size={42}
                            color="#E84393"
                            style={{ marginBottom: 4 }} />
                        <Text style={{fontSize: 12, color:'#E84393', alignSelf:'center'}}>Receive</Text>
                        <Text style={{fontSize: 12, color:'#E84393', alignSelf:'center'}}>Inventory</Text>
                    </Card>
                    <Card containerStyle={optionStyles.card}>
                        <Icon name='dolly'
                            type="font-awesome-5"
                            size={42}
                            color="#6C5CE7"
                            style={{ marginBottom: 4 }} />
                        <Text style={{fontSize: 12, color:'#6C5CE7', alignSelf:'center'}}>Inventory</Text>
                        <Text style={{fontSize: 12, color:'#6C5CE7', alignSelf:'center'}}>Adjustments</Text>
                    </Card>
                </View>
            </ScrollView>
        </View>

    </View>
  );
};

const profileStyles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#F5F9FC'
    },
    profileSection: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        padding: 20,
    },
    profilePic: {
        borderRadius: 40,
        width: 70,
        height: 70,
        marginRight: 20,
    },
    profileInfoSection: {
        justifyContent: 'center',
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    subHeaderText: {
        fontSize: 12,
        color: 'gray'
    }
})

const numbersStyles = StyleSheet.create({
    numbersSection: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
    },
    numbersHeader: {
        fontSize: 12,
        width: 100,
        
    },
    numbersStats: {
        fontWeight: 'bold',
        fontSize: 32
    }
})

const optionStyles = StyleSheet.create({
    optionsSection: {flexGrow: 1, alignSelf:'stretch', justifyContent:'space-evenly'},
    card: { flexGrow: 0.5, alignItems:'center'}
})

export default HomeScreen;
