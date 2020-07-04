import React, {useState, useEffect} from 'react';
import * as R from 'ramda';

export const useForm = (
  initialState = {},
  formSubmitCallback,
  validationFunc,
) => {
  const [formValues, setFormValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  const onFieldValueChange = R.curry((key, value) => {
    const newFormValues = R.assoc(key, value, formValues);
    setFormValues(newFormValues);
  });

  const onFormSubmit = event => {
    setIsFirstVisit(false);

    if (R.keys(validationFunc(formValues)).length != 0) {
      setErrors(validationFunc(formValues));
      return;
    }

    formSubmitCallback(formValues);
  };

  const resetForm = () => {
    setFormValues(initialState);
    setErrors({});
    setIsFirstVisit(true);
  };

  useEffect(() => {
    if (!isFirstVisit) setErrors(validationFunc(formValues));
  }, [formValues]);

  return {onFieldValueChange, onFormSubmit, resetForm, errors, formValues};
};
