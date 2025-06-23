import React from 'react';
import ChatContainer from '../components/ChatContainer';
import { Dispatch, SetStateAction } from 'react';

// Define interface for ChatPage props
interface ChatPageProps {
  setIsSpeaking: Dispatch<SetStateAction<boolean>>;
  setIsListening: Dispatch<SetStateAction<boolean>>;
  onClearMessages: () => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ setIsSpeaking, setIsListening, onClearMessages }) => {

  // This useEffect is likely for clearing messages on page load, but it's commented out.
  // Keeping it for now in case it's intended.
  /*
  useEffect(() => {
      // onClearMessages();
  }, [onClearMessages]);
  */

  return (
    <div className="h-full w-full">
      {/* ChatContainer manages its own layout for messages and input */}
      {/* Pass setter functions down to ChatContainer */}
      <ChatContainer 
        setIsSpeaking={setIsSpeaking}
        setIsListening={setIsListening}
        onClearMessages={onClearMessages}
      />
    </div>
  );
};

export default ChatPage;