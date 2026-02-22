import React from 'react';
import ChatInterface from './components/ChatInterface';
import ApiKeyModal from './components/ApiKeyModal';

const App: React.FC = () => {
  return (
    <>
      <ApiKeyModal />
      <ChatInterface />
    </>
  );
};

export default App;