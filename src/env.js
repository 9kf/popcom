const POPCOM_URL = 'https://www.popcom.app';

const defaultPostOptions = {
  headers: {
    accept: 'application/json',
    'Content-Type': 'application/json',
  },
  method: 'post',
};

const defaultGetOptions = {
  headers: {
    accept: 'application/json',
  },
  method: 'get',
};

export const api = {
  LOGIN: {
    url: `${POPCOM_URL}/api/login`,
    options: defaultPostOptions,
  },
  ITEMS: {
    url: `${POPCOM_URL}/api/get-items`,
    options: defaultPostOptions,
  },
  CREATE_ITEM: {
    url: `${POPCOM_URL}/api/create-item`,
    options: defaultPostOptions,
  },
  FACILITIES: {
    url: `${POPCOM_URL}/api/get-facilities`,
    options: defaultGetOptions,
  },
  GET_FACILITY: {
    url: `${POPCOM_URL}/api/get-facility`,
    options: defaultPostOptions,
  },
  BATCHES: {
    url: `${POPCOM_URL}/api/get-facility-batches`,
    options: defaultPostOptions,
  },
  FACILITY_LEDGER: {
    url: `${POPCOM_URL}/api/get-facility-ledger`,
    options: defaultPostOptions,
  },
  GENERATE_REPORT: {
    url: `${POPCOM_URL}/api/generate-report`,
    options: defaultPostOptions,
  },
  TOTAL_DISPENSE_COUNT: {
    url: `${POPCOM_URL}/api/get-total-dispense-count`,
    options: defaultPostOptions,
  },
  TOTAL_INVENTORY_COUNT: {
    url: `${POPCOM_URL}/api/get-total-inventory-count`,
    options: defaultPostOptions,
  },
  GET_INVENTORY_REQUESTS: {
    url: `${POPCOM_URL}/api/view-requests`,
    options: defaultPostOptions,
  },
  CANCEL_INVENTORY_REQUEST: {
    url: `${POPCOM_URL}/api/cancel-request`,
    options: defaultPostOptions,
  },
};

export const keys = {
  MAPBOX_SEARCH_URL: 'https://api.mapbox.com/geocoding/v5/mapbox.places',
  MAPBOX_API_KEY:
    'pk.eyJ1Ijoia2Z3ZWVlIiwiYSI6ImNqeWpzcjR3YzA2NWMzYmxoNWEwd2F2a3IifQ.2-zcf41wbjsb5FelfoBxSg',
};
