// client/src/components/MusicPlayer.jsx

import React, { useEffect, useRef, useState } from "react";
import { Music, Pause, Play } from "lucide-react";

function MusicPlayer() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [needsClick, setNeedsClick] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.volume = 0.08;
    audio.loop = true;

    const tryAutoPlay = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
        setNeedsClick(false);
      } catch (error) {
        setIsPlaying(false);
        setNeedsClick(true);
      }
    };

    tryAutoPlay();
  }, []);

  const toggleMusic = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (audio.paused) {
      audio.volume = 0.08;
      await audio.play();
      setIsPlaying(true);
      setNeedsClick(false);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="music-player">
      <audio ref={audioRef} src="/theme.mp3" preload="auto" />

      <button
        type="button"
        className={isPlaying ? "music-toggle playing" : "music-toggle"}
        onClick={toggleMusic}
        title={isPlaying ? "Pause relaxing music" : "Play relaxing music"}
      >
        <Music size={17} />
        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        <span>{isPlaying ? "Music On" : needsClick ? "Start Music" : "Music"}</span>
      </button>
    </div>
  );
}

export default MusicPlayer;