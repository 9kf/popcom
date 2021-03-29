import {api, keys} from '../env';
import RNFetchBlob from 'rn-fetch-blob';
import {Platform} from 'react-native';

export const userLogin = async (email, password, doFetch) => {
  const options = {
    ...api.LOGIN.options,
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  };
  doFetch(api.LOGIN.url, options);
};

export const getUserById = async (apiToken, userId, doFetch) => {
  const options = {
    ...api.GET_USER_BY_ID.options,
    body: JSON.stringify({
      api_token: apiToken,
      user_id: userId,
    }),
  };
  doFetch(api.GET_USER_BY_ID.url, options);
};

export const getUsers = async (apiToken, doFetch) => {
  const options = {
    ...api.GET_USERS.options,
    body: JSON.stringify({
      api_token: apiToken,
    }),
  };
  doFetch(api.GET_USERS.url, options);
};

export const editUser = async (fields, doFetch) => {
  const options = {
    ...api.EDIT_USER.options,
    body: JSON.stringify(fields),
  };

  doFetch(api.EDIT_USER.url, options);
};

export const getItems = async (apiToken, doFetch) => {
  const options = {
    ...api.ITEMS.options,
    body: JSON.stringify({
      api_token: apiToken,
    }),
  };
  doFetch(api.ITEMS.url, options);
};

export const createItem = async (fields, doFetch) => {
  const options = {
    ...api.CREATE_ITEM.options,
    body: JSON.stringify(fields),
  };

  doFetch(api.CREATE_ITEM.url, options);
};

export const getItemCategories = async apiToken => {
  const options = {
    ...api.GET_ITEM_CATEGORIES.options,
    body: JSON.stringify({
      api_token: apiToken,
    }),
  };

  const request = await fetch(api.GET_ITEM_CATEGORIES.url, options);
  const jsonResponse = await request.json();

  if (!request.ok || !jsonResponse.success) {
    alert('There was a problem getting item categories');
    return;
  }

  return jsonResponse.data;
};

export const getItemCategoriesWithHook = (apiToken, doFetch) => {
  const options = {
    ...api.GET_ITEM_CATEGORIES.options,
    body: JSON.stringify({
      api_token: apiToken,
    }),
  };

  doFetch(api.GET_ITEM_CATEGORIES.url, options);
};

export const getFacilities = async (apiToken, doFetch) => {
  doFetch(
    `${api.FACILITIES.url}?api_token=${apiToken}`,
    api.FACILITIES.options,
  );
};

export const getFacility = async (apiToken, facilityId, doFetch) => {
  const options = {
    ...api.GET_FACILITY.options,
    body: JSON.stringify({
      api_token: apiToken,
      facility_id: facilityId,
    }),
  };

  doFetch(api.GET_FACILITY.url, options);
};

export const getFacilityTypes = async apiToken => {
  const options = {
    ...api.GET_FACILITY_TYPES.options,
    body: JSON.stringify({
      api_token: apiToken,
    }),
  };

  const request = await fetch(api.GET_FACILITY_TYPES.url, options);
  const jsonResponse = await request.json();

  if (!request.ok || !jsonResponse.success) {
    alert('There was a problem getting facility types');
    return;
  }

  return jsonResponse.data;
};

export const getFacilityTypesWithHook = (apiToken, doFetch) => {
  const options = {
    ...api.GET_FACILITY_TYPES.options,
    body: JSON.stringify({
      api_token: apiToken,
    }),
  };

  doFetch(api.GET_FACILITY_TYPES.url, options);
};

export const createFacility = async (fields, doFetch) => {
  const options = {
    ...api.CREATE_FACILITY.options,
    body: JSON.stringify(fields),
  };

  doFetch(api.CREATE_FACILITY.url, options);
};

export const addFacilityUser = async (fields, doFetch) => {
  const options = {
    ...api.ADD_FACILITY_USER.options,
    body: JSON.stringify(fields),
  };

  doFetch(api.ADD_FACILITY_USER.url, options);
};

export const addUserToFacility = async (
  apiToken,
  userId,
  facilityId,
  doFetch,
) => {
  const options = {
    ...api.ADD_USER_TO_FACILITY.options,
    body: JSON.stringify({
      api_token: apiToken,
      user_id: userId,
      facility_id: facilityId,
    }),
  };

  doFetch(api.ADD_USER_TO_FACILITY.url, options);
};

