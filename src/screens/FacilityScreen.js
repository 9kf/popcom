import React, {useEffect, useState, useContext, useRef} from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import {
  CustomHeader,
  InfoBlock,
  InventoryExtension,
  ItemCard,
} from '../components';
import {Divider} from 'react-native-elements';

import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';

import {AuthContext} from '../context';
import {
  getUsers,
  getUserById,
  getTagColor,
  getTagLabelColor,
} from '../utils/helper';
import {getItems, getFacilityBatches} from '../utils/api';

export const FacilityScreen = ({route, navigation}) => {
  const {
    address,
    created_by,
    facility_name,
    facility_type,
    id,
    latitude,
    longitude,
    province,
    region,
  } = route.params;

  const {getUser} = useContext(AuthContext);
  const {api_token} = getUser();

  const [createdByUser, setCreatedByUser] = useState('');
  const [representative, setRepresentative] = useState('');

  const [items, setItems] = useState([]);
  const [batches, setBatches] = useState([]);

  let mapRef = useRef(null);

  const getUsersData = async () => {
    const createdBy = await getUserById(created_by, api_token);
    setCreatedByUser(createdBy.data.first_name);
    const users = await getUsers(api_token);
    const userRepresentative = users.data.filter(
      user => user.facility_id === id,
    )[0];
    setRepresentative(userRepresentative);
  };

  const clearUserData = () => {
    setRepresentative('');
    setCreatedByUser('');
  };

  useEffect(() => {
    getUsersData();
    getItems(api_token).then(data => {
      setItems(data);
    });
  }, [route]);

  useEffect(() => {
    getFacilityBatches(api_token, id).then(data => {
      setBatches(data);
    });
  }, [items]);

  return (
    <View style={styles.container}>
      <CustomHeader
        title={facility_name}
        type={1}
        LeftComponentFunc={() => {
          navigation.goBack();
          clearUserData();
        }}
        subHeader={`Created by: ${createdByUser}`}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{paddingHorizontal: 24}}>
          <Divider
            style={{
              ...styles.dividerStyle,
              marginVertical: 0,
              marginBottom: 10,
            }}
          />

          <Text style={{color: '#B9BABA', fontSize: 16}}>ACCOUNT</Text>
          <InfoBlock
            header={'Complete Name'}
            subHeader={
              representative
                ? `${representative.first_name} ${representative.last_name}`
                : ''
            }
            iconName={'user-alt'}
            containerStyle={{
              marginLeft: 12,
              marginVertical: 8,
            }}
          />

          <InfoBlock
            header={'Role / Rank'}
            subHeader={representative ? `Facility ${representative.roles}` : ''}
            iconName={'ribbon'}
            containerStyle={{
              marginLeft: 12,
              marginVertical: 8,
            }}
          />

          <InfoBlock
            header={'Email / Username'}
            subHeader={representative ? representative.email : ''}
            iconName={'envelope-square'}
            containerStyle={{
              marginLeft: 12,
              marginVertical: 8,
            }}
          />

          <Divider style={styles.dividerStyle} />

          <Text style={{color: '#B9BABA', fontSize: 16}}>LOCATION</Text>

          <InfoBlock
            header={'Address'}
            subHeader={address}
            iconName={'map-pin'}
            containerStyle={{
              marginLeft: 12,
              marginVertical: 8,
              width: '85%',
            }}
          />
          <InfoBlock
            header={'Province, Region'}
            subHeader={`${province}, Region ${region}`}
            iconName={'map-signs'}
            iconContainerStyle={{marginRight: 8}}
            containerStyle={{
              marginLeft: 8,
              marginVertical: 8,
            }}
          />

          <MapView
            ref={ref => {
              mapRef = ref;
            }}
            provider={PROVIDER_GOOGLE}
            style={{height: 200, marginTop: 12}}
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

          <Divider style={styles.dividerStyle} />

          <Text style={{color: '#B9BABA', fontSize: 16, marginVertical: 12}}>
            Inventory
          </Text>
        </View>

        {items.map((item, index) => {
          return (
            <ItemCard
              title={item.item_name}
              price={batches
                .filter(batch => batch.item_id === item.id)
                .reduce((total, item) => {
                  return total + item.quantity;
                }, 0)}
              tag={item.category}
              tagColor={getTagColor(item.category)}
              tagLabelColor={getTagLabelColor(item.category)}
              type={1}>
              <InventoryExtension
                navigation={navigation}
                facilityId={id}
                item={item}
                itemDetails={batches.filter(batch => batch.item_id === item.id)}
                showAdjustInventory={false}
              />
            </ItemCard>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9FC',
  },
  dividerStyle: {color: '#B9BABA', height: 1, marginVertical: 10},
});
