import {useState, useMemo} from 'react';

export const useFetch = callBack => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setError] = useState(null);
  const [data, setData] = useState(null);

  const clear = () => {
    setError(null);
    setData(null);
  };

  const doFetch = async (url, options) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(url, options);
      const json = await res.json();
      console.log(res);
      if (!res.ok || !json.success) {
        console.log(json);
        setError('Something went wrong');
        return;
      }

      if (callBack) {
        setData(await callBack(json.data));
        return;
      }

      setData(json.data);
    } catch (e) {
      console.log(e);
      setError(e);
    } finally {
      setIsLoading(false);
    }
  };

  const overrideData = data => {
    setData(data);
  };

  return {isLoading, errorMessage, data, doFetch, clear, overrideData};
};
