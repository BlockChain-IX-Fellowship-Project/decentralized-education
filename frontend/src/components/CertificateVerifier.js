// src/components/CertificateVerifier.js
import React, { useState } from 'react';
import { verifyCertificate } from '../utils/verifyCertificate';
import { CheckCircle, XCircle } from 'lucide-react';
import { useLocation } from "react-router-dom";

export default function CertificateVerifier() {
  const location = useLocation();
  const { courseId: stateCourseId, walletAddress: stateWalletAddress } = location.state || {};

  const [walletAddress, setWalletAddress] = useState(stateWalletAddress || '');
  const [courseId, setCourseId] = useState(stateCourseId || '');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await verifyCertificate(walletAddress, courseId);
      setResult(res);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-indigo-100 p-4">
      <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl p-8 border border-blue-200">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-800 tracking-tight">Verify Blockchain Certificate</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-semibold mb-2 text-gray-700">Wallet Address</label>
            <input
              className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={walletAddress}
              onChange={e => setWalletAddress(e.target.value)}
              placeholder="0x..."
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-2 text-gray-700">Course ID</label>
            <input
              className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={courseId}
              onChange={e => setCourseId(e.target.value)}
              placeholder="Course ID"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-bold text-lg shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify Certificate'}
          </button>
        </form>
        {error && <div className="mt-6 text-red-600 text-center text-lg flex items-center justify-center gap-2"><XCircle className="w-6 h-6" />{error}</div>}
        {result && (
          <div className="mt-8 text-center">
            {result.valid ? (
              <>
                <div className="flex flex-col items-center justify-center mb-2">
                  <CheckCircle className="w-10 h-10 text-green-500 mb-2" />
                  <div className="text-green-700 font-bold text-2xl mb-1">Certificate is valid!</div>
                </div>
                <div className="text-gray-700 text-base break-all mb-2">IPFS Hash:<br /><span className="font-mono text-blue-700">{result.ipfsHash}</span></div>
                <a
                  href={`https://gateway.pinata.cloud/ipfs/${result.ipfsHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-blue-700 underline font-semibold hover:text-indigo-700"
                >
                  View Certificate on IPFS
                </a>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <XCircle className="w-10 h-10 text-red-500 mb-2" />
                <div className="text-red-700 font-bold text-2xl">Certificate not found on blockchain.</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
