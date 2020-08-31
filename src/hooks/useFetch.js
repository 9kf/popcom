import {useState} from 'react';

const pipeAsync = (...funcs) => async arg => {
  const result = await funcs.reduce(async (value, func) => {
    const newValue = await value;
    return func(newValue);
  }, Promise.resolve(arg));
  return result;
};

export const useFetch = (...mutationFunctions) => {
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
        setError(json.errors[0] ?? 'Something went wrong');
        return;
      }

      if (mutationFunctions.length > 0) {
        const newData = await pipeAsync(...mutationFunctions, setData)(
          json.data,
        );
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
