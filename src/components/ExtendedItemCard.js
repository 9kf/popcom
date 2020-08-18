import React, {useState} from 'react';

import {View, StyleSheet, TouchableHighlight, Text} from 'react-native';
import {Icon, Card, Divider} from 'react-native-elements';
import {ItemTag} from '../components';

import {APP_THEME} from '../utils/constants';

export const ExtendedItemCard = ({
  title,
  category,
  numberOfPieces,
  numberOfDispensedItems,
  children,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Card containerStyle={styles.cardContainer}>
      <TouchableHighlight underlayColor={'#F5F5F5'} onPress={handleToggle}>
        <>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 16,
            }}>
            <View style={{flexGrow: 1}}>
              <Text style={APP_THEME.cardTitleDefaultStyle}>{title}</Text>
              <View style={{flexDirection: 'row'}}>
                <ItemTag tag={category} />
                <ItemTag tag={`${numberOfPieces} ea`} />
              </View>
            </View>
            <View style={{marginLeft: 4}}>
              <Icon
                name={isCollapsed ? 'chevron-down' : 'chevron-up'}
                type="font-awesome-5"
                color="#D9D9D9"
                size={18}
              />
            </View>
          </View>

          {!isCollapsed && <View style={{marginBottom: 16}}>{children}</View>}
        </>
      </TouchableHighlight>
    </Card>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    padding: 0,
    borderRadius: 8,
    marginTop: 0,
    marginBottom: 8,
  },
});
