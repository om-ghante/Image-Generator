import React from 'react';

const ErrorOccured = ({ error }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 shadow-lg text-center space-y-4">
        <p className="text-red-600 font-bold text-xl">Error Occurred</p>
        <p className="text-gray-600 text-sm">{error}</p>
      </div>
    </div>
  );
};

export default ErrorOccured;
