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
