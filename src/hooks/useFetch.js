import React, {useState} from 'react';

export const useFetch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setError] = useState(null);
  const [data, setData] = useState(null);

  const setDefaults = () => {
    setError(null);
    setData(null);
  };

  const fetchData = async (url, options, errorCallback) => {
    setIsLoading(true);
    setDefaults();
    try {
      const res = await fetch(url, options);
      console.log(res);
      if (!res.ok) {
        errorCallback();
        setError({message: 'Incorrect username or password'});
        setIsLoading(false);
        return;
      }

      const json = await res.json();
      setData(json);
      setIsLoading(false);
    } catch (e) {
      setError(e);
      setIsLoading(false);
    }
  };

  return {isLoading, errorMessage, data, fetchData};
};
