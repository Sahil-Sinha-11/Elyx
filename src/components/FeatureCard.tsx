import React from 'react';
import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, gradient, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10, scale: 1.02 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/50"
    >
      <div className={`w-16 h-16 ${gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-4">
        {title}
      </h3>
      
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};

export default FeatureCard;