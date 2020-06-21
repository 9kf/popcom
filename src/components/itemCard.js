import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Icon, Card } from 'react-native-elements';

export const ItemCard = ({ navigation, title, tag, tagColor, tagLabelColor, price, count }) => (
    <Card containerStyle={styles.container}>
        <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center'}}>
            <View>
                <Text style={styles.title}>{title}</Text>
                <View style={styles.tags}>
                    <View style={{backgroundColor: tagColor, padding: 5, borderRadius: 8, flexDirection: 'row', alignItems: 'center', marginRight: 4}}>
                        <Icon
                            name="edit"
                            type="font-awesome-5"
                            color={tagLabelColor}
                            size={8}
                            style={{marginRight: 4}}
                        />
                        <Text style={{fontSize: 10, fontWeight: 'bold', color:tagLabelColor}}>{tag}</Text>
                    </View>

                    <View style={{backgroundColor: "#D9D9D9", padding: 5, borderRadius: 8, flexDirection: 'row', alignItems: 'center'}}>
                        <Icon
                            name="shopping-cart"
                            type="font-awesome-5"
                            color="gray"
                            size={8}
                            style={{marginRight: 4}}
                        />
                        <Text style={{fontSize: 10, fontWeight: 'bold', color:"gray"}}>{`${price}ea`}</Text>
                    </View>
                </View>
            </View>

            <View style={{flexGrow: 1}}/>

            <Text style={styles.count}>{count}</Text>

            <View>
                <Icon name='chevron-down'
                    type="font-awesome-5"
                    color="#D9D9D9" />
            </View>
        </View>
    </Card>
)

const styles = StyleSheet.create({
    container: {
        padding: 20,
        borderRadius: 8,
    },
    count: {
        marginRight: 24,
        color: "#053E11",
        fontWeight: 'bold'
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16
    },
    tags: {
        flexDirection: 'row'
    }
})