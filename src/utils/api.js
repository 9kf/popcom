import {POPCOM_URL} from './constants';

/**
 *
 * @param {string} userName
 * @param {string} passWord
 */
export const login = async (userName, passWord) => {};

export const getItems = async apiToken => {
  const endPoint = `${POPCOM_URL}/api/get-items`;
  const body = {
    api_token: apiToken,
  };
  const options = {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };

  const request = await fetch(endPoint, options);

  if (!request.ok) {
    alert('There was a problem fetching the items');
    return;
  }

  const response = await request.json();
  return response.data;
};

export const getFacilities = async apiToken => {
  const endpoint = `${POPCOM_URL}/api/get-facilities?api_token=${apiToken}`;
  const options = {
    method: 'get',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  const request = await fetch(endpoint, options);
  if (!request.ok) {
    alert('failed to get facilities');
    return;
  }

  const response = await request.json();
  return response.data;
};

export const getFacilityBatches = async (apiToken, facilityId) => {
  const endpoint = `${POPCOM_URL}/api/get-facility-batches`;
  const body = {
    api_token: apiToken,
    facility_id: facilityId,
  };
  const options = {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };

  const request = await fetch(endpoint, options);

  if (!request.ok) {
    alert('There was a problem fetching the facility batches');
    return;
  }

  const response = await request.json();
  return response.data;
};

export const adjustInventory = async (apiToken, batchId, newQuantity) => {
  const endpoint = `${POPCOM_URL}/api/adjust-inventory`;
  const body = {
    api_token: apiToken,
    batch_id: batchId,
    quantity: newQuantity,
  };
  const options = {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };

  const request = await fetch(endpoint, options);
  const response = await request.json();

  if (!request.ok || !response.success) {
    alert('There was a problem adjusting the inventory');
    return;
  }

  return response.data;
};

export const getRequestInventory = async (apiToken, facilityId) => {
  const endpoint = `${POPCOM_URL}/api/view-requests`;
  const body = {
    api_token: apiToken,
    facility_id: facilityId,
  };
  const options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };

  const request = await fetch(endpoint, options);

  if (!request.ok) {
    alert('There was a problem fetching the facility inventory requests');
    return;
  }

  const response = await request.json();
  return response.data;
};

export const createRequestInventory = async (
  apiToken,
  requestingFacilityId,
  supplyingFacilityId,
  items,
  notes,
  expectedDeliveryDate,
) => {
  const endpoint = `${POPCOM_URL}/api/request-inventory`;
  const body = {
    api_token: apiToken,
    receiving_facility_id: requestingFacilityId,
    supplying_facility_id: supplyingFacilityId,
    items: items,
    message: notes,
    expected_delivery_date: (expectedDeliveryDate / 1000).toFixed(0),
  };

  const options = {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };

  const request = await fetch(endpoint, options);

  const response = await request.json();

  if (!request.ok || !response.success) {
    alert('There was a problem requesting for inventory');
    return;
  }

  return response.success;
};

export const editRequestInventory = async (
  apiToken,
  requestInventoryId,
  requestingFacilityId,
  supplyingFacilityId,
  items,
  notes,
  expectedDeliveryDate,
) => {
  const endpoint = `${POPCOM_URL}/api/edit-request`;
  const body = {
    api_token: apiToken,
    request_inventory_id: requestInventoryId,
    receiving_facility_id: requestingFacilityId,
    supplying_facility_id: supplyingFacilityId,
    items: items,
    message: notes,
    expected_delivery_date: (expectedDeliveryDate / 1000).toFixed(0),
  };

  const options = {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };

  const request = await fetch(endpoint, options);

  if (!request.ok) {
    alert('There was a problem requesting for inventory');
    return;
  }

  const response = await request.json();
  return response.success;
};

export const cancelRequestInventory = async (apiToken, requestInventoryId) => {
  const endpoint = `${POPCOM_URL}/api/cancel-request`;
  const body = {
    api_token: apiToken,
    request_inventory_id: requestInventoryId,
  };

  const options = {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };

  const request = await fetch(endpoint, options);

  if (!request.ok) {
    alert('There was a problem cancelling inventory');
    return;
  }

  const response = await request.json();
  return response.success;
};

export const transferInventory = async (
  apiToken,
  requestInventoryId,
  items,
  message,
) => {
  const endpoint = `${POPCOM_URL}/api/transfer-inventory`;
  const body = {
    api_token: apiToken,
    request_inventory_id: requestInventoryId,
    items: items,
    message: message,
  };

  const options = {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };

  const request = await fetch(endpoint, options);

  if (!request.ok) {
    alert('There was a problem transferring inventory');
    return;
  }

  const response = await request.json();
  return response.success;
};

export const declineRequest = async (apiToken, requestInventoryId) => {
  const endpoint = `${POPCOM_URL}/api/decline-request`;
  const body = {
    api_token: apiToken,
    request_inventory_id: requestInventoryId,
  };

  const options = {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };

  const request = await fetch(endpoint, options);

  if (!request.ok) {
    alert('There was a problem cancelling the request');
    return;
  }

  const response = await request.json();
  response.success;
};

export const getTransferInventories = async (apiToken, facilityId) => {
  const endpoint = `${POPCOM_URL}/api/get-transfers`;
  const body = {
    api_token: apiToken,
    facility_id: facilityId,
  };

  const options = {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };

  const request = await fetch(endpoint, options);

  if (!request.ok) {
    alert('There was a problem getting transferred inventory');
    return;
  }

  const response = await request.json();
  return response.data;
};

export const updateTransferStatus = async (apiToken, inventoryTransferId) => {
  const endpoint = `${POPCOM_URL}/api/update-transfer-status`;
  const body = {
    api_token: apiToken,
    inventory_transfer_id: inventoryTransferId,
  };

  const options = {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };

  const request = await fetch(endpoint, options);

  const response = await request.json();

  if (!request.ok || !response.success) {
    alert('There was a problem updating the transfer status');
    return;
  }

  return response.success;
};

export const receiveInventory = async (apiToken, inventoryTransferId) => {
  const endpoint = `${POPCOM_URL}/api/receive-inventory`;
  const body = {
    api_token: apiToken,
    inventory_transfer_id: inventoryTransferId,
  };

  const options = {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };

  const request = await fetch(endpoint, options);

  if (!request.ok) {
    alert('There was a problem updating the transfer status');
    return;
  }

  const response = await request.json();
  console.log(response);
  return response.success;
};
