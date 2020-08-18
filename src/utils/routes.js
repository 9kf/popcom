import {api, keys} from '../env';
import RNFetchBlob from 'rn-fetch-blob';

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

  const url = `${
    api.GENERATE_REPORT.url
  }?api_token=${apiToken}&facility_id=${facilityId}`;
  RNFetchBlob.config({
    fileCache: true,
    path: `${dirs.DownloadDir}/${fileName}`,
  })
    .fetch('POST', url)
    .then(res => {
      alert(`The report has been saved to ${res.path()}`);
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
