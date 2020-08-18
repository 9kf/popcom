import {CATEGORIES, FACILITY_TYPE, POPCOM_URL} from './constants';
import {PermissionsAndroid} from 'react-native';

export const getTagColor = categoryName => {
  const category = CATEGORIES.filter(
    item => item.name.toLocaleLowerCase() === categoryName.toLocaleLowerCase(),
  )[0];
  if (!category) return null;

  return category.tagColor;
};

export const getTagLabelColor = categoryName => {
  const category = CATEGORIES.filter(
    item => item.name.toLocaleLowerCase() === categoryName.toLocaleLowerCase(),
  )[0];
  if (!category) return null;

  return category.tagLabelColor;
};

export const getFacilityTypeTagColor = type => {
  return FACILITY_TYPE.filter(item => item.name === type)[0]?.tagColor;
};

export const getFacilityTypeTagLabelColor = type => {
  return FACILITY_TYPE.filter(item => item.name === type)[0]?.tagLabelColor;
};

export const debounce = (func, wait, immediate) => {
  var timeout;
  return function() {
    var context = this,
      args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

export const getUserById = async (userID, apiToken) => {
  const urlParams = new URLSearchParams({
    user_id: userID,
    api_token: apiToken,
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

export const getUsers = async apiToken => {
  const endpoint = `${POPCOM_URL}/api/get-users?api_token=${apiToken}`;
  const options = {
    headers: {
      accept: 'application/json',
    },
    method: 'post',
  };
  const request = await fetch(endpoint, options);

  if (!request.ok) {
    alert('failed to get users');
    return;
  }

  return await request.json();
};

export const getTotalItemCount = lotNumbers => {
  return lotNumbers.reduce((total, item) => {
    return total + item.quantity;
  }, 0);
};

export const handleInputChange = setter => newText => {
  setter(newText);
};

export const pipe = (...funcs) => arg => {
  funcs.reduce((value, func) => func(value), arg);
};

export const getTotalItemNumberOnBatch = (batches, itemId) => {
  if (batches)
    return batches
      .filter(batch => batch.item_id === itemId)
      .reduce((total, item) => total + item.quantity, 0);

  return 0;
};

export const getLocalDateFromExpiration = expirationDate => {
  return new Date(expirationDate.split(' ')[0]).toLocaleDateString();
};

export const pastTense = word => {
  switch (word) {
    case 'starting':
      return 'started';
    case 'adjustment':
      return 'adjusted';
    case 'dispense':
      return 'dispensed';
    case 'trasfer':
      return 'transferred';
    case 'receive':
      return 'received';
  }
};

export const getItemNameFromId = (itemId, items) => {
  return items.filter(item => item.id === itemId)[0]?.item_name;
};

export const getFacilityNameFromId = (facilityId, facilities) => {
  return facilities.filter(faci => faci.id === facilityId)[0]?.facility_name;
};

export const getNumberOfActiveItems = items => {
  return items?.filter(item => item?.status === '1').length;
};

export const blobToFile = (theBlob, fileName) => {
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  return theBlob;
};

export const blobToBase64 = blob => {
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  return new Promise(resolve => {
    reader.onloadend = () => {
      resolve(reader.result);
    };
  });
};

export const requestWriteExternalStoragePermission = async () => {
  try {
    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );

    if (!hasPermission) {
      const permission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Requesting external storage permission',
          message:
            'POPCOM needs to access your external storage ' +
            'to save the reports on your phone',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (permission === PermissionsAndroid.RESULTS.GRANTED) return true;

      return false;
    }

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const requestCameraPermission = async () => {
  try {
    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );

    if (!hasPermission) {
      const permission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Requesting camera permission',
          message: 'POPCOM needs to access your camera ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (permission === PermissionsAndroid.RESULTS.GRANTED) return true;

      return false;
    }

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};
