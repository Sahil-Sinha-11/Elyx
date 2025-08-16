import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Shield, 
  Activity, 
  Brain, 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  Users, 
  Award,
  Zap,
  Globe,
  Star
} from 'lucide-react';
import Navbar from './Navbar';
import FeatureCard from './FeatureCard';
import StatsSection from './StatsSection';
import AuthModal from './AuthModal';

interface LandingPageProps {
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const handleAuthSuccess = () => {
    onLogin();
  };

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Insights',
      description: 'Advanced machine learning algorithms analyze your health data to provide personalized insights and recommendations.',
      gradient: 'bg-gradient-to-r from-purple-500 to-purple-600'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Bank-level encryption and HIPAA compliance ensure your health data remains completely private and secure.',
      gradient: 'bg-gradient-to-r from-blue-500 to-blue-600'
    },
    {
      icon: Activity,
      title: 'Real-time Monitoring',
      description: 'Continuous health tracking with instant alerts and notifications for any concerning patterns.',
      gradient: 'bg-gradient-to-r from-emerald-500 to-emerald-600'
    },
    {
      icon: Zap,
      title: 'Instant Analysis',
      description: 'Get immediate health assessments and recommendations based on your symptoms and medical history.',
      gradient: 'bg-gradient-to-r from-yellow-500 to-orange-500'
    },
    {
      icon: Globe,
      title: 'Telehealth Integration',
      description: 'Seamlessly connect with healthcare providers and schedule virtual consultations.',
      gradient: 'bg-gradient-to-r from-indigo-500 to-indigo-600'
    },
    {
      icon: Sparkles,
      title: 'Personalized Care',
      description: 'Tailored health plans and recommendations based on your unique health profile and goals.',
      gradient: 'bg-gradient-to-r from-pink-500 to-rose-500'
    }
  ];

  const benefits = [
    'Personalized health insights powered by AI',
    'Secure, HIPAA-compliant data protection',
    '24/7 health monitoring and alerts',
    'Direct connection to healthcare providers',
    'Comprehensive health analytics dashboard',
    'Mobile app for health tracking on-the-go'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-emerald-400/10 rounded-full blur-3xl"></div>
      </div>

      <Navbar 
        onSignIn={() => openAuthModal('signin')}
        onSignUp={() => openAuthModal('signup')}
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            {/* Animated Logo */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="inline-block mb-8"
            >
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl">
                  <Heart className="w-12 h-12 text-white" fill="currentColor" />
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-4 border-2 border-dashed border-emerald-300 rounded-full"
                ></motion.div>
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-6xl sm:text-7xl lg:text-8xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                Elyx
              </span>
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
            >
              Your AI-Powered
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Health Companion
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              Transform your healthcare journey with intelligent insights, personalized recommendations, 
              and comprehensive health monitoring. Experience medicine reimagined for the digital age.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => openAuthModal('signup')}
                className="group bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-lg font-semibold px-10 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-2"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => openAuthModal('signin')}
                className="border-2 border-emerald-500 text-emerald-600 text-lg font-semibold px-10 py-4 rounded-full hover:bg-emerald-500 hover:text-white transition-all duration-300"
              >
                Sign In
              </motion.button>
            </motion.div>

            {/* Benefits List */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto"
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
                  className="flex items-center space-x-3 text-gray-700"
                >
                  <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                  <span className="text-lg">{benefit}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Powerful Features for Better Health
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how Elyx uses cutting-edge technology to revolutionize your healthcare experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                gradient={feature.gradient}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-emerald-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600">
              Real stories from people who transformed their health with Elyx
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Healthcare Professional",
                content: "Elyx has revolutionized how I monitor my patients. The AI insights are incredibly accurate and have helped me provide better care.",
                rating: 5
              },
              {
                name: "Michael Chen",
                role: "Fitness Enthusiast",
                content: "The personalized recommendations have helped me optimize my workout routine and improve my overall health significantly.",
                rating: 5
              },
              {
                name: "Emily Davis",
                role: "Chronic Care Patient",
                content: "Managing my condition has become so much easier with Elyx. The real-time monitoring gives me peace of mind.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-emerald-600">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-emerald-500 to-blue-600 rounded-3xl p-12 text-white shadow-2xl"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Ready to Transform Your Health?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of users who are already experiencing the future of healthcare
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openAuthModal('signup')}
              className="bg-white text-emerald-600 text-lg font-semibold px-10 py-4 rounded-full hover:shadow-xl transition-all duration-300"
            >
              Start Your Journey Today
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
};

export default LandingPage;