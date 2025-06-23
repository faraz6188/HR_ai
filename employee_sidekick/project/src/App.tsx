import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import ChatPage from './pages/ChatPage';
import ResourcesPage from './pages/ResourcesPage';
import Sidebar from './components/Sidebar';
import VideoAvatar from './components/VideoAvatar';
import { useState, ReactNode, Dispatch, SetStateAction } from 'react';

interface LayoutWrapperProps {
  children: ReactNode;
  isSpeaking: boolean;
  isListening: boolean;
  setIsSpeaking: Dispatch<SetStateAction<boolean>>;
  setIsListening: Dispatch<SetStateAction<boolean>>;
}

// Create a wrapper component to handle the layout
const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ 
  children, 
  isSpeaking, 
  isListening,
  setIsSpeaking,
  setIsListening 
}) => {
  const location = useLocation();
  const isChatPage = location.pathname === '/';

  const clearMessages = () => {
    setIsSpeaking(false);
    setIsListening(false);
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar - Show on all pages */}
      <nav className="bg-white shadow-sm flex-shrink-0 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">Employee Sidekick</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600">
                Chat
              </Link>
              <Link to="/resources" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600">
                Resources
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        {/* Sidebar - Hidden on mobile, shown on md and up */}
        <div className="hidden md:flex md:flex-shrink-0 md:pt-24">
          <Sidebar 
            isSpeaking={isSpeaking} 
            isListening={isListening} 
            clearMessages={clearMessages}
          />
        </div>

        {/* Main content area */}
        <main className="flex-1 w-full flex flex-col pt-16 md:pt-24">
          {/* Mobile Avatar - Only shown on chat page and mobile */}
          {isChatPage && (
            <div className="block md:hidden flex items-center justify-center p-4 bg-gray-50 fixed top-16 left-0 right-0 z-40">
              <VideoAvatar speaking={isSpeaking} listening={isListening} size={200} />
            </div>
          )}

          {/* Routes - Chat and Resources pages */}
          <div className={`flex-1 overflow-hidden ${isChatPage ? 'mt-[280px] md:mt-0' : ''}`}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

function App() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const clearMessages = () => {
    setIsSpeaking(false);
    setIsListening(false);
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <Router>
      <LayoutWrapper 
        isSpeaking={isSpeaking} 
        isListening={isListening}
        setIsSpeaking={setIsSpeaking}
        setIsListening={setIsListening}
      >
        <Routes>
          <Route 
            path="/" 
            element={
              <ChatPage 
                setIsSpeaking={setIsSpeaking} 
                setIsListening={setIsListening}
                onClearMessages={clearMessages}
              />
            } 
          />
          <Route path="/resources" element={<ResourcesPage />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;