import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [wallet, setWallet] = useState(null);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWallet(accounts[0]);
        setError('');
        if (onLogin) onLogin(accounts[0]);
      } catch (err) {
        setError('User denied wallet connection');
      }
    } else {
      setError('MetaMask is not installed.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
      <div className="bg-white p-8 rounded-lg shadow-lg w-80 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6 text-purple-700">Login with MetaMask</h2>
        <button
          onClick={handleLogin}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded transition duration-200 mb-4 w-full"
        >
          Connect Wallet
        </button>
        {wallet && (
          <div className="text-green-600 text-sm mt-2 break-all">Connected: {wallet}</div>
        )}
        {error && (
          <div className="text-red-500 text-sm mt-2">{error}</div>
        )}
      </div>
    </div>
  );
};

export default Login;
