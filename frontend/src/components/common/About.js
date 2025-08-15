import Header from "./Header";
import Footer from "./Footer";
import {
  Shield,
  Users,
  Award,
  ArrowRight,
  Globe,
  Zap,
  CheckCircle,
} from "lucide-react";
export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Revolutionizing Education Through
              <span className="block text-yellow-300">Decentralization</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Breaking down barriers in traditional education by creating a
              trustless, transparent, and community-driven learning ecosystem
              powered by blockchain technology.
            </p>
          </div>
        </section>
        {/* What is Decentralized Learning */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                What is Decentralized Learning?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                A revolutionary approach to education that eliminates
                intermediaries, empowers learners, and creates a transparent,
                community-governed educational ecosystem.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="space-y-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Trustless System
                      </h3>
                      <p className="text-gray-600">
                        No central authority controls your learning journey.
                        Smart contracts ensure fair and transparent operations.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Community Governed
                      </h3>
                      <p className="text-gray-600">
                        Learners and educators collectively decide on course
                        content, quality standards, and platform improvements.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Award className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Verifiable Credentials
                      </h3>
                      <p className="text-gray-600">
                        Certificates and achievements are stored on blockchain,
                        making them tamper-proof and globally verifiable.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Traditional vs Decentralized
                </h3>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Control</span>
                    <div className="text-right">
                      <div className="text-red-600 text-sm">
                        Centralized Authority
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 mx-auto my-1" />
                      <div className="text-green-600 text-sm font-medium">
                        Community Driven
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Certificates</span>
                    <div className="text-right">
                      <div className="text-red-600 text-sm">Paper Based</div>
                      <ArrowRight className="w-4 h-4 text-gray-400 mx-auto my-1" />
                      <div className="text-green-600 text-sm font-medium">
                        Blockchain Verified
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Access</span>
                    <div className="text-right">
                      <div className="text-red-600 text-sm">
                        Geographic Barriers
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 mx-auto my-1" />
                      <div className="text-green-600 text-sm font-medium">
                        Global & Open
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Incentives</span>
                    <div className="text-right">
                      <div className="text-red-600 text-sm">
                        Limited Rewards
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 mx-auto my-1" />
                      <div className="text-green-600 text-sm font-medium">
                        Token Economy
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                How Our Decentralized System Works
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience education reimagined through blockchain technology
                and community governance.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Connect & Learn
                </h3>
                <p className="text-gray-600 mb-6">
                  Connect your wallet and access courses created by community
                  experts. No intermediaries, just pure knowledge transfer.
                </p>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-center space-x-2 text-blue-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Wallet Integration</span>
                  </div>
                </div>
              </div>
              {/* Step 2 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Earn & Validate
                </h3>
                <p className="text-gray-600 mb-6">
                  Complete courses, pass assessments, and earn learning tokens.
                  Your progress is validated by smart contracts.
                </p>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-center space-x-2 text-green-600">
                    <Zap className="w-5 h-5" />
                    <span className="font-medium">Smart Contracts</span>
                  </div>
                </div>
              </div>
              {/* Step 3 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Govern & Grow
                </h3>
                <p className="text-gray-600 mb-6">
                  Use your tokens to vote on platform decisions, course
                  approvals, and help shape the future of decentralized
                  education.
                </p>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center justify-center space-x-2 text-purple-600">
                    <Globe className="w-5 h-5" />
                    <span className="font-medium">DAO Governance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Benefits */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Choose Decentralized Learning?
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Global Access</h3>
                <p className="text-gray-600 text-sm">
                  Learn from anywhere in the world without geographic
                  restrictions
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Transparent</h3>
                <p className="text-gray-600 text-sm">
                  All transactions and achievements are publicly verifiable
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Incentivized</h3>
                <p className="text-gray-600 text-sm">
                  Earn tokens for learning and contributing to the ecosystem
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Community</h3>
                <p className="text-gray-600 text-sm">
                  Connect with like-minded learners and experts globally
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Join the Future of Education?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Be part of the revolutionary decentralized learning movement.
              Connect your wallet and start earning while you learn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Connect Wallet & Start Learning
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Explore Courses
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
