import React from 'react';
import { motion } from 'framer-motion';

type AvatarProps = {
  // Removed speaking and listening as they won't directly control emoji in this simplified version
  size?: number; // Add size prop for control
  isBot?: boolean; // Keep isBot to differentiate bot/user if needed elsewhere, though primarily for bot emoji here
};

const Avatar: React.FC<AvatarProps> = ({ size = 30, isBot = false }) => {
  // Only render emoji for the bot in this component
  if (!isBot) {
      return null; // Or render a default user avatar if needed
  }

  let emoji = '🤖'; // Default to robot emoji for bot
  let ariaLabel = 'Robot face';

  // In this simplified version, the emoji is static for the bot avatar in chat.
  // If you need dynamic emojis based on state in chat, the logic would go here.

  return (
    <motion.div 
      className="flex flex-col items-center justify-center"
      style={{ width: size, height: size, fontSize: size * 0.7 }}
    >
      <span role="img" aria-label={ariaLabel}>
        {emoji}
      </span>
    </motion.div>
  );
};

export default Avatar;