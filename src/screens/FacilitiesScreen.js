import React, {useContext, useState, useEffect} from 'react';

import {View, StyleSheet, ScrollView, RefreshControl} from 'react-native';

import {CustomHeader, ItemCard} from '../components';

import {Button, Icon} from 'react-native-elements';

import {AuthContext} from '../context';

import {useFetch} from '../hooks';

import {POPCOM_URL} from '../utils/constants';

import {
  getFacilityTypeTagColor,
  getFacilityTypeTagLabelColor,
} from '../utils/helper';

const AddFacilityButton = ({navigation}) => (
  <Button
    onPress={() => navigation.navigate('AddFacility')}
    icon={<Icon name="plus" size={16} color="white" type="font-awesome-5" />}
    buttonStyle={{backgroundColor: '#065617', borderRadius: 20}}
  />
);

export const FacilitiesScreen = ({navigation}) => {
  const {getUser} = useContext(AuthContext);
  const {api_token} = getUser();
  const {data, errorMessage, isLoading, fetchData} = useFetch();

  const [facilities, setFacilities] = useState([]);

  const getFacilities = async () => {
    const urlParams = new URLSearchParams({api_token});
    const endpoint = `${POPCOM_URL}/api/get-facilities?${urlParams.toString()}`;
    fetchData(endpoint, {}, () => alert('Unable to get facilities'));
  };

  useEffect(() => {
    return navigation.addListener('focus', () => {
      getFacilities();
    });
  }, []);

  useEffect(() => {
    if (data) {
      setFacilities(data.data);
    }
  }, [data]);

  return (
    <View style={styles.container}>
      <CustomHeader
        title={'Facility'}
        LeftComponentFunc={() => navigation.openDrawer()}
        RightComponent={<AddFacilityButton navigation={navigation} />}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => getFacilities()}
          />
        }>
        {facilities.map(item => {
          return (
            <ItemCard
              key={item.id}
              title={item.facility_name}
              price={item.address}
              navigation={navigation}
              tag={item.facility_type}
              tagColor={getFacilityTypeTagColor(item.facility_type)}
              tagLabelColor={getFacilityTypeTagLabelColor(item.facility_type)}
              type={3}
              nextFunc={() => navigation.navigate('Facility', item)}
            />
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
});
