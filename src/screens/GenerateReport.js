import React, {useMemo, useEffect, useContext} from 'react';
import {View, ScrollView, RefreshControl, StyleSheet} from 'react-native';
import {Button, Text, Divider} from 'react-native-elements';
import {CustomHeader} from '../components';

import {APP_THEME} from '../utils/constants';
import {AuthContext} from '../context';
import {useFetch} from '../hooks';
import {requestWriteExternalStoragePermission} from '../utils/helper';
import {getFacilities, generateReport} from '../utils/routes';

export const GenerateReport = ({navigation}) => {
  const {getUser} = useContext(AuthContext);
  const {api_token, roles, facility_id} = getUser();

  const {data: facilities, errorMessage, isLoading, doFetch} = useFetch();

  const mUserFacilities = useMemo(() => {
    if (roles != 'admin' && facilities)
      return facilities.filter(faci => faci.id === facility_id);

    return facilities ?? [];
  }, [facilities]);

  const handleFacilitiesReload = () => {
    getFacilities(api_token, doFetch);
  };

  const handleGenerateReport = (facilityId, facilityName) => async () => {
    const fileName = `${facilityName}-report.xlsx`;
    const permission = await requestWriteExternalStoragePermission();
    if (permission) generateReport(api_token, facilityId, fileName);
  };

  useEffect(() => {
    return navigation.addListener('focus', () => {
      handleFacilitiesReload();
    });
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <CustomHeader
        title={'Generate Report'}
        LeftComponentFunc={() => navigation.openDrawer()}
      />

      <ScrollView
        style={{padding: 16}}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleFacilitiesReload}
          />
        }>
        {mUserFacilities.map((faci, index) => {
          return (
            <View key={index}>
              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: 12,
                  alignItems: 'center',
                }}>
                <View style={{flexGrow: 1, width: '60%'}}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      flexWrap: 'wrap',
                    }}>
                    {faci.facility_name}
                  </Text>
                  <Text style={{fontSize: 14, color: 'gray'}}>
                    {faci.address}
                  </Text>
                </View>
                <Button
                  title={'Generate Report'}
                  buttonStyle={styles.generateReportButton}
                  titleStyle={styles.generateReportButtonTitle}
                  type={'solid'}
                  onPress={handleGenerateReport(faci.id, faci.facility_name)}
                />
              </View>
              <Divider style={{backgroundColor: 'gray', marginBottom: 8}} />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  generateReportButton: {
    marginHorizontal: 20,
    backgroundColor: APP_THEME.primaryColor,
    borderRadius: 8,
  },
  generateReportButtonTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
