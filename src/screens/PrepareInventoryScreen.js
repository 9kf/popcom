import React, {useState, useEffect, useContext, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {Picker} from '@react-native-community/picker';
import {Button, Icon, Overlay} from 'react-native-elements';
import {CustomHeader, RequestCard, ErrorHandlingField} from '../components';
import {StatusOverlay} from '../overlays';

import {AuthContext} from '../context';
import {APP_THEME} from '../utils/constants';
import {
  transferInventory,
  declineRequest,
  updateTransferStatus,
} from '../utils/api';
import {useFetch} from '../hooks';
import {
  getFacilities,
  getInventoryRequests,
  getBatchesByFacilityId,
} from '../utils/routes';

const CheckoutOverlay = ({isOpen, setIsOpen, items, apiToken, request}) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {data: batches, doFetch: fetchBatches, overrideData} = useFetch();

  const mBatches = useMemo(() => {
    const itemIds = items.map(item => {
      return item.item.id;
    });
    return batches
      ? batches
          .filter(batch => itemIds.indexOf(batch.item_id) > -1)
          .map(batch => {
            if (!batch.preparedQuantity) return {...batch, preparedQuantity: 0};
            else return batch;
          })
      : [];
  }, [batches]);

  const handleConfirm = async () => {
    setIsLoading(true);
    const toBeTransferredItems = mBatches
      .filter(batch => batch.preparedQuantity > 0)
      .map(batch => {
        return {
          item_id: batch.item_id,
          batch_inventory_id: batch.id,
          quantity: batch.preparedQuantity,
          uom: 'pcs',
        };
      });
    const transferred = await transferInventory(
      apiToken,
      request.id,
      toBeTransferredItems,
      message,
    );

    if (!transferred) alert('Not enough stock to transfer');

    setIsLoading(false);
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      getBatchesByFacilityId(
        apiToken,
        request.supplying_facility_id,
        fetchBatches,
      );
    }
  }, [isOpen]);

  return (
    <Overlay
      overlayStyle={APP_THEME.defaultOverlayStyle}
      isVisible={isOpen}
      onBackdropPress={() => setIsOpen(false)}>
      <View style={{padding: 8, flex: 1}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
          }}>
          <Icon
            name="cart-plus"
            size={16}
            color="black"
            type="font-awesome-5"
            containerStyle={{marginRight: 12}}
          />
          <Text style={{fontWeight: 'bold', fontSize: 16}}>Items Summary</Text>
        </View>

        <ScrollView>
          {items.map((item, index) => {
            return (
              <View key={index} style={{marginVertical: 8}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 4,
                  }}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      width: '80%',
                      color: APP_THEME.primaryColor,
                    }}>
                    {item.item.item_name}
                  </Text>
                  <View style={{flexGrow: 1}} />
                  <Text style={{fontWeight: 'bold'}}>{`x${
                    item.quantity
                  }`}</Text>
                </View>

                <View>
                  {mBatches
                    .filter(batch => batch.item_id === item.item.id)
                    .map((batch, index) => {
                      return (
                        <View
                          key={index}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginVertical: 4,
                          }}>
                          <View>
                            <View style={{flexDirection: 'row'}}>
                              <Text
                                style={{fontWeight: 'bold', maxWidth: '90%'}}>
                                {batch.batch_name}
                              </Text>
                              <Text
                                style={{marginLeft: 4, color: 'gray'}}>{`(x${
                                batch.quantity
                              })`}</Text>
                            </View>
                            <Text style={{color: 'gray', fontSize: 16}}>
                              {new Date(
                                batch.expiration_date,
                              ).toLocaleDateString()}
                            </Text>
                          </View>
                          <View style={{flexGrow: 1}} />
                          <TextInput
                            style={{
                              padding: 0,
                              margin: 0,
                              height: 30,
                              fontSize: 12,
                            }}
                            keyboardType={'numeric'}
                            value={batch.preparedQuantity.toString()}
                            onChangeText={newText => {
                              const copyOfBatches = [...batches];
                              const index = batches.findIndex(el => {
                                return el.id === batch.id;
                              });
                              copyOfBatches[index] = {
                                ...batches[index],
                                preparedQuantity: parseInt(newText),
                              };
                              overrideData(copyOfBatches);
                            }}
                          />
                        </View>
                      );
                    })}
                </View>
              </View>
            );
          })}
        </ScrollView>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 16,
          }}>
          <Icon
            name="pen-square"
            size={16}
            color="black"
            type="font-awesome-5"
            containerStyle={{marginRight: 12}}
          />
          <Text style={{fontWeight: 'bold', fontSize: 16}}>Notes</Text>
        </View>

        <TextInput
          placeholder={'Type something...'}
          numberOfLines={5}
          style={{
            backgroundColor: '#EBEBEB',
            borderRadius: 8,
            textAlignVertical: 'top',
            marginBottom: 12,
          }}
          value={message}
          onChangeText={newText => setMessage(newText)}
        />

        <Button
          loading={isLoading}
          title={'Confirm'}
          buttonStyle={{
            backgroundColor: APP_THEME.primaryColor,
            borderRadius: 8,
          }}
          disabledStyle={{backgroundColor: 'gray'}}
          disabledTitleStyle={{color: 'black'}}
          disabled={mBatches.length === 0}
          containerStyle={{flexGrow: 1}}
          onPress={handleConfirm}
        />
      </View>
    </Overlay>
  );
};

