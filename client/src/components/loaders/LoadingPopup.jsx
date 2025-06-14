import React from 'react';

const LoadingPopup = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 shadow-lg text-center space-y-4">
        <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin mx-auto"></div>
        <p className="text-lg font-semibold text-gray-700">Generating...</p>
      </div>
    </div>
  );
};

export default LoadingPopup;
