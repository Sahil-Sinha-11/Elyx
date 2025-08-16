import React from 'react';
import { motion } from 'framer-motion';
import { Users, Award, Heart, Shield } from 'lucide-react';

const StatsSection: React.FC = () => {
  const stats = [
    { icon: Users, value: '50K+', label: 'Active Users', color: 'from-blue-500 to-blue-600' },
    { icon: Heart, value: '1M+', label: 'Health Insights', color: 'from-emerald-500 to-emerald-600' },
    { icon: Shield, value: '99.9%', label: 'Data Security', color: 'from-purple-500 to-purple-600' },
    { icon: Award, value: '24/7', label: 'Support', color: 'from-orange-500 to-orange-600' },
  ];

  return (
    <div className="py-20 bg-gradient-to-r from-emerald-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join the growing community of users who trust Elyx for their health journey
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className={`w-20 h-20 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                <stat.icon className="w-10 h-10 text-white" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsSection;