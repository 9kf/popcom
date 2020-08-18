import React from 'react';

import {View, Text, TouchableOpacity, Image} from 'react-native';
import {Icon} from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';

import {requestCameraPermission} from '../utils/helper';

export const ImagePickerComponent = ({image, setImage, errorMessage}) => {
  const launchGallery = async () => {
    const permission = await requestCameraPermission();
    if (permission)
      ImagePicker.showImagePicker({}, response => {
        setImage(response);
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
          borderWidth: 1,
          borderColor: errorMessage ? 'red' : '#C0C1C2',
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
