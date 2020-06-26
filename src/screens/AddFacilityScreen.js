import React, {useState, useContext, useEffect} from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Picker,
} from 'react-native';

import {CustomHeader} from '../components';

import {Button, Icon, Card, Overlay} from 'react-native-elements';

import ImagePicker from 'react-native-image-picker';

import {AuthContext} from '../context';

import {
  FACILITY_TYPE,
  POPCOM_URL,
  MAPBOX_API_KEY,
  MAPBOX_SEARCH_URL,
} from '../utils/constants';

import {debounce} from '../utils/helper';

const FIELD_KEYS = {
  firstName: 'first_name',
  lastName: 'last_name',
  contactNumber: 'contactN',
};

const SuggestionItem = props => {
  return (
    <TouchableOpacity onPress={() => props.itemOnpress(props.item)}>
      <View
        style={{flexDirection: 'row', alignItems: 'center', marginBottom: 12}}>
        <Icon
          name="map-marker-alt"
          size={20}
          color="#C32A29"
          type="font-awesome-5"
          iconStyle={{marginRight: 12}}
          onPress={() => setIsSuggestionBoxOpen(true)}
        />

        <Text style={{fontSize: 16, marginRight: 12}}>
          {props.item.place_name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export const AddFacilityScreen = ({navigation}) => {
  const {getUser} = useContext(AuthContext);
  const {api_token} = getUser();

  const [facilityName, setFacilityName] = useState('');
  const [facilityType, setFacilityType] = useState(FACILITY_TYPE[0].name);
  const [isSuggestionBoxOpen, setIsSuggestionBoxOpen] = useState(false);
  const [address, setAddress] = useState('');
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastname] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  const addItem = async () => {
    const requestBody = new URLSearchParams({
      first_name: firstName,
      last_name: lastName,
      contact_number: contactNumber,
      email: email,
      password: password,
      user_status: '1',
      facility_name: facilityName,
      address: selectedAddress.place_name,
      region: selectedAddress.context[2].text,
      province: selectedAddress.context[1].text,
      longitude: selectedAddress.geometry.coordinates[0].toString(),
      latitude: selectedAddress.geometry.coordinates[1].toString(),
      api_token: api_token,
    });

    console.log(requestBody);

    const endpoint = `${POPCOM_URL}/api/create-facility?${requestBody.toString()}`;
    const response = await fetch(endpoint, {
      headers: {
        accept: 'application/json',
      },
      method: 'post',
    });

    if (!response.ok) {
      alert('failed');
      console.log(response);
      return;
    }

    const json = await response.json();
    console.log(json);
  };

  const selectAddress = addressObject => {
    setSelectedAddress(addressObject);
    setIsSuggestionBoxOpen(false);
  };

  const getPlace = async () => {
    const endpoint = `${MAPBOX_SEARCH_URL}/${address}.json?country=PH&limit=10&types=locality&access_token=${MAPBOX_API_KEY}`;
    const response = await fetch(endpoint);
    const json = await response.json();
    setSuggestions(json.features);
  };

  useEffect(() => {
    if (address.length != 0) {
      getPlace();
    }
  }, [address]);

  return (
    <View style={styles.container}>
      <Overlay
        overlayStyle={{
          flex: 1,
          margin: 32,
          alignSelf: 'stretch',
          borderRadius: 8,
        }}
        isVisible={isSuggestionBoxOpen}
        onBackdropPress={() => setIsSuggestionBoxOpen(false)}>
        <TextInput
          value={address}
          onChangeText={newValue => debounce(setAddress(newValue), 1000)}
          placeholder={'Search a place'}
          style={{
            borderBottomWidth: 1,
            borderBottomColor: 'gray',
            marginBottom: 12,
          }}
        />
        <ScrollView>
          {suggestions.map((item, index) => {
            return (
              <SuggestionItem
                key={index}
                item={item}
                itemOnpress={selectAddress}
              />
            );
          })}
        </ScrollView>
      </Overlay>

      <CustomHeader
        navigation={navigation}
        title={'Add Facility'}
        type={1}
        fromScreen="Facilities"
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Card
          containerStyle={{
            borderRadius: 8,
            marginHorizontal: 20,
            elevation: 3,
          }}>
          <View style={{flexDirection: 'row', marginBottom: 12}}>
            <Icon
              name="store"
              type="font-awesome-5"
              color={'#333333'}
              size={16}
            />
            <Text style={{color: '#333333', marginLeft: 12, fontSize: 12}}>
              Facility Information
            </Text>
          </View>
          <TextInput
            placeholder="Facility Name"
            value={facilityName}
            onChangeText={newValue => setFacilityName(newValue)}
            style={{
              borderWidth: 1,
              borderRadius: 4,
              paddingVertical: 4,
              paddingHorizontal: 8,
              marginBottom: 8,
              borderColor: '#B7B7B7',
            }}
          />
          <Text
            style={{
              color: 'gray',
              fontSize: 10,
              marginBottom: 4,
              marginLeft: 4,
            }}>
            Facility Type
          </Text>
          <View
            style={{
              borderWidth: 1,
              borderRadius: 4,
              marginBottom: 8,
              borderColor: '#B7B7B7',
            }}>
            <Picker
              selectedValue={facilityType}
              onValueChange={(value, index) => setFacilityType(value)}
              mode={'dropdown'}>
              {FACILITY_TYPE.map((item, index) => (
                <Picker.Item key={index} value={item.name} label={item.name} />
              ))}
            </Picker>
          </View>
          <View
            style={{
              flexDirection: 'row',
              borderWidth: 1,
              borderRadius: 4,
              marginBottom: 8,
              borderColor: '#B7B7B7',
              alignItems: 'center',
            }}>
            <TextInput
              style={{flexGrow: 1, color: 'black'}}
              placeholder="Facility Location"
              value={selectedAddress && selectedAddress.place_name}
              editable={false}
            />
            <View style={{marginRight: 12}}>
              <Icon
                name="map-marked"
                size={16}
                color="black"
                type="font-awesome-5"
                onPress={() => setIsSuggestionBoxOpen(true)}
              />
            </View>
          </View>
        </Card>

        <Card
          containerStyle={{
            borderRadius: 8,
            marginHorizontal: 20,
            elevation: 3,
          }}>
          <View style={{flexDirection: 'row', marginBottom: 12}}>
            <Icon
              name="user-alt"
              type="font-awesome-5"
              color={'#333333'}
              size={16}
            />
            <Text style={{color: '#333333', marginLeft: 12, fontSize: 12}}>
              Facility User
            </Text>
          </View>
          <TextInput
            placeholder="First Name"
            value={firstName}
            onChangeText={newValue => setFirstName(newValue)}
            style={{
              borderWidth: 1,
              borderRadius: 8,
              paddingVertical: 4,
              paddingHorizontal: 8,
              marginBottom: 8,
              borderColor: '#B7B7B7',
            }}
          />
          <TextInput
            placeholder="Last Name"
            value={lastName}
            onChangeText={newValue => setLastname(newValue)}
            style={{
              borderWidth: 1,
              borderRadius: 8,
              paddingVertical: 4,
              paddingHorizontal: 8,
              marginBottom: 8,
              borderColor: '#B7B7B7',
            }}
          />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={newValue => setEmail(newValue)}
            style={{
              borderWidth: 1,
              borderRadius: 8,
              paddingVertical: 4,
              paddingHorizontal: 8,
              marginBottom: 8,
              borderColor: '#B7B7B7',
            }}
          />
          <TextInput
            placeholder="Password"
            secureTextEntry={true}
            value={password}
            onChangeText={newValue => setPassword(newValue)}
            style={{
              borderWidth: 1,
              borderRadius: 8,
              paddingVertical: 4,
              paddingHorizontal: 8,
              marginBottom: 8,
              borderColor: '#B7B7B7',
            }}
          />
          <TextInput
            placeholder="Role / Rank"
            value={role}
            onChangeText={newValue => setRole(newValue)}
            style={{
              borderWidth: 1,
              borderRadius: 8,
              paddingVertical: 4,
              paddingHorizontal: 8,
              marginBottom: 8,
              borderColor: '#B7B7B7',
            }}
          />
          <TextInput
            placeholder="Contact Number"
            keyboardType={'numeric'}
            value={contactNumber}
            onChangeText={newValue => setContactNumber(newValue)}
            style={{
              borderWidth: 1,
              borderRadius: 8,
              paddingVertical: 4,
              paddingHorizontal: 8,
              marginBottom: 8,
              borderColor: '#B7B7B7',
            }}
          />
        </Card>

        <Button
          title={'Add Facility'}
          buttonStyle={{
            backgroundColor: '#043D10',
            borderRadius: 6,
            margin: 20,
          }}
          icon={
            <Icon
              name="plus"
              size={10}
              color="white"
              type="font-awesome-5"
              style={{marginRight: 8}}
            />
          }
          onPress={() => addItem()}
        />
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

const mapStyle = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 400,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
