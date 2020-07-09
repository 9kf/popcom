import * as R from 'ramda';
import {CATEGORIES, FACILITY_TYPE, POPCOM_URL} from './constants';

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