export const removeUserToFacility = async (
  apiToken,
  userId,
  facilityId,
  doFetch,
) => {
  const options = {
    ...api.REMOVE_USER_TO_FACILITY.options,
    body: JSON.stringify({
      api_token: apiToken,
      user_id: userId,
      facility_id: facilityId,
    }),
  };

  doFetch(api.REMOVE_USER_TO_FACILITY.url, options);
};

export const getBatchesByFacilityId = async (apiToken, facilityId, doFetch) => {
  const options = {
    ...api.BATCHES.options,
    body: JSON.stringify({
      api_token: apiToken,
      facility_id: facilityId,
    }),
  };
  doFetch(api.BATCHES.url, options);
};

export const getFacilityLedger = async (
  apiToken,
  facilityId,
  pageNumber,
  doFetch,
) => {
  const options = {
    ...api.FACILITY_LEDGER.options,
    body: JSON.stringify({
      api_token: apiToken,
      facility_id: facilityId,
      page: pageNumber,
      limit: 99,
    }),
  };
  doFetch(api.FACILITY_LEDGER.url, options);
};

export const generateReport = async (apiToken, facilityId, fileName) => {
  let dirs = RNFetchBlob.fs.dirs;
  console.log(dirs.DownloadDir);
  const url = `${
    api.GENERATE_REPORT.url
  }?api_token=${apiToken}&facility_id=${facilityId}`;
  RNFetchBlob.config({
    // addAndroidDownloads: {
    //   title: `Downloading ${fileName}`,
    //   useDownloadManager: true,
    //   mediaScannable: true,
    //   notification: true,
    //   indicator: true,
    // },
    path: `${dirs.DownloadDir}/${fileName}`,
    fileCache: true,
  })
    .fetch('POST', url, {'Cache-Control': 'no-store'})
    .then(res => {
      if (Platform.OS === 'android')
        RNFetchBlob.android.actionViewIntent(
          res.path(),
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
      alert(
        `File succesfully downloaded on ${
          dirs.DownloadDir
        }/${fileName}. If the file did not open automatically, please download an application that can read the file.`,
      );
    });
};

export const searchPlace = async searchText => {
  const endpoint = `${
    keys.MAPBOX_SEARCH_URL
  }/${searchText}.json?country=PH&limit=10&types=locality&access_token=${
    keys.MAPBOX_API_KEY
  }`;
  try {
    const request = await fetch(endpoint, {});
    return request.json();
  } catch (err) {
    console.log(err);
  }
};

export const getTotalDispenseCount = async (apiToken, doFetch) => {
  const options = {
    ...api.TOTAL_DISPENSE_COUNT.options,
    body: JSON.stringify({
      api_token: apiToken,
    }),
  };
  doFetch(api.TOTAL_DISPENSE_COUNT.url, options);
};

export const getTotalInventoryCount = async (apiToken, doFetch) => {
  const options = {
    ...api.TOTAL_INVENTORY_COUNT.options,
    body: JSON.stringify({
      api_token: apiToken,
    }),
  };
  doFetch(api.TOTAL_INVENTORY_COUNT.url, options);
};

export const getInventoryRequests = async (apiToken, facilityId, doFetch) => {
  const options = {
    ...api.GET_INVENTORY_REQUESTS.options,
    body: JSON.stringify({
      api_token: apiToken,
      facility_id: facilityId,
    }),
  };
  doFetch(api.GET_INVENTORY_REQUESTS.url, options);
};

export const cancelInventoryRequest = async (apiToken, requestId) => {
  const options = {
    ...api.CANCEL_INVENTORY_REQUEST.options,
    body: JSON.stringify({
      api_token: apiToken,
      request_inventory_id: requestId,
    }),
  };
  try {
    const request = await fetch(api.CANCEL_INVENTORY_REQUEST.url, options);
    const response = await request.json();

    if (!request.ok || !response.success) {
      alert('Something went wrong');
      return false;
    }

    return true;
  } catch (err) {
    console.log(err);
  }
};

export const dispenseInventory = async (apiToken, batchId, quantity) => {
  const options = {
    ...api.DISPENSE_INVENTORY.options,
    body: JSON.stringify({
      api_token: apiToken,
      batch_id: batchId,
      quantity: quantity,
    }),
  };
  try {
    const request = await fetch(api.DISPENSE_INVENTORY.url, options);
    const response = await request.json();

    if (!request.ok || !response.success) {
      alert('Something went wrong');
      return false;
    }

    return true;
  } catch (err) {
    console.log(err);
  }
};
