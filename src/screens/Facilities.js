import React, {useContext, useEffect, useMemo} from 'react';

import {View, StyleSheet, ScrollView, RefreshControl, Text} from 'react-native';
import {CustomHeader, ItmCard, ItemTag} from '../components';
import {Button, Icon} from 'react-native-elements';

import {AuthContext} from '../context';
import {useFetch} from '../hooks';
import {getFacilities} from '../utils/routes';
import {APP_THEME} from '../utils/constants';
import {getUserFacilities} from '../utils/helper';

const AddFacilityButton = ({navigation}) => (
  <Button
    onPress={() => navigation.navigate('AddFacility')}
    icon={<Icon name="plus" size={16} color="white" type="font-awesome-5" />}
    buttonStyle={{backgroundColor: '#065617', borderRadius: 20}}
  />
);

export const Facilities = ({navigation}) => {
  const {getUser} = useContext(AuthContext);
  const {api_token, roles, facility_id} = getUser();
  const {data: facilities, errorMessage, isLoading, doFetch} = useFetch(
    getUserFacilities(roles, facility_id),
  );

  const handleFacilitiesReload = () => {
    getFacilities(api_token, doFetch);
  };

  const navigateToFacility = facility => () =>
    navigation.navigate('Facility', facility);

  useEffect(() => {
    return navigation.addListener('focus', () => {
      getFacilities(api_token, doFetch);
    });
  }, []);

  useEffect(() => {
    if (errorMessage) alert(errorMessage);
  }, [errorMessage]);

  return (
    <View style={styles.container}>
      <CustomHeader
        title={'Facility'}
        LeftComponentFunc={() => navigation.openDrawer()}
        {...roles === 'admin' && {
          RightComponent: <AddFacilityButton navigation={navigation} />,
        }}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleFacilitiesReload}
          />
        }>
        {facilities &&
          facilities.map((faci, index) => {
            return (
              <ItmCard key={index} pressFunc={navigateToFacility(faci)}>
                <View style={styles.facilityInfoLayout}>
                  <View style={styles.facilityInfoText}>
                    <Text style={{...APP_THEME.cardTitleDefaultStyle}}>
                      {faci.facility_name}
                    </Text>
                    <View style={{flexDirection: 'row'}}>
                      <Icon
                        name="map-marker-alt"
                        type="font-awesome-5"
                        color={'#B3B3B3'}
                        size={12}
                        style={{marginRight: 4}}
                      />
                      <Text style={styles.facilityInfoAddress}>
                        {faci.address}
                      </Text>
                    </View>
                  </View>
                  <ItemTag tag={faci.facility_type} />
                </View>
              </ItmCard>
            );
          })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  facilityInfoLayout: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  facilityInfoText: {flexGrow: 1, width: '70%'},
  facilityInfoAddress: {fontSize: 10, color: '#B3B3B3'},
});
