import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wallet as WalletIcon, CheckCircle } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import useWeb3 from "../hooks/useWeb3";
import { getUserByWallet, createOrUpdateUser } from "../../utils/userApi";
import UserDetailsModal from "./UserDetailModal";
import Header from "./Header";
import ExtraFooter from "./ExtraContent";
import Footer from "./Footer";

export default function Wallet() {
  const { account, isConnecting, connect, isMetaMaskInstalled, error } =
    useWeb3();
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        {/* <div className="max-w-6xl mx-auto"> */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to De-Education
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connect your wallet to start learning blockchain technology and
              earn tokens
            </p>
          </div>

          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <WalletIcon className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900">
                Connect MetaMask
              </CardTitle>
              <CardDescription className="text-slate-600">
                Securely connect your MetaMask wallet to access exclusive
                courses and earn tokens
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isMetaMaskInstalled ? (
                <div className="text-red-500 font-semibold text-center">
                  MetaMask is not installed.
                  <br />
                  Please install MetaMask to continue.
                </div>
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
              {error && (
                <div className="mt-2 text-red-500 text-xs text-center">
                  {error}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <ExtraFooter />
        {/* User Details Modal */}
        <UserDetailsModal
          open={showUserModal}
          onClose={() => setShowUserModal(false)}
          onSubmit={handleUserDetailsSubmit}
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
        />
        <Footer />
      </div>
    </div>
  );
}
