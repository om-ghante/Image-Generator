// components/RequirementForm.jsx
import React, { useState } from 'react';
import {
  Square,
  RectangleHorizontal,
  RectangleVertical,
  Smartphone,
  UploadCloud,
  XCircle
} from 'lucide-react';
import { allTailwindColorShades } from '../colors/tailwindColors';
import LoadingPopup from '../loaders/LoadingPopup';
import GenerationSuccess from '../response/success/GenerationSuccess';
import ErrorOccured from '../response/error/ErrorOccured';
import handleGeneration from '../../utils/handleGeneration';
import logFormData from '../../console/consoleLogger';

const frameOptions = [
  { label: '1:1', icon: <Square className="w-5 h-5" /> },
  { label: '4:3', icon: <RectangleVertical className="w-5 h-5" /> },
  { label: '16:9', icon: <RectangleHorizontal className="w-5 h-5" /> },
  { label: '3:2', icon: <RectangleHorizontal className="w-5 h-5" /> },
  { label: '2:1', icon: <RectangleHorizontal className="w-5 h-5" /> },
  { label: '9:16', icon: <Smartphone className="w-5 h-5" /> },
  { label: '21:9', icon: <RectangleHorizontal className="w-5 h-5" /> }
];

const allColors = allTailwindColorShades;

const RequirementForm = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedFrame, setSelectedFrame] = useState('');
  const [selectedColors, setSelectedColors] = useState([]);
  const [images, setImages] = useState([]);
  const [imageCount, setImageCount] = useState(1);
  const [imageUsageOption, setImageUsageOption] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]); // ✅ NEW

  const handleColorClick = (hex) => {
    if (selectedColors.includes(hex)) return;
    if (selectedColors.length >= 4) {
      setSelectedColors([hex, ...selectedColors.slice(0, 3)]);
    } else {
      setSelectedColors([...selectedColors, hex]);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleRemoveImage = (indexToRemove) => {
    const updatedImages = images.filter((_, index) => index !== indexToRemove);
    setImages(updatedImages);
  };

  const handleSubmit = async () => {
    const formData = {
      prompt,
      selectedFrame,
      selectedColors,
      imageCount,
      images: images.map(file => file.name),
      imageUsageOption
    };

    setIsLoading(true);
    setErrorMessage('');
    setIsSuccess(false);

    const result = await handleGeneration(formData);
    setIsLoading(false);

    if (result.success) {
      setIsDisabled(true);
      setIsSuccess(true);
      setGeneratedImages(result.data.image_paths); 
    } else {
      setErrorMessage(result.error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6 md:p-10 space-y-8">
      <div>
        <label className="block text-lg font-semibold text-gray-800 mb-2">Describe Your Prompt</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit();
          }}
          disabled={isDisabled}
          rows={3}
          placeholder="e.g., A futuristic cityscape at night"
          className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
        />
      </div>

      <div>
        <label className="block text-lg font-semibold text-gray-800 mb-3">Select Frame Ratio</label>
        <div className="flex flex-wrap gap-3">
          {frameOptions.map(({ label, icon }) => (
            <button
              key={label}
              onClick={() => setSelectedFrame(label)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-all ${
                selectedFrame === label
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-gray-100 text-gray-700 border-gray-300'
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      </div>

      {selectedColors.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-gray-700 font-medium">Selected Colors:</span>
          {selectedColors.map((c, i) => (
            <div key={i} style={{ background: c }} className="w-6 h-6 rounded-md border border-gray-700" />
          ))}
        </div>
      )}

      <div>
        <label className="block text-lg font-semibold text-gray-800 mb-3">Choose Up to 4 Colors</label>
        <div className="grid grid-cols-8 sm:grid-cols-12 gap-2 max-h-80 overflow-y-auto border p-2 rounded-lg bg-gray-50">
          {allColors.map(({ name, hex }) => (
            <div key={name} className="flex flex-col items-center space-y-1">
              <button
                title={name}
                onClick={() => handleColorClick(hex)}
                style={{ backgroundColor: hex }}
                className={`w-6 h-6 rounded-sm border ${
                  selectedColors.includes(hex) ? 'border-black scale-110' : 'border-gray-300'
                } transition-transform`}
              />
              <span className="text-[10px] text-gray-600">{name}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-lg font-semibold text-gray-800 mb-3">Upload Reference Images</label>
        <div
          className="flex flex-col items-center justify-center w-full border-2 border-dashed rounded-lg p-6 cursor-pointer hover:border-blue-500 transition-all relative"
          onClick={() => document.getElementById('fileUpload').click()}
        >
          <UploadCloud className="w-8 h-8 text-blue-500 mb-2" />
          <p className="text-blue-600 font-medium">Click anywhere to upload images</p>
          <input
            id="fileUpload"
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        {images.length > 0 && (
          <div className="mt-4 overflow-x-auto p-2">
            <div className="flex gap-4 w-max">
              {images.map((file, index) => (
                <div
                  key={index}
                  className="relative group w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-gray-300"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`upload-${index}`}
                    className="object-cover w-full h-full rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -top-2 -right-2 rounded-full text-red-700 hover:text-red-700 transition"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6">
        <p className="text-lg font-semibold text-gray-800 mb-2">Image Usage Options</p>
        <div className="flex flex-col sm:flex-row gap-4">
          {['reference-only', 'include-in-generation'].map(option => (
            <label
              key={option}
              className={`flex items-center p-3  rounded-md cursor-pointer transition hover:ring-2 hover:ring-blue-500 w-full sm:w-1/2`}
            >
              <input
                type="radio"
                name="imageUsage"
                value={option}
                checked={imageUsageOption === option}
                onChange={(e) => setImageUsageOption(e.target.value)}
                className="form-radio h-5 w-5 text-blue-600 mr-3"
              />
              <span className="text-sm text-gray-700 font-medium">
                {option === 'reference-only' ? 'Use uploaded images as reference only' : 'Include in final output'}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-lg font-semibold text-gray-800 mb-2">Images to Generate</label>
        <select
          value={imageCount}
          onChange={(e) => setImageCount(Number(e.target.value))}
          disabled={isDisabled}
          className="w-full p-3 rounded-lg border bg-gray-50"
        >
          {[...Array(7)].map((_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1} image{i > 0 ? 's' : ''}</option>
          ))}
        </select>
      </div>

      <div className="pt-4">
        <button
          onClick={handleSubmit}
          disabled={isDisabled}
          className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold rounded-xl hover:opacity-90 transition-all"
        >
          Submit Requirements
        </button>
      </div>

      {isLoading && <LoadingPopup />}
      {isSuccess && <GenerationSuccess images={generatedImages} />} 
      {errorMessage && <ErrorOccured error={errorMessage} />}
    </div>
  );
};

export default RequirementForm;
