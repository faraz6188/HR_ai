import React from 'react';
import VideoAvatar from './VideoAvatar';

interface SidebarProps {
  isSpeaking: boolean;
  isListening: boolean;
  clearMessages: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSpeaking, isListening }) => {
  return (
    <div className="w-72 bg-gray-100 p-6 flex flex-col flex-shrink-0">
      {/* <div className="mb-6">
          <button 
            onClick={clearMessages}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md w-full hover:bg-indigo-700"
          >
            Delete Chat History
            </button>
            </div> */}
            <h2 className="text-xl font-bold text-gray-800 mb-2">Welcome to HR Assistant Chat!</h2>
      <div className="flex items-center justify-center mb-4">
           <VideoAvatar speaking={isSpeaking} listening={isListening} size={380} />
      </div>
      <p className="text-gray-600 text-sm mb-4">
        Your personal HR Assistant is here to help you with questions about company policies, benefits, time off, and more. Just type your question below.
      </p>
      {/* Add more placeholder content here as needed */}
    </div>
  );
};

export default Sidebar;