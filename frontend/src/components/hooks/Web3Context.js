import React, { createContext, useContext } from 'react';
import useWeb3 from './useWeb3';

const Web3Context = createContext(null);

export function Web3Provider({ children }) {
  const web3 = useWeb3();
  return (
    <Web3Context.Provider value={web3}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3Context() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3Context must be used within a Web3Provider');
  }
  return context;
} 