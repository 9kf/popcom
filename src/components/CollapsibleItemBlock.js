import React, {useState} from 'react';

import {View, TouchableHighlight, Image} from 'react-native';
import {Icon, Text} from 'react-native-elements';

import {useFetch} from '../hooks';

const logo = require('../../images/logo/popcom-logo.png');

export const CollapsibleItemBlock = ({item, children}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleBlockPress = () => setIsCollapsed(!isCollapsed);

  return (
    <TouchableHighlight
      style={{marginVertical: 8}}
      underlayColor={'#F5F5F5'}
      onPress={handleBlockPress}>
      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12,
          }}>
          <Image
            style={{height: 32, width: 32, marginRight: 10}}
            source={
              item?.image
                ? {uri: `https://popcom.app/images/${item.image}`}
                : logo
            }
            resizeMode={'contain'}
          />
          <View style={{flexGrow: 1}}>
            <Text style={{fontSize: 16, fontWeight: 'bold'}}>
              {item.item_name}
            </Text>
            <Text style={{fontSize: 12}}>{item.category}</Text>
          </View>
          <Icon
            name={isCollapsed ? 'chevron-down' : 'chevron-up'}
            type="font-awesome-5"
            color="#D9D9D9"
            size={18}
          />
        </View>

        {!isCollapsed && children}
      </View>
    </TouchableHighlight>
  );
};
