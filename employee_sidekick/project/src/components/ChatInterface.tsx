import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare } from 'lucide-react';
import { ChatMessage } from '../types/chat';
import { Dispatch, SetStateAction } from 'react';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  setIsSpeaking: Dispatch<SetStateAction<boolean>>;
  setIsListening: Dispatch<SetStateAction<boolean>>;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  setIsSpeaking,
  setIsListening,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Note: State and logic for input, send, mic, mute, TTS, STT are moved to parent ChatPage.
  // ChatInterface is now primarily responsible for displaying messages.

  // Scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full w-full">
      {/* Message area, will be scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`rounded-lg p-3 max-w-xs ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : message.isError
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {/* Render message text, handling newlines and markdown lists */}
              {message.text.split('\n').map((line, index) => {
                if (line.startsWith('-')) {
                  return <li key={index} className="ml-4 list-disc whitespace-pre-wrap">{line.substring(1).trim()}</li>;
                } else if (line.startsWith('*')) {
                   return <li key={index} className="ml-4 list-disc whitespace-pre-wrap">{line.substring(1).trim()}</li>;
                } else {
                  return <p key={index} className="whitespace-pre-wrap">{line}</p>;
                }
              })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area will be handled by parent ChatPage */}
      {/* Placeholder if needed: */}
      {/* <div className="flex-shrink-0 p-4 bg-white border-t">Input Area</div> */}
    </div>
  );
};

export default ChatInterface;