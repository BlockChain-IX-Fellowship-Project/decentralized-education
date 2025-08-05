import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wallet as WalletIcon, Shield, Zap, BookOpen, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import useWeb3 from "../hooks/useWeb3";
import { getUserByWallet, createOrUpdateUser } from '../../utils/userApi';

// Custom Modal for capturing name and email
function UserDetailsModal({ open, onClose, onSubmit, name, setName, email, setEmail }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">Enter Your Details</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Name</label>
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Enter your name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Enter your email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold mt-2"
          >
            Save Details
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Wallet() {
  const { account, isConnecting, connect, isMetaMaskInstalled, error } = useWeb3();
  const navigate = useNavigate();
  const [showUserModal, setShowUserModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [checkingUser, setCheckingUser] = useState(false);

  useEffect(() => {
    async function checkUser() {
      if (account) {
        setCheckingUser(true);
        try {
          const user = await getUserByWallet(account);
          if (!user.name || !user.email) {
            setShowUserModal(true);
          } else {
            setShowUserModal(false);
            navigate("/");
          }
        } catch (err) {
          setShowUserModal(true);
        } finally {
          setCheckingUser(false);
        }
      }
    }
    checkUser();
  }, [account, navigate]);

  const handleConnect = async () => {
    try {
      await connect();
    } catch (e) {
      // Silently ignore all errors
    }
  };

  const handleUserDetailsSubmit = async (e) => {
    e.preventDefault();
    try {
      await createOrUpdateUser({ walletAddress: account, name, email });
      setShowUserModal(false);
      navigate("/");
    } catch (err) {
      // handle error (show message if needed)
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">De-Education Platform</h1>
          <p className="text-slate-600 text-lg">Connect your wallet to start your learning journey</p>
        </div>
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Connection Card */}
          <div className="space-y-6">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <WalletIcon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900">Connect MetaMask</CardTitle>
                <CardDescription className="text-slate-600">
                  Securely connect your MetaMask wallet to access exclusive courses and earn tokens
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!isMetaMaskInstalled ? (
                  <div className="text-red-500 font-semibold text-center">MetaMask is not installed.<br/>Please install MetaMask to continue.</div>
                ) : account ? (
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <CheckCircle className="w-6 h-6" />
                      <span className="font-semibold">Wallet Connected!</span>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={handleConnect}
                    disabled={isConnecting}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    {isConnecting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Connecting...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <WalletIcon className="w-5 h-5" />
                        Connect MetaMask
                      </div>
                    )}
                  </Button>
                )}
                <div className="text-center text-sm text-slate-500">
                  {"Don't have MetaMask? "}
                  <a
                    href="https://metamask.io/download/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Install it here
                  </a>
                </div>
                {error && <div className="mt-2 text-red-500 text-xs text-center">{error}</div>}
              </CardContent>
            </Card>
            {/* Security Notice */}
            <Card className="border border-slate-200 bg-slate-50/50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-slate-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-slate-600">
                    <p className="font-medium mb-1">Your security is our priority</p>
                    <p>We never store your private keys. Your wallet remains under your complete control.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Right Side - Features */}
          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Why Connect Your Wallet?</h2>
            </div>
            <div className="grid gap-4">
              <Card className="border border-slate-200 hover:border-slate-300 transition-colors bg-white">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-2">Earn Learning Tokens</h3>
                      <p className="text-slate-600 text-sm">
                        Complete courses and earn tokens that can be used for premium content and certifications.
                      </p>
                      <Badge variant="secondary" className="mt-2 bg-slate-100 text-gray-900">
                        550+ Tokens Available
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-slate-200 hover:border-slate-300 transition-colors bg-white">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-2">Access Premium Courses</h3>
                      <p className="text-slate-600 text-sm">
                        Unlock exclusive blockchain and DeFi courses available only to wallet-connected users.
                      </p>
                      <Badge variant="secondary" className="mt-2 bg-slate-100 text-gray-900">
                        12 Premium Courses
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-slate-200 hover:border-slate-300 transition-colors bg-white">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-2">Secure Certificates</h3>
                      <p className="text-slate-600 text-sm">
                        Receive blockchain-verified certificates that prove your achievements and skills.
                      </p>
                      <Badge variant="secondary" className="mt-2 bg-slate-100 text-gray-900">
                        NFT Certificates
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* Stats */}
            <Card className="bg-gradient-to-r from-slate-900 to-slate-800 text-white border-0">
              <CardContent className="p-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">2.5K+</div>
                    <div className="text-slate-300 text-sm">Active Learners</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">50+</div>
                    <div className="text-slate-300 text-sm">Courses</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">98%</div>
                    <div className="text-slate-300 text-sm">Satisfaction</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <UserDetailsModal
        open={showUserModal}
        onClose={() => setShowUserModal(false)}
        onSubmit={handleUserDetailsSubmit}
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
      />
    </div>
  );
}