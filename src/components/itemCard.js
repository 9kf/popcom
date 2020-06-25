import React, {useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Icon, Card, Divider, Button} from 'react-native-elements';

import {Counter} from '../components';

const InventoryExtension = ({itemDetails}) => {
  return (
    <View style={styles.itemDetailsLayout}>
      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 1, paddingLeft: 12}}>
          <Text style={styles.itemDetailsHeader}>BATCH/LOT NO.</Text>
          {itemDetails.map((item, index) => {
            return (
              <Text key={index} style={{fontWeight: 'bold'}}>
                {item.lotNumber}
              </Text>
            );
          })}
        </View>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text style={styles.itemDetailsHeader}>EXPIRY DATE</Text>
          {itemDetails.map((item, index) => {
            return (
              <Text key={index} style={{color: '#C0C0C0'}}>
                {new Date(item.expiryDate).toDateString()}
              </Text>
            );
          })}
        </View>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text style={styles.itemDetailsHeader}>QTY</Text>
          {itemDetails.map((item, index) => {
            return <Text key={index}>{`${item.quantity} ea`}</Text>;
          })}
        </View>
      </View>
      <Button
        title={'Adjust Inventory'}
        buttonStyle={{
          marginHorizontal: 20,
          marginTop: 16,
          backgroundColor: '#043D10',
          borderRadius: 8,
        }}
        titleStyle={{
          fontSize: 14,
          fontWeight: 'bold',
        }}
        type={'solid'}
      />
    </View>
  );
};

const DispenseItemsExtension = ({itemDetails}) => {
  return (
    <View style={styles.itemDetailsLayout}>
      {itemDetails.map((item, index) => {
        return (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              marginBottom: 8,
            }}>
            <View>
              {index === 0 && (
                <Text style={styles.itemDetailsHeader}>BATCH/LOT NO.</Text>
              )}
              <Text style={{fontWeight: 'bold'}}>{item.lotNumber}</Text>
              <Text style={{color: '#C0C0C0'}}>
                {new Date(item.expiryDate).toDateString()}
              </Text>
            </View>
            <View style={index != 0 && {alignSelf: 'center'}}>
              {index === 0 && <Text style={styles.itemDetailsHeader}>QTY</Text>}
              <Text>{`${item.quantity} ea`}</Text>
            </View>
            <View style={{alignSelf: 'center'}}>
              <Counter />
            </View>
          </View>
        );
      })}
    </View>
  );
};

/**
 * ItemCard Types:
 * 1 = Inventory
 * 2 = Dispense
 * 3 = Facility
 * 4 = request inventory
 * 5 = items
 */

export const ItemCard = ({
  navigation,
  title,
  tag,
  tagColor,
  tagLabelColor,
  price,
  count,
  details,
  type,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <Card containerStyle={styles.container}>
      <View style={styles.cardLayout}>
        <View style={{width: '65%'}}>
          <Text style={styles.title}>{title}</Text>
          {type === 3 ? (
            <View style={styles.tags}>
              <Icon
                name="map-marker-alt"
                type="font-awesome-5"
                color={'#B3B3B3'}
                size={12}
                style={{marginRight: 4}}
              />
              <Text style={{fontSize: 10, color: '#B3B3B3'}}>
                Minglanilla, Cebu City
              </Text>
            </View>
          ) : (
            <View style={styles.tags}>
              <View
                style={{
                  ...styles.tagStyle,
                  backgroundColor: tagColor,
                  marginRight: 4,
                }}>
                <Icon
                  name="edit"
                  type="font-awesome-5"
                  color={tagLabelColor}
                  size={8}
                  style={{marginRight: 4}}
                />
                <Text
                  style={{
                    ...styles.tagText,
                    color: tagLabelColor,
                  }}>
                  {tag}
                </Text>
              </View>

              <View
                style={{
                  ...styles.tagStyle,
                  backgroundColor: '#D9D9D9',
                }}>
                <Icon
                  name="shopping-cart"
                  type="font-awesome-5"
                  color="gray"
                  size={8}
                  style={{marginRight: 4}}
                />
                <Text style={styles.tagText}>{`${price}ea`}</Text>
              </View>
            </View>
          )}
        </View>

        <View style={{flexGrow: 1}} />

        {type === 3 && (
          <View
            style={{
              ...styles.tagStyle,
              backgroundColor: tagColor,
              marginRight: 4,
            }}>
            <Icon
              name="edit"
              type="font-awesome-5"
              color={tagLabelColor}
              size={8}
              style={{marginRight: 4}}
            />
            <Text
              style={{
                ...styles.tagText,
                color: tagLabelColor,
              }}>
              {tag}
            </Text>
          </View>
        )}

        {type != 3 && type != 5 && <Text style={styles.count}>{count}</Text>}

        {type === 3 || type === 5 ? (
          <View style={{marginLeft: 12}}>
            <Icon
              name={'chevron-right'}
              type="font-awesome-5"
              color="#D9D9D9"
            />
          </View>
        ) : (
          <View>
            <Icon
              name={isCollapsed ? 'chevron-down' : 'chevron-up'}
              type="font-awesome-5"
              color="#D9D9D9"
              onPress={() => setIsCollapsed(!isCollapsed)}
            />
          </View>
        )}
      </View>

      {!isCollapsed && (
        <>
          <Divider style={{backgroundColor: '#fff', elevation: 2}} />

          {type === 1 && <InventoryExtension itemDetails={details} />}
          {type === 2 && <DispenseItemsExtension itemDetails={details} />}
        </>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
    paddingTop: 10,
    borderRadius: 8,
    marginTop: 0,
    marginBottom: 8,
  },
  cardLayout: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  count: {
    marginRight: 24,
    color: '#053E11',
    fontWeight: 'bold',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  tags: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  tagStyle: {
    padding: 5,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'gray',
  },
  itemDetailsLayout: {
    paddingVertical: 10,
    paddingHorizontal: 0,
    backgroundColor: '#F1F3F4',
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
  },
  itemDetailsHeader: {
    color: '#C0C0C0',
    fontSize: 11,
    marginBottom: 4,
  },
});
