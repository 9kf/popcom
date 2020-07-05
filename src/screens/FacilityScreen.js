import React, {useEffect, useState, useContext, useRef} from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import {CustomHeader} from '../components';
import {Icon, Divider} from 'react-native-elements';

import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';

import {POPCOM_URL} from '../utils/constants';
import {AuthContext} from '../context';

const InfoBlock = ({
  iconName,
  header,
  subHeader,
  containerStyle = {},
  iconContainerStyle = {marginRight: 12},
}) => (
  <View style={containerStyle}>
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <Icon
        name={iconName}
        type="font-awesome-5"
        color="#D9D9D9"
        size={20}
        containerStyle={iconContainerStyle}
      />
      <View>
        <Text style={{fontWeight: 'bold', fontSize: 16}}>{header}</Text>
        <Text>{subHeader}</Text>
      </View>
    </View>
  </View>
);

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

  const getUserById = async userID => {
    const urlParams = new URLSearchParams({
      user_id: userID,
      api_token,
    });
    const endpoint = `${POPCOM_URL}/api/get-user?${urlParams.toString()}`;
    const options = {
      headers: {
        accept: 'application/json',
      },
      method: 'post',
    };
    const request = await fetch(endpoint, options);

    if (!request.ok) {
      alert('failed to get user');
      return;
    }

    return await request.json();
  };

  const getUsers = async () => {
    const createdBy = await getUserById(created_by);
    setCreatedByUser(createdBy.data.first_name);
    const userRepresentative = await getUserById(user_id);
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
  },
  dividerStyle: {color: '#B9BABA', height: 1, marginVertical: 10},
});
