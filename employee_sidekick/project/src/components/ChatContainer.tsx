import React, { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import ChatInterface from './ChatInterface';
import { Message } from './ChatInterface'; // Assuming Message interface is exported
import { Send, Volume2, VolumeX, Mic, StopCircle } from 'lucide-react'; // Added Mic, StopCircle back
import { motion } from 'framer-motion';
import Avatar from './Avatar'; // Added Avatar back for chat messages

// Define interface for ChatContainer props - make setters optional
interface ChatContainerProps {
  setIsSpeaking?: Dispatch<SetStateAction<boolean>>;
  setIsListening?: Dispatch<SetStateAction<boolean>>;
  setIsResponseLong?: Dispatch<SetStateAction<boolean>>; // Keep optional setter
  onClearMessages?: () => void; // Add callback for clearing messages
}

// Accept props in ChatContainer function signature
const ChatContainer: React.FC<ChatContainerProps> = ({ setIsSpeaking, setIsListening, setIsResponseLong, onClearMessages }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your HR Assistant. How can I help you today?',
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Added isLoading state

  // isSpeaking, isListening, isResponseLong state is managed in App.tsx or parent
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  // Speech Recognition state and initialization effect
  const [isListeningInternally, setIsListeningInternally] = useState(false); // Local state for mic button visual feedback
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null); // Keep SpeechRecognition state
  const [transcript, setTranscript] = useState(''); // Keep transcript state

  // State and refs for Text-to-Speech
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Define handleSendMessage before useEffect
  const handleSendMessage = async () => {
    if (inputText.trim() === '') return;
    
    const userMessageToSend = inputText;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: userMessageToSend,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    if (setIsSpeaking) setIsSpeaking(true);
    if (setIsListening) setIsListening(false);
    if (setIsResponseLong) setIsResponseLong(false);

    try {
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessageToSend }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response from backend');
      }

      const data = await response.json();
      const assistantResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantResponse]);
      
      if (setIsResponseLong) setIsResponseLong(assistantResponse.text.length > 100);

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Error: Could not connect to the HR Assistant.' + (error instanceof Error ? ` ${error.message}` : ''),
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      if (setIsResponseLong) setIsResponseLong(false);
    }
  };

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        const spokenText = event.results[0][0].transcript;
        setTranscript(spokenText);
        setInputText(spokenText);
      };

      recognitionInstance.onend = () => {
        setIsListeningInternally(false);
        if (setIsListening) setIsListening(false);
        if (transcript) {
          setTimeout(() => {
            if(transcript.trim()){
              handleSendMessage();
              setTranscript('');
              setInputText('');
            }
          }, 100);
        } else {
          console.log("Speech recognition ended with no result.");
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListeningInternally(false);
        if (setIsListening) setIsListening(false);
        setTranscript('');
        setInputText('');
      };

      setRecognition(recognitionInstance);
    } else {
      console.warn('Speech Recognition not supported in this browser.');
    }

    return () => {
      if(recognition){
        recognition.stop();
      }
    };
  }, [transcript, setIsListening]); // Remove handleSendMessage from dependencies

  // Text-to-speech and Speaking state control for assistant messages
  useEffect(() => {
    // Initialize speech synthesis
    synthRef.current = window.speechSynthesis;

    // Find the last message
    const lastMessage = messages[messages.length - 1];

    // Check if it's a new assistant message
    if (lastMessage && lastMessage.sender === 'assistant') {
      // Set speaking to true when assistant response is available
      if(setIsSpeaking) setIsSpeaking(true);

      if (isAudioEnabled) {
        const utterance = new SpeechSynthesisUtterance(lastMessage.text);

        utterance.onend = () => {
          // Set speaking to false when speech ends
          if(setIsSpeaking) setIsSpeaking(false);
        };

        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event);
          // Set speaking to false even if there's an error
          if(setIsSpeaking) setIsSpeaking(false);
        };

        synthRef.current.speak(utterance);

         // Cleanup function for speech synthesis
        return () => {
          if (synthRef.current && synthRef.current.speaking) {
            synthRef.current.cancel();
          }
        };

      } else {
        // If audio is not enabled, simulate speaking with a timeout
        // The duration of this timeout could be estimated based on text length
        const speakingDuration = lastMessage.text.length * 50; // Estimate 50ms per character
        const speakingTimeout = setTimeout(() => {
          if(setIsSpeaking) setIsSpeaking(false);
        }, speakingDuration);

        // Cleanup for timeout
        return () => clearTimeout(speakingTimeout);
      }
    } else {
        // If the last message is not from the assistant (e.g., user message), ensure not speaking
        if(setIsSpeaking) setIsSpeaking(false);
    }

    // Cleanup function to cancel speech if component unmounts or audio is disabled
    return () => {
      if (synthRef.current && synthRef.current.speaking) {
        synthRef.current.cancel();
      }
    };

  }, [messages, isAudioEnabled, setIsSpeaking]); // Depend on messages, isAudioEnabled, and setIsSpeaking setter

   // Auto-scroll to bottom of messages - This logic should ideally be in ChatInterface if it displays messages directly
  // For now, keeping it here assumes ChatInterface doesn't handle its own scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Function to clear messages
  const clearMessages = () => {
    // Clear messages array and reset to initial state
    setMessages([{
      id: '1',
      text: 'Hello! I\'m your HR Assistant. How can I help you today?',
      sender: 'assistant',
      timestamp: new Date(),
    }]);
    // Clear input text
    setInputText('');
    // Reset audio state
    setIsAudioEnabled(true);
    // Call parent's clear function if provided
    if (onClearMessages) {
      onClearMessages();
    }
    // Stop any ongoing speech
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  // Simulate speech recognition toggle (now using actual Web Speech API)
  const toggleListening = () => {
    if (recognition) {
      if (isListeningInternally) { // Use local state
        recognition.stop(); // Stop recognition
        setIsListeningInternally(false);
        if (setIsListening) setIsListening(false);
      } else {
        try {
          setTranscript(''); // Clear previous transcript
          setInputText(''); // Clear previous input text
          recognition.start(); // Start recognition
          setIsListeningInternally(true);
          if (setIsListening) setIsListening(true);
          console.log('Speech recognition started...');
        } catch (error) {
           console.error("Error starting speech recognition:", error);
           setIsListeningInternally(false);
           if (setIsListening) setIsListening(false);
        }
      }
    }
  };

  const toggleMute = () => {
    if (synthRef.current) {
      if (synthRef.current.speaking) {
        synthRef.current.cancel();
      }
    }
    setIsMuted(prev => !prev);
     if(setIsSpeaking) setIsSpeaking(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const toggleAudio = () => {
    setIsAudioEnabled(prev => !prev);
    // The useEffect for text-to-speech is already using this state
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Message area - takes remaining height and is scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24 md:pb-4">
        {messages.map(message => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex items-end ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender === 'assistant' && (
              <div className="flex-shrink-0 mr-3">
                <Avatar isBot={true} size={30} />
              </div>
            )}

            <div
              className={`max-w-[70%] p-3 rounded-lg space-y-2 ${
                message.sender === 'user'
                  ? 'bg-green-200 text-gray-800 rounded-bl-lg rounded-br-lg rounded-tr-none'
                  : message.isError
                  ? 'bg-red-500 text-white rounded-bl-lg rounded-br-lg rounded-tl-none'
                  : 'bg-gray-200 text-gray-800 rounded-bl-lg rounded-br-lg rounded-tl-none'
              }`}
            >
              {message.sender === 'user' ? (
                <p>{message.text}</p>
              ) : (
                <div>
                  {message.text.split('\n').map((line, index) => {
                    if (line.trim().startsWith('* ')) {
                      return (
                        <div key={index} className="flex items-start">
                          <span className="mr-2 text-gray-700">•</span>
                          <p className="flex-1">{line.trim().substring(2)}</p>
                        </div>
                      );
                    } else if (line.trim()){
                      return <p key={index}>{line}</p>;
                    } else {
                      return <div key={index} className="h-1"></div>;
                    }
                  })}
                </div>
              )}

              <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-gray-600' : 'text-gray-600'}`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area - fixed at bottom */}
      <div className="flex-shrink-0 p-4 bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 md:static">
        <div className="flex items-center space-x-2 max-w-7xl mx-auto">
          <button
            onClick={toggleAudio}
            className="p-2 rounded-full text-gray-700 hover:bg-gray-200"
          >
            {isAudioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleListening}
            className={`p-2 rounded-full ${
              isListeningInternally ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } transition-colors flex items-center justify-center`}
          >
            {isListeningInternally ? <StopCircle size={24} /> : <Mic size={24} />}
            <span className="sr-only">{isListeningInternally ? 'Stop Listening' : 'Start Listening'}</span>

            {isListeningInternally && (
              <motion.div
                className="absolute w-16 h-16 rounded-full bg-red-500 opacity-75"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              />
            )}
          </motion.button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isListeningInternally ? 'Listening...' : 'Ask something related to HR...'}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading || isListeningInternally}
          />
          <button
            onClick={handleSendMessage}
            className={`p-2 rounded-full ${inputText.trim() ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500'}`}
            disabled={!inputText.trim() || isLoading}
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatContainer; 