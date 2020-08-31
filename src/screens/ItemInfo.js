import React, {useState, useEffect, useContext, useMemo} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  RefreshControl,
} from 'react-native';
import {
  CustomHeader,
  InfoBlock,
  CollapsibleItemBlock,
  ItemBatchInfo,
} from '../components';

import {getUserById, getUserFacilities} from '../utils/helper';
import {AuthContext} from '../context';
import {getFacilities} from '../utils/routes';
import {useFetch} from '../hooks';

const logo = require('../../images/logo/popcom-logo.png');

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
const Tab = createMaterialTopTabNavigator();

const ItemDetails = props => {
  const {category, image, item_description, item_sku} = props;

  return (
    <ScrollView
      style={styles.tabContainer}
      showsVerticalScrollIndicator={false}>
      <View>
        <Image
          style={{height: 150, width: '100%', marginBottom: 12}}
          source={image ? {uri: `https://popcom.app/images/${image}`} : logo}
          resizeMode={'contain'}
        />

        <InfoBlock
          header={'Barcode / SKU'}
          subHeader={item_sku}
          iconName={'barcode'}
          containerStyle={{
            marginVertical: 8,
          }}
        />

        <InfoBlock
          header={'Category'}
          subHeader={category}
          iconName={'edit'}
          containerStyle={{
            marginVertical: 8,
          }}
        />

        <InfoBlock
          header={'Description'}
          subHeader={item_description}
          iconName={'list'}
          containerStyle={{
            marginVertical: 8,
          }}
        />
      </View>
    </ScrollView>
  );
};

const ItemInventory = props => {
  const {facilities, navigation, item, loadingFacilities} = props;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.tabContainer}
      refreshControl={<RefreshControl refreshing={loadingFacilities} />}>
      {facilities &&
        facilities.map((facility, index) => {
          return (
            <CollapsibleItemBlock
              key={index}
              title={facility.facility_name}
              subTitle={facility.address}>
              <ItemBatchInfo
                navigation={navigation}
                facilityId={facility.id}
                item={item}
              />
            </CollapsibleItemBlock>
          );
        })}
    </ScrollView>
  );
};

export const ItemInfo = ({route, navigation}) => {
  const {item_name, created_by} = route.params;

  const {getUser} = useContext(AuthContext);
  const {api_token, roles, facility_id} = getUser();

  const {
    data: facilities,
    isLoading: loadingFacilities,
    doFetch: fetchFacilities,
    clear: clearFacilities,
  } = useFetch(getUserFacilities(roles, facility_id));

  const [createdByUser, setCreatedByUser] = useState('');

  const getUsers = async () => {
    const createdBy = await getUserById(created_by, api_token);
    setCreatedByUser(createdBy.data.first_name);
  };

  useEffect(() => {
    getUsers();
    getFacilities(api_token, fetchFacilities);
  }, [route]);

  useEffect(() => {
    return navigation.addListener('focus', () => {
      clearFacilities();
      getFacilities(api_token, fetchFacilities);
    });
  }, []);

  return (
    <View style={styles.container}>
      <CustomHeader
        title={item_name}
        type={1}
        LeftComponentFunc={() => {
          navigation.goBack();
        }}
        subHeader={`Created by: ${createdByUser}`}
      />

      <Tab.Navigator
        initialRouteName="Info"
        swipeEnabled
        tabBarOptions={{
          activeTintColor: 'green',
          inactiveTintColor: 'gray',
          indicatorStyle: {backgroundColor: 'green'},
          labelStyle: {fontSize: 10},
          style: {backgroundColor: styles.container.backgroundColor},
        }}>
        <Tab.Screen name="Info" options={{tabBarLabel: 'Info'}}>
          {props => <ItemDetails {...route.params} />}
        </Tab.Screen>
        <Tab.Screen name="Inventory" options={{tabBarLabel: 'Inventory'}}>
          {props => (
            <ItemInventory
              item={route.params}
              loadingFacilities={loadingFacilities}
              facilities={facilities}
              navigation={navigation}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  tabContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  dividerStyle: {color: '#B9BABA', height: 1, marginVertical: 10},
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
