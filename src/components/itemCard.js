import React, {useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Icon, Card, Divider, Button} from 'react-native-elements';

/**
 * ItemCard Types:
 * 1 = Inventory
 * 2 = Dispense
 * 3 = Facility
 * 4 = request inventory
 * 5 = items
 */

export const ItemCard = ({
  nextFunc,
  title,
  tag,
  tagColor,
  tagLabelColor,
  price,
  count,
  type,
  children,
  defaultCollapsed = true,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  return (
    <Card containerStyle={styles.container}>
      <View style={styles.cardLayout}>
        <View style={{width: '65%'}}>
          <Text style={styles.title}>{title}</Text>
          {type === 3 ? (
            <View style={{...styles.tags, alignItems: 'center'}}>
              <Icon
                name="map-marker-alt"
                type="font-awesome-5"
                color={'#B3B3B3'}
                size={12}
                style={{marginRight: 4}}
              />
              <Text style={{fontSize: 10, color: '#B3B3B3'}}>{price}</Text>
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

              {type != 5 && (
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
                  <Text style={styles.tagText}>{`${price} ea`}</Text>
                </View>
              )}
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
              size={18}
              onPress={() => nextFunc()}
            />
          </View>
        ) : (
          <View>
            <Icon
              name={isCollapsed ? 'chevron-down' : 'chevron-up'}
              type="font-awesome-5"
              color="#D9D9D9"
              onPress={() => setIsCollapsed(!isCollapsed)}
              size={18}
            />
          </View>
        )}
      </View>

      {!isCollapsed && (
        <>
          <Divider style={{backgroundColor: '#fff', elevation: 2}} />
          {children}
          {/* {type === 1 && (
            <InventoryExtension
              itemDetails={details}
              showAdjustInventoryButton={showAdjustInventoryButton}
            />
          )}
          {type === 2 && <DispenseItemsExtension itemDetails={details} />} */}
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
