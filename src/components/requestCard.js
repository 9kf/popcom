import React, {useState} from 'react';
import {View, Text, TouchableHighlight} from 'react-native';
import {Icon, Card, Divider} from 'react-native-elements';

export const RequestCard = ({children}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <Card containerStyle={{elevation: 4, borderRadius: 8, padding: 0}}>
      <TouchableHighlight
        onPress={() => setIsCollapsed(!isCollapsed)}
        underlayColor={'#F5F5F5'}>
        <>
          <View
            style={{flexDirection: 'row', alignItems: 'center', padding: 16}}>
            <View style={{flexGrow: 1}}>
              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: 8,
                  alignItems: 'center',
                }}>
                <Text style={{fontWeight: 'bold'}}>RQT #2020001231-3922</Text>

                <View style={{flexGrow: 1}} />

                <View
                  style={{
                    flexDirection: 'row',
                    borderRadius: 12,
                    backgroundColor: '#D9D9D9',
                    alignItems: 'center',
                    padding: 4,
                  }}>
                  <Icon
                    name={'shopping-cart'}
                    type="font-awesome-5"
                    color="#B3B3B3"
                    size={10}
                    containerStyle={{marginRight: 4}}
                  />
                  <Text style={{color: '#B3B3B3', fontSize: 10}}>2500 ea</Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 4,
                }}>
                <Icon
                  name={'calendar-alt'}
                  type="font-awesome-5"
                  color="#B3B3B3"
                  size={16}
                  containerStyle={{marginRight: 8}}
                />
                <Text style={{fontSize: 12, color: '#B4B4B4'}}>
                  June 25, 2020 10:45 A.M
                </Text>
              </View>

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon
                  name={'truck'}
                  type="font-awesome-5"
                  color="#B3B3B3"
                  size={12}
                  containerStyle={{marginRight: 8}}
                />
                <Text
                  style={{
                    fontSize: 10,
                    color: '#B4B4B4',
                    marginRight: 8,
                    width: 100,
                  }}>
                  RF: Minglanilla Rural Facility
                </Text>

                <Icon
                  name={'truck-loading'}
                  type="font-awesome-5"
                  color="#B3B3B3"
                  size={12}
                  containerStyle={{marginRight: 8}}
                />
                <Text style={{fontSize: 10, color: '#B4B4B4', width: 100}}>
                  SF: Cebu Main Office Facility
                </Text>
              </View>
            </View>

            <Icon
              name={isCollapsed ? 'chevron-down' : 'chevron-up'}
              type="font-awesome-5"
              color="#D9D9D9"
              size={20}
              containerStyle={{marginLeft: 12}}
            />
          </View>

          {!isCollapsed && (
            <>
              <Divider style={{backgroundColor: 'white', elevation: 2}} />

              <View
                style={{
                  borderBottomRightRadius: 8,
                  borderBottomLeftRadius: 8,
                  padding: 8,
                  backgroundColor: '#F1F3F4',
                  padding: 16,
                }}>
                {children}
              </View>
            </>
          )}
        </>
      </TouchableHighlight>
    </Card>
  );
};
