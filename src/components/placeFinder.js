import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  TextInput,
  StyleSheet,
  Platform,
} from 'react-native';

import {Icon, Overlay, SearchBar, Card} from 'react-native-elements';

import {ErrorHandlingField} from './errorHandlingField';

import {APP_THEME, MAPBOX_SEARCH_URL, MAPBOX_API_KEY} from '../utils/constants';

import {useFetch} from '../hooks/';

import {debounce} from '../utils/helper';

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

export const PlaceFinder = ({
  title,
  errorMessage,
  errorBorderColor,
  value,
  setValue,
}) => {
  const [isSearchPlacesOpen, setIsSearchPlacesOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const {data, isLoading, fetchData} = useFetch();

  const getPlace = async () => {
    const endpoint = `${MAPBOX_SEARCH_URL}/${searchText}.json?country=PH&limit=10&types=locality&access_token=${MAPBOX_API_KEY}`;
    fetchData(endpoint, {}, () =>
      alert('There was a problem retrieving the results'),
    );
  };

  const handleItemPress = item => {
    setValue(item);
    setSearchText('');
    setIsSearchPlacesOpen(false);
  };

  useEffect(() => {
    if (searchText.trim() != '') getPlace();
    else setSuggestions([]);
  }, [searchText]);

  useEffect(() => {
    if (data) setSuggestions(data.features);
  }, [data]);

  return (
    <View>
      <Overlay
        overlayStyle={APP_THEME.defaultOverlayStyle}
        isVisible={isSearchPlacesOpen}
        onBackdropPress={() => setIsSearchPlacesOpen(false)}>
        <Card
          containerStyle={{
            margin: 0,
            marginBottom: 12,
            padding: 0,
            borderRadius: 8,
            elevation: 4,
          }}>
          <SearchBar
            placeholder={'Search address'}
            value={searchText}
            onClear={() => setSearchText('')}
            onChangeText={newValue => debounce(setSearchText(newValue), 1000)}
            platform={Platform.OS}
            containerStyle={{
              borderRadius: 8,
            }}
            showLoading={isLoading}
            inputStyle={{fontSize: 16, padding: 0}}
          />
        </Card>
        <ScrollView>
          {suggestions.map((item, index) => {
            return (
              <SuggestionItem
                key={index}
                item={item}
                itemOnpress={handleItemPress}
              />
            );
          })}
        </ScrollView>
      </Overlay>

      <TouchableOpacity onPress={() => setIsSearchPlacesOpen(true)}>
        <ErrorHandlingField
          title={title}
          errorMessage={errorMessage}
          style={
            errorMessage
              ? {...styles.container, borderColor: errorBorderColor}
              : styles.container
          }>
          <TextInput
            style={{
              flexGrow: 1,
              color: 'black',
              paddingVertical: 4,
              paddingLeft: 12,
            }}
            editable={false}
            value={value?.place_name}
          />
          <Icon
            name="map-marked"
            size={16}
            color="#C32A29"
            type="font-awesome-5"
            style={{marginRight: 12}}
          />
        </ErrorHandlingField>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 8,
    borderColor: '#B7B7B7',
    alignItems: 'center',
  },
});
