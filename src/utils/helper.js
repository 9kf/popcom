import * as R from 'ramda';
import {CATEGORIES, FACILITY_TYPE} from './constants';

export const getTagColor = categoryName => {
  const category = CATEGORIES.filter(item => item.name === categoryName)[0];
  if (!category) return null;

  return category.tagColor;
};

export const getTagLabelColor = categoryName => {
  const category = CATEGORIES.filter(item => item.name === categoryName)[0];
  if (!category) return null;

  return category.tagLabelColor;
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
