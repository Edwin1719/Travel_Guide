import React from 'react';

const ApiKeyModal: React.FC = () => {
  // Check if we are in an environment where the key is auto-injected (like Project IDX or similar AI Studio env)
  // If process.env.API_KEY is present, this component returns null effectively.
  // We strictly check typeof process to avoid ReferenceError in pure browser environments.
  
  const hasApiKey = typeof process !== 'undefined' && process.env && process.env.API_KEY;

  if (hasApiKey) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full text-center border-l-4 border-red-600">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Configuration Error</h2>
        <p className="text-gray-700 mb-4">
          The API Key is missing from the environment configuration.
        </p>
        <p className="text-sm text-gray-500">
          This application requires a valid <code>process.env.API_KEY</code> to function.
        </p>
      </div>
    </div>
  );
};

export default ApiKeyModal;