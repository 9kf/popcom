import React, {useEffect, useState, useContext, useRef} from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import {CustomHeader, InfoBlock} from '../components';
import {Divider} from 'react-native-elements';

import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';

import {AuthContext} from '../context';
import {getUserById} from '../utils/helper';

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
    user_id,
  } = route.params;

  const {getUser} = useContext(AuthContext);
  const {api_token} = getUser();

  const [createdByUser, setCreatedByUser] = useState('');
  const [representative, setRepresentative] = useState('');

  let mapRef = useRef(null);

  const getUsers = async () => {
    const createdBy = await getUserById(created_by, api_token);
    setCreatedByUser(createdBy.data.first_name);
    const userRepresentative = await getUserById(user_id, api_token);
    setRepresentative(userRepresentative.data);
  };

  const clearData = () => {
    setRepresentative('');
    setCreatedByUser('');
  };

  useEffect(() => {
    getUsers();
  }, [route]);

  return (
    <View style={styles.container}>
      <CustomHeader
        title={facility_name}
        type={1}
        LeftComponentFunc={() => {
          navigation.goBack();
          clearData();
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
            subHeader={`${representative.first_name} ${
              representative.last_name
            }`}
            iconName={'user-alt'}
            containerStyle={{
              marginLeft: 12,
              marginVertical: 8,
            }}
          />

          <InfoBlock
            header={'Role / Rank'}
            subHeader={`Facility ${representative.roles}`}
            iconName={'ribbon'}
            containerStyle={{
              marginLeft: 12,
              marginVertical: 8,
            }}
          />

          <InfoBlock
            header={'Email / Username'}
            subHeader={representative.email}
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
        </View>
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