export const PrepareInventoryScreen = ({navigation}) => {
  const {getUser} = useContext(AuthContext);
  const {api_token, roles, id} = getUser();

  const [isCheckoutVisible, setIsCheckoutVisible] = useState(false);

  const {data: facilities, doFetch: fetchFacilities} = useFetch();
  const {
    data: inventoryRequests,
    isLoading: loadingInventoryRequests,
    doFetch: fetchInventoryRequests,
  } = useFetch();

  const [selectedRequest, setSelectedRequest] = useState(null);

  const [acceptedItems, setAcceptedItems] = useState([]);

  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  const [isLoading, setIsLoading] = useState(false);

  const [selectedFacility, setSelectedFacility] = useState(null);

  const mSelectedFacility = useMemo(() => {
    return selectedFacility;
  }, [selectedFacility]);

  const mUserFacilities = useMemo(() => {
    if (roles != 'admin' && facilities)
      return facilities.filter(faci => faci.users.indexOf(id) > -1);

    return facilities ?? [];
  }, [facilities]);

  const mRequests = useMemo(() => {
    const activeRequests = inventoryRequests
      ? inventoryRequests.filter(request => request.active)
      : [];

    if (activeFilter === 'all' && inventoryRequests) return activeRequests;

    return activeRequests.filter(request => request.status === activeFilter);
  }, [inventoryRequests, activeFilter]);

  const handleReloadRequests = () => {
    getInventoryRequests(api_token, mSelectedFacility, fetchInventoryRequests);
  };

  const handleReject = async requestInventoryId => {
    setIsLoading(true);
    const response = await declineRequest(api_token, requestInventoryId);
    if (response) {
      handleReloadRequests();
    }
    setIsLoading(false);
  };

  const handleDeliver = async inventoryTransferId => {
    setIsLoading(true);
    const response = await updateTransferStatus(api_token, inventoryTransferId);
    if (response) {
      handleReloadRequests();
    }
    setIsLoading(false);
  };

  useEffect(() => {
    return navigation.addListener('focus', () => {
      getFacilities(api_token, fetchFacilities);
      handleReloadRequests();
    });
  }, []);

  useEffect(() => {
    handleReloadRequests();
  }, [selectedFacility]);

  useEffect(() => {
    if (!isCheckoutVisible) handleReloadRequests();
  }, [isCheckoutVisible]);

  return (
    <View style={styles.container}>
      <CustomHeader
        title={'Prepare Inventory'}
        LeftComponentFunc={() => navigation.openDrawer()}
      />

      <CheckoutOverlay
        request={selectedRequest}
        apiToken={api_token}
        items={acceptedItems}
        isOpen={isCheckoutVisible}
        setIsOpen={setIsCheckoutVisible}
      />

      <StatusOverlay
        isOpen={isStatusFilterOpen}
        setIsOpen={setIsStatusFilterOpen}
        items={['all', 'pending', 'declined', 'accepted', 'in transit']}
        setActiveFilter={setActiveFilter}
      />

      <View
        style={{
          paddingHorizontal: 16,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <ErrorHandlingField
          title={'Facility'}
          style={APP_THEME.inputContainerStyle}>
          <Picker
            style={{height: 37}}
            selectedValue={selectedFacility}
            onValueChange={(value, index) => {
              setSelectedFacility(value);
            }}
            mode={'dropdown'}>
            {mUserFacilities.map((item, index) => (
              <Picker.Item
                key={index}
                value={item.id}
                label={item.facility_name}
              />
            ))}
          </Picker>
        </ErrorHandlingField>

        <TouchableOpacity onPress={() => setIsStatusFilterOpen(true)}>
          <Icon
            name="filter"
            size={16}
            color="black"
            type="font-awesome-5"
            containerStyle={{marginLeft: 12}}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loadingInventoryRequests}
            onRefresh={handleReloadRequests}
          />
        }>
        {mRequests
          .filter(request => request.supplying_facility_id === selectedFacility)
          .map(request => {
            const supplyingFacilityName = facilities.filter(
              f => f.id === request.supplying_facility_id,
            )[0]?.facility_name;
            const receivingFacilityName = facilities.filter(
              f => f.id === request.receiving_facility_id,
            )[0]?.facility_name;

            return (
              <RequestCard
                key={request.id}
                request={request}
                supplyingFacilityName={supplyingFacilityName}
                receivingFacilityName={receivingFacilityName}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{color: '#B4B4B4'}}>ITEM NAME</Text>
                  <View style={{flexGrow: 1}} />
                  <Text style={{color: '#B4B4B4'}}>REQUESTED QTY</Text>
                </View>

                {request.items.map(item => {
                  return (
                    <View key={item.id} style={{flexDirection: 'row'}}>
                      <Text>{item.item.item_name}</Text>
                      <View style={{flexGrow: 1}} />
                      <Text>{`${item.quantity} ea`}</Text>
                    </View>
                  );
                })}

                {request.status === 'pending' && (
                  <View style={{flexDirection: 'row', marginTop: 12}}>
                    <Button
                      onPress={() => {
                        setAcceptedItems(request.items);
                        setSelectedRequest(request);
                        setIsCheckoutVisible(true);
                      }}
                      title={'Accept'}
                      buttonStyle={{
                        backgroundColor: APP_THEME.primaryColor,
                        borderRadius: 8,
                      }}
                      containerStyle={{flexGrow: 1, margin: 12}}
                    />
                    <Button
                      loading={isLoading}
                      onPress={() => handleReject(request.id)}
                      title={'Reject'}
                      buttonStyle={{
                        backgroundColor: '#E74C3C',
                        borderRadius: 8,
                      }}
                      containerStyle={{flexGrow: 1, margin: 12}}
                    />
                  </View>
                )}

                {request.status === 'accepted' && (
                  <View style={{flexDirection: 'row', marginTop: 12}}>
                    <Button
                      onPress={() => {
                        handleDeliver(request.inventory_transfer_id);
                      }}
                      loading={isLoading}
                      title={'Deliver'}
                      buttonStyle={{
                        backgroundColor: APP_THEME.primaryColor,
                        borderRadius: 8,
                      }}
                      containerStyle={{flexGrow: 1, margin: 12}}
                    />
                  </View>
                )}

                {request.status === 'in transit' && (
                  <View>
                    <Text
                      style={{
                        alignSelf: 'center',
                        fontSize: 16,
                        fontWeight: 'bold',
                        marginTop: 12,
                        color: APP_THEME.primaryColor,
                      }}>
                      This request is in transit
                    </Text>
                  </View>
                )}

                {request.status === 'declined' && (
                  <View>
                    <Text
                      style={{
                        alignSelf: 'center',
                        fontSize: 16,
                        fontWeight: 'bold',
                        marginTop: 12,
                        color: 'red',
                      }}>
                      This request was rejected
                    </Text>
                  </View>
                )}
              </RequestCard>
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
});
