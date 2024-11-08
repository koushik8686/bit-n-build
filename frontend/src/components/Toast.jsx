import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';

const Toast = ({ message, type }) => {
  const isSuccess = type === 'success';
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="fixed top-4 right-4 bg-white rounded-lg shadow-lg overflow-hidden min-w-[300px]"
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {isSuccess ? (
            <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
          ) : (
            <XCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
          )}
          <div className="flex flex-col">
            <h3 className={`font-semibold ${isSuccess ? 'text-gray-900' : 'text-red-700'}`}>
              {isSuccess ? 'Congratulations!' : 'Error'}
            </h3>
            <p className="text-gray-600 text-sm">{message}</p>
          </div>
        </div>
      </div>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 2 }}
        className={`h-1 ${isSuccess ? 'bg-green-500' : 'bg-red-500'}`}
      />
    </motion.div>
  );
};

export default Toast;
