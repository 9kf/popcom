import React, {useState} from 'react';

const lotNumbersData = [
  {
    itemId: 1,
    number: '2020-3021',
    expiry: '2020-02-23T02:43:29.000000Z',
    quantity: 365,
  },
  {
    itemId: 1,
    number: '1992-4021',
    expiry: '2020-05-07T02:43:29.000000Z',
    quantity: 100,
  },
  {
    itemId: 1,
    number: '2032-5721',
    expiry: '2020-09-18T02:43:29.000000Z',
    quantity: 250,
  },
  {
    itemId: 2,
    number: '4029-3021',
    expiry: '2020-01-23T02:43:29.000000Z',
    quantity: 1003,
  },
  {
    itemId: 2,
    number: '1023-3021',
    expiry: '2020-04-07T02:43:29.000000Z',
    quantity: 2531,
  },
  {
    itemId: 2,
    number: '5023-3021',
    expiry: '2020-03-22T02:43:29.000000Z',
    quantity: 3000,
  },
  {
    itemId: 3,
    number: '0293-3021',
    expiry: '2020-09-10T02:43:29.000000Z',
    quantity: 1400,
  },
  {
    itemId: 3,
    number: '1234-3021',
    expiry: '2020-10-03T02:43:29.000000Z',
    quantity: 500,
  },
  {
    itemId: 3,
    number: '5323-3021',
    expiry: '2020-05-22T02:43:29.000000Z',
    quantity: 2502,
  },
  {
    itemId: 4,
    number: '2314-3021',
    expiry: '2020-04-21T02:43:29.000000Z',
    quantity: 4000,
  },
  {
    itemId: 4,
    number: '7585-3021',
    expiry: '2021-06-13T02:43:29.000000Z',
    quantity: 200,
  },
  {
    itemId: 4,
    number: '0083-3021',
    expiry: '2021-02-09T02:43:29.000000Z',
    quantity: 104,
  },
];

export const MockApiContext = React.createContext();

export const useMockApi = () => {
  const [lotNumbers, setLotNumbers] = useState(lotNumbersData);

  const mockValues = {
    lotNumbers: lotNumbers,

    setLotNumbers: newLotNumbers => setLotNumbers(newLotNumbers),
  };

  return {mockValues};
};
