import React from 'react';

const GenerationSuccess = ({ images }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 shadow-lg text-center space-y-4 max-w-2xl w-full">
        <p className="text-green-600 font-bold text-xl">🎉 Generated Successfully!</p>
        <div className="flex flex-wrap justify-center gap-4">
          {images.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Generated ${index + 1}`}
              className="w-40 h-40 object-cover rounded shadow"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GenerationSuccess;
