import React, {useEffect, useState, useContext, useRef} from 'react';
import {View, StyleSheet, ScrollView, Image} from 'react-native';
import {
  CustomHeader,
  TextCombo,
  CollapsibleItemBlock,
  ItemBatchInfo,
} from '../components';
import {Text} from 'react-native-elements';

import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';

import {AuthContext} from '../context';
import {
  getUserById,
  pastTense,
  getNumberOfActiveItems,
  insertCategories,
} from '../utils/helper';
import {APP_THEME} from '../utils/constants';
import {getFacilityLedger, getFacility, getItems} from '../utils/routes';
import {useFetch} from '../hooks';

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
const Tab = createMaterialTopTabNavigator();

const logo = require('../../images/logo/popcom-logo.png');

const FacilityInfo = props => {
  const {
    address,
    created_by,
    facility_type,
    latitude,
    longitude,
    province,
    region,
    created_at,
    total_dispense_count,
    total_inventory_count,
    users,
    numberOfActiveItems,
  } = props;

  let mapRef = useRef(null);

  return (
    <ScrollView style={styles.tabContainer}>
      <Text style={styles.facilityInfoHeader}>Basics</Text>
      <TextCombo
        title={'Facility Type'}
        subTitle={facility_type}
        containerStyle={{marginTop: 8}}
      />
      <View
        style={{
          marginTop: 12,
          flexDirection: 'row',
        }}>
        <TextCombo
          containerStyle={{flexGrow: 1}}
          title={'Created By'}
          subTitle={created_by}
        />
        <TextCombo
          containerStyle={{flexGrow: 1}}
          title={'Created At'}
          subTitle={new Date(created_at).toLocaleDateString()}
        />
      </View>
      <Text
        style={{
          marginTop: 24,
          ...styles.facilityInfoHeader,
        }}>
        Location
      </Text>
      <TextCombo
        title={'Address'}
        subTitle={address}
        containerStyle={{marginTop: 8}}
      />
      <View
        style={{
          marginTop: 12,
          flexDirection: 'row',
        }}>
        <TextCombo
          containerStyle={{flexGrow: 1}}
          title={'Province'}
          subTitle={province}
        />
        <TextCombo
          containerStyle={{flexGrow: 1}}
          title={'Region'}
          subTitle={region}
        />
      </View>

      <MapView
        ref={ref => {
          mapRef = ref;
        }}
        provider={PROVIDER_GOOGLE}
        style={{height: 180, marginVertical: 12}}
        region={{
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          latitudeDelta: 0.001,
          longitudeDelta: 0.0121,
        }}
        onMapReady={() => mapRef.fitToElements(false)}>
        <Marker
          coordinate={{
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
          }}
        />
      </MapView>

      <View
        style={{
          marginVertical: 24,
        }}>
        <Text style={styles.facilityInfoHeader}>Statistics</Text>
        <View style={{marginTop: 16, flexDirection: 'row'}}>
          <TextCombo
            title={users ? users.length : 0}
            subTitle={'Registered Users'}
            icon={'users'}
            containerStyle={{flexGrow: 1}}
          />
          <TextCombo
            title={numberOfActiveItems ?? 0}
            subTitle={'Active Items'}
            icon={'box'}
            containerStyle={{flexGrow: 1}}
          />
        </View>
        <View style={{marginTop: 16, flexDirection: 'row'}}>
          <TextCombo
            title={total_inventory_count ?? 0}
            subTitle={'Total Inventory           '}
            icon={'cart-plus'}
            containerStyle={{flexGrow: 1}}
          />
          <TextCombo
            title={total_dispense_count ?? 0}
            subTitle={'Total Dispensed'}
            icon={'hand-holding-heart'}
            containerStyle={{flexGrow: 1}}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const FacilityUsers = props => {
  const {users} = props;
  return (
    <View style={styles.tabContainer}>
      {users?.map((user, index) => {
        const fullName = `${user.last_name}, ${user.first_name}`;

        return (
          <View
            key={index}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              style={{height: 32, width: 32, marginRight: 10}}
              source={
                user.image
                  ? {uri: `https://popcom.app/images/${user.image}`}
                  : logo
              }
              resizeMode={'contain'}
            />
            <TextCombo title={fullName} subTitle={user.email} />
          </View>
        );
      })}
    </View>
  );
};

const FacilityInventory = props => {
  const {items, facilityId, navigation} = props;
  return (
    <View style={styles.tabContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {items &&
          items.map((item, index) => {
            return (
              <CollapsibleItemBlock
                key={index}
                image={item.image}
                title={item.item_name}
                subTitle={item.category}>
                <ItemBatchInfo
                  navigation={navigation}
                  facilityId={facilityId}
                  item={item}
                />
              </CollapsibleItemBlock>
            );
          })}
      </ScrollView>
    </View>
  );
};

const Ledger = props => {
  const {ledger} = props;
  const dateOptions = {year: 'numeric', month: 'long', day: 'numeric'};

  const dates = new Set(
    ledger &&
      ledger.map(line =>
        new Date(line.created_at).toLocaleDateString('en-US', dateOptions),
      ),
  );

  return (
    <View style={styles.tabContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {Array.from(dates).map((date, index) => {
          return (
            <View key={index} style={{marginBottom: 16}}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: APP_THEME.primaryColor,
                }}>
                {date}
              </Text>
              {ledger
                .filter(
                  line =>
                    new Date(line.created_at).toLocaleDateString(
                      'en-US',
                      dateOptions,
                    ) === date,
                )
                .map((line, index) => {
                  return (
                    <View
                      key={index}
                      style={{marginLeft: 24, marginVertical: 4}}>
                      <Text style={{fontWeight: '600', fontSize: 16}}>
                        {`• ${new Date(line.created_at).toLocaleTimeString(
                          'en-US',
                          {
                            hour12: true,
                            hour: '2-digit',
                            minute: '2-digit',
                          },
                        )}`}
                      </Text>
                      <Text style={{color: 'gray'}}>
                        {`${line.user?.first_name} ${
                          line.user?.last_name
                        } ${pastTense(line.transaction_type)} ${
                          line.quantity > 0
                            ? `+${line.quantity}`
                            : `${line.quantity}`
                        } ${line.uom} of ${line.item?.item_name} from ${
                          line?.facility?.facility_name
                        }`}
                      </Text>
                    </View>
                  );
                })}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export const Facility = ({route, navigation}) => {
  const {created_by, facility_name, id} = route.params;

  const {getUser} = useContext(AuthContext);
  const {api_token} = getUser();

  const {data: ledger, doFetch: fetchLedger} = useFetch();
  const {data: facilityInfo, doFetch: fetchFacilityInfo} = useFetch();
  const {data: items, doFetch: fetchItems} = useFetch(
    insertCategories(api_token),
  );

  const [createdByUser, setCreatedByUser] = useState('');

  const getUsersData = async () => {
    const createdBy = await getUserById(created_by, api_token);
    setCreatedByUser(createdBy.data.first_name);
  };

  const clearUserData = () => {
    setCreatedByUser('');
  };

  useEffect(() => {
    return navigation.addListener('focus', () => {
      getItems(api_token, fetchItems);
    });
  }, []);

  useEffect(() => {
    getUsersData();
    getFacilityLedger(api_token, id, 1, fetchLedger);
    getFacility(api_token, id, fetchFacilityInfo);
  }, [route]);

  return (
    <View style={styles.container}>
      <CustomHeader
        title={facility_name}
        type={1}
        LeftComponentFunc={() => {
          navigation.goBack();
          clearUserData();
        }}
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
          {props => (
            <FacilityInfo
              {...route.params}
              {...facilityInfo}
              numberOfActiveItems={getNumberOfActiveItems(items)}
              created_by={createdByUser}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Users" options={{tabBarLabel: 'Users'}}>
          {props => <FacilityUsers users={facilityInfo?.users} />}
        </Tab.Screen>
        <Tab.Screen name="Inventory" options={{tabBarLabel: 'Inventory'}}>
          {props => (
            <FacilityInventory
              items={items}
              facilityId={id}
              navigation={navigation}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Ledger" options={{tabBarLabel: 'Ledger'}}>
          {props => <Ledger ledger={ledger} />}
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
  itemBatchesHeader: {
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 4,
  },
  itemBatchesInfo: {
    flex: 1,
    alignItems: 'center',
  },
  facilityInfoHeader: {
    fontSize: 18,
    color: APP_THEME.primaryColor,
    fontWeight: 'bold',
  },
  adjustInventoryButton: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: APP_THEME.primaryColor,
    borderRadius: 8,
  },
  adjustInventoryButtonTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
