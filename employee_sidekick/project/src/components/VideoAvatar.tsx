import React, { useEffect, useRef } from 'react';

type VideoAvatarProps = {
  speaking: boolean;
  listening: boolean;
  size?: number;
};

const VideoAvatar: React.FC<VideoAvatarProps> = ({ speaking, listening, size = 40 }) => {
  const idleVideo = '/src/avatar/idle.mp4';
  const talkingVideo = '/src/avatar/talking.mp4';

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const activeVideo = speaking ? talkingVideo : idleVideo;

    if (videoRef.current) {
      if (speaking) {
        videoRef.current.loop = true;
        if (videoRef.current.src.indexOf(talkingVideo) === -1) {
          videoRef.current.src = talkingVideo;
        }
        videoRef.current.play().catch(error => console.error('Video play failed:', error));
      } else {
        videoRef.current.loop = true;
        videoRef.current.pause();
        if (videoRef.current.src.indexOf(idleVideo) === -1) {
          videoRef.current.src = idleVideo;
        }
        videoRef.current.play().catch(error => console.error('Idle video play failed:', error));
      }
    }
  }, [speaking, idleVideo, talkingVideo]);

  useEffect(() => {
    if (videoRef.current && !speaking) {
      if (videoRef.current.src.indexOf(idleVideo) !== -1 && videoRef.current.paused) {
        videoRef.current.play().catch(error => console.error('Idle video play failed:', error));
      }
    }
  }, [speaking, idleVideo]);

  useEffect(() => {
    if(videoRef.current) {
      videoRef.current.src = idleVideo;
      videoRef.current.loop = true;
    }
  }, [idleVideo]);

  return (
    <div 
      className="flex flex-col items-center justify-center overflow-hidden"
      style={{ width: size, height: size }}
    >
      <video
        ref={videoRef}
        muted
        autoPlay
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        preload="auto"
      />
    </div>
  );
};

export default VideoAvatar; 