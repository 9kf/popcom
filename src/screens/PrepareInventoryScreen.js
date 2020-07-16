import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Picker,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {Button, Icon, Overlay} from 'react-native-elements';
import {CustomHeader, RequestCard, ErrorHandlingField} from '../components';
import {StatusOverlay} from '../overlays';

import {AuthContext} from '../context';

import {APP_THEME} from '../utils/constants';
import {
  getFacilities,
  getRequestInventory,
  getFacilityBatches,
  transferInventory,
  declineRequest,
  updateTransferStatus,
} from '../utils/api';

let copyOfAllRequests = [];
let lastSelectedFacility = 0;

const CheckoutOverlay = ({isOpen, setIsOpen, items, apiToken, request}) => {
  const [message, setMessage] = useState('');
  const [batches, setBatches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    const toBeTransferredItems = batches
      .filter(batch => batch.preparedQuantity > 0)
      .map(batch => {
        return {
          item_id: batch.item_id,
          batch_inventory_id: batch.id,
          quantity: batch.preparedQuantity,
          uom: 'pcs',
        };
      });
    await transferInventory(
      apiToken,
      request.id,
      toBeTransferredItems,
      message,
    );
    setIsLoading(false);
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      getFacilityBatches(apiToken, request.supplying_facility_id).then(data => {
        const itemIds = items.map(item => {
          return item.item.id;
        });
        const selectedBatchItems = data
          .filter(d => itemIds.indexOf(d.item.id) > -1)
          .map(d => {
            return {...d, preparedQuantity: 0};
          });
        setBatches(selectedBatchItems);
      });
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
          {items.map(item => {
            return (
              <View style={{marginVertical: 8}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 4,
                  }}>
                  <Text style={{fontWeight: 'bold'}}>
                    {item.item.item_name}
                  </Text>
                  <View style={{flexGrow: 1}} />
                  <Text style={{fontWeight: 'bold'}}>{`x${
                    item.quantity
                  }`}</Text>
                </View>

                <View>
                  {batches
                    .filter(batch => batch.item_id === item.item.id)
                    .map(batch => {
                      return (
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <Text>{batch.batch_name}</Text>
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
                              setBatches(copyOfBatches);
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
          containerStyle={{flexGrow: 1}}
          onPress={handleConfirm}
        />
      </View>
    </Overlay>
  );
};

export const PrepareInventoryScreen = ({navigation}) => {
  const [isCheckoutVisible, setIsCheckoutVisible] = useState(false);

  const {getUser} = useContext(AuthContext);
  const {api_token} = getUser();

  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);

  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [acceptedItems, setAcceptedItems] = useState([]);

  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  const [isLoading, setIsLoading] = useState(false);

  const handleReject = async requestInventoryId => {
    setIsLoading(true);
    const response = await declineRequest(api_token, requestInventoryId);
    if (response) {
      const updatedRequests = await getRequestInventory(
        api_token,
        lastSelectedFacility,
      );
      setRequests(updatedRequests);
    }
    setIsLoading(false);
  };

  const handleDeliver = async inventoryTransferId => {
    setIsLoading(true);
    const response = await updateTransferStatus(api_token, inventoryTransferId);
    if (response) {
      const updatedRequests = await getRequestInventory(
        api_token,
        lastSelectedFacility,
      );
      setRequests(updatedRequests);
    }
    setIsLoading(false);
  };

  const filterData = (filter, data = copyOfAllRequests) => {
    const activeData = data.filter(d => d.active);

    if (filter === 'all') {
      setRequests(activeData);
      return;
    }

    const filteredRequests = activeData.filter(data => data.status === filter);
    setRequests(filteredRequests);

    setRequests(activeData);
  };

  useEffect(() => {
    return navigation.addListener('focus', () => {
      getFacilities(api_token).then(data => setFacilities(data));
      if (lastSelectedFacility != 0)
        getRequestInventory(api_token, lastSelectedFacility).then(data => {
          copyOfAllRequests = data;

          filterData(data);
        });
    });
  }, []);

  useEffect(() => {
    getRequestInventory(api_token, selectedFacility).then(data => {
      copyOfAllRequests = data;
      filterData(activeFilter, data);
    });
  }, [selectedFacility]);

  useEffect(() => {
    filterData(activeFilter);
  }, [activeFilter]);

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
              if (value != '') lastSelectedFacility = value;
            }}
            mode={'dropdown'}>
            {facilities.map((item, index) => (
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

      <ScrollView>
        {requests
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
  },
});
