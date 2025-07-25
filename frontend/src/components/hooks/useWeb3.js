import { useState, useEffect, useCallback } from 'react';
import { BrowserProvider } from 'ethers';

export default function useWeb3() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  // Remove error state entirely

  const isMetaMaskInstalled = typeof window !== 'undefined' && window.ethereum && window.ethereum.isMetaMask;

  const connect = useCallback(async () => {
    setIsConnecting(true);
    try {
      if (!isMetaMaskInstalled) {
        setIsConnecting(false);
        return;
      }
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      setProvider(new BrowserProvider(window.ethereum));
    } catch (err) {
      // Silently ignore all errors
    } finally {
      setIsConnecting(false);
    }
  }, [isMetaMaskInstalled]);

  // Listen for account or network changes
  useEffect(() => {
    if (!window.ethereum) return;
    const handleAccountsChanged = (accounts) => setAccount(accounts[0] || null);
    const handleChainChanged = () => window.location.reload();
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);
    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, []);

  // On load, check for already connected accounts
  useEffect(() => {
    async function checkAccounts() {
      if (isMetaMaskInstalled) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0) {
            setAccount(accounts[0]);
            setProvider(new BrowserProvider(window.ethereum));
          }
        } catch (err) {
          // ignore
        }
      }
    }
    checkAccounts();
  }, [isMetaMaskInstalled]);

  return { account, provider, isConnecting, connect, isMetaMaskInstalled };
} 