{
  /* Features Grid */
}
import { Zap } from "lucide-react";
import { BookOpen, Shield } from "lucide-react";
export default function ExtraFooter() {
  return (
    <div className="extra-footer">
      <div className="grid md:grid-cols-3 gap-8 pb-[30px]">
        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <Zap className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Earn Tokens
          </h3>
          <p className="text-gray-600">
            Complete courses and earn learning tokens that unlock premium
            content.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Premium Courses
          </h3>
          <p className="text-gray-600">
            Access exclusive blockchain and DeFi courses for wallet-connected
            users.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            NFT Certificates
          </h3>
          <p className="text-gray-600">
            Receive blockchain-verified certificates that prove your
            achievements.
          </p>
        </div>
      </div>
    </div>
  );
}
