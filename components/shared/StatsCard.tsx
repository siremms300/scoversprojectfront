'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon,
  trend,
  className
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className={`glass-effect rounded-2xl p-6 card-hover ${className}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <h3 className="text-3xl font-bold gradient-text">{value}</h3>
          {change && (
            <p className={`text-sm mt-2 flex items-center gap-1 ${
              trend === 'up' ? 'text-green-500' : 'text-red-500'
            }`}>
              <span>{trend === 'up' ? '↑' : '↓'}</span>
              {change}
            </p>
          )}
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-[#1E3A8A]/10 to-[#2563EB]/10 
                      rounded-xl flex items-center justify-center">
          {icon}
        </div>
      </div>
    </motion.div>
  );
};