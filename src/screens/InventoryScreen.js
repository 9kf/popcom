import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView
} from 'react-native';

import { Header } from 'react-native-elements';
import { CustomHeader, ItemCard } from '../components'


export const InventoryScreen = ({ navigation }) => {
    const items = [
        {
            title: "Trust Chocolate Condom",
            count: 5,
            tag: "Male Condom",
            price: 2500,
            tagColor: "#D5EAFF",
            tagLabelColor: "#55AAED"
        },
        {
            title: "Durex Light Condom",
            count: 2,
            tag: "Male Condom",
            price: 2600,
            tagColor: "#D5EAFF",
            tagLabelColor: "#55AAED"
        },
        {
            title: "Mango Female Condom",
            count: 0,
            tag: "Female Condom",
            price: 1600,
            tagColor: "#FED7E5",
            tagLabelColor: "#F288B9"
        },
        {
            title: "Mercilon - 21 Pills",
            count: 6,
            tag: "Pills",
            price: 780,
            tagColor: "#CCFAED",
            tagLabelColor: "#39CAAD"
        },
        {
            title: "Marvelon - 28 Pills",
            count: 6,
            tag: "Pills",
            price: 780,
            tagColor: "#CCFAED",
            tagLabelColor: "#39CAAD"
        },
        {
            title: "D - 35 Pills",
            count: 6,
            tag: "Pills",
            price: 780,
            tagColor: "#CCFAED",
            tagLabelColor: "#39CAAD"
        }
    ]
  
    return (
    <View style={styles.container}>
        <CustomHeader title={"Inventory"} navigation={navigation}/>
        <ScrollView>
        {
            items.map((item,index) => {
                return <ItemCard 
                        key={index} 
                        title={item.title}
                        count={item.count}
                        navigation={navigation}
                        price={item.price}
                        tag={item.tag}
                        tagColor={item.tagColor}
                        tagLabelColor={item.tagLabelColor} />
            })
        }
        </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})