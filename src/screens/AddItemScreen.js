import React, {useState, useContext} from 'react';

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

import {Button, Icon, Card} from 'react-native-elements';

import ImagePicker from 'react-native-image-picker';

import {AuthContext} from '../context';

import {CATEGORIES, POPCOM_URL} from '../utils/constants';

const Gallery = ({image, setImage}) => {
  const launchGallery = () => {
    ImagePicker.launchImageLibrary({}, response => {
      setImage(response);
      console.log(response);
    });
  };

  return (
    <TouchableOpacity onPress={launchGallery}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          borderWidth: 2,
          borderColor: '#C0C1C2',
          borderRadius: 8,
          marginHorizontal: 20,
          padding: 12,
        }}>
        {image ? (
          <Image source={image} style={{height: 70, resizeMode: 'contain'}} />
        ) : (
          <>
            <View
              style={{
                backgroundColor: '#D9D9D9',
                borderRadius: 40,
                padding: 12,
                marginRight: 16,
              }}>
              <Icon
                name="camera"
                type="font-awesome-5"
                color={'#fff'}
                size={20}
              />
            </View>
            <Text style={{color: '#B4B4B4'}}>Upload Item / Take a Photo</Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

export const AddItemScreen = ({navigation}) => {
  const {getUser} = useContext(AuthContext);
  const {api_token} = getUser();

  const [image, setImage] = useState(null);
  const [itemName, setItemName] = useState('');
  const [barcode, setBarcode] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');

  const resetForm = () => {
    setImage(null);
    setItemName('');
    setBarcode('');
    setCategory(CATEGORIES[0]);
    setDescription('');
  };

  const addItem = async () => {
    const params = new URLSearchParams({
      item_sku: barcode,
      item_name: itemName,
      item_description: description,
      category: category,
      //   image: image.data,
      status: 1,
      api_token: api_token,
    });
    const endpoint = POPCOM_URL + `/api/create-item?${params.toString()}`;
    const response = await fetch(endpoint, {
      headers: {
        accept: 'application/json',
      },
      method: 'post',
    });

    if (!response.ok) {
      alert('Failed to add the item');
      return;
    }

    const json = await response.json();
    navigation.navigate('ItemMaster');
    resetForm();
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        navigation={navigation}
        title={'Create Item'}
        type={1}
        fromScreen={'ItemMaster'}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Gallery setImage={setImage} image={image} />
        <Card
          containerStyle={{
            borderRadius: 8,
            marginHorizontal: 20,
            elevation: 3,
          }}>
          <View style={{flexDirection: 'row', marginBottom: 12}}>
            <Icon
              name="box"
              type="font-awesome-5"
              color={'#333333'}
              size={16}
            />
            <Text style={{color: '#333333', marginLeft: 12, fontSize: 12}}>
              Item Information
            </Text>
          </View>
          <TextInput
            placeholder="Item Name"
            value={itemName}
            onChangeText={newValue => setItemName(newValue)}
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
            placeholder="Barcode / SKU"
            value={barcode}
            onChangeText={newValue => setBarcode(newValue)}
            style={{
              borderWidth: 1,
              borderRadius: 8,
              paddingVertical: 4,
              paddingHorizontal: 8,
              marginBottom: 8,
              borderColor: '#B7B7B7',
            }}
          />
          <View
            style={{
              borderWidth: 1,
              borderRadius: 8,
              marginBottom: 8,
              borderColor: '#B7B7B7',
            }}>
            <Picker
              style={{height: 37}}
              selectedValue={category}
              onValueChange={(value, index) => setCategory(value)}
              mode={'dropdown'}>
              {CATEGORIES.map((item, index) => (
                <Picker.Item key={index} value={item.name} label={item.name} />
              ))}
            </Picker>
          </View>
          <TextInput
            multiline={true}
            numberOfLines={5}
            placeholder="Description"
            value={description}
            onChangeText={newValue => setDescription(newValue)}
            style={{
              borderWidth: 1,
              borderRadius: 8,
              paddingVertical: 4,
              paddingHorizontal: 8,
              marginBottom: 8,
              borderColor: '#B7B7B7',
              textAlignVertical: 'top',
            }}
          />
        </Card>

        {/* <Card
          containerStyle={{
            borderRadius: 8,
            marginHorizontal: 20,
            elevation: 3,
            marginBottom: 12,
          }}>
          <View style={{flexDirection: 'row', marginBottom: 12}}>
            <Icon
              name="cart-plus"
              type="font-awesome-5"
              color={'#333333'}
              size={20}
            />
            <Text style={{color: '#333333', marginLeft: 12}}>
              Beginning Inventory
            </Text>
          </View>

          <Button
            title={'Add Batch Inventory'}
            buttonStyle={{
              backgroundColor: '#043D10',
              borderRadius: 6,
            }}
          />
        </Card> */}

        <Button
          title={'Add New Item'}
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
