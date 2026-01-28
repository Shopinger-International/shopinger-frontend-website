"use client";

import { useRef, useState } from "react";
import type { FC } from "react";
import { Users, ExternalLink, Share2, VolumeX, Volume2 } from "lucide-react";

const WatchLiveSection: FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <section>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Watch live</h2>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white">
              Live
            </span>

            <div className="flex items-center gap-2 rounded-full bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700">
              <Users className="h-4 w-4" />
              2.3k
            </div>
          </div>
        </div>

        {/* Video Wrapper */}
        <div className="group relative aspect-6/4 lg:aspect-6/3 overflow-hidden rounded-2xl bg-black md:rounded-3xl">
          {/* Video */}
          <video
            ref={videoRef}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            autoPlay
            loop
            muted
            playsInline
            poster="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8MHx8fDA%3D"
          >
            <source
              src="https://videos.pexels.com/video-files/5699456/5699456-hd_1920_1080_25fps.mp4"
              type="video/mp4"
            />
          </video>

          {/* Gradient Overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Watch Now */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="flex items-center gap-3 rounded-full bg-black/70 px-8 py-4 text-lg font-semibold text-white backdrop-blur transition-all hover:scale-105 hover:bg-black/60">
              <ExternalLink className="h-6 w-6" />
              Watch Now
            </button>
          </div>

          {/* Share */}
          <button
            className="absolute top-4 right-4 rounded-full bg-orange-500 p-2.5 text-white backdrop-blur transition hover:scale-110"
            aria-label="Share"
          >
            <Share2 className="h-5 w-5" />
          </button>

          {/* Mute Toggle */}
          <button
            onClick={toggleMute}
            className="absolute right-4 bottom-4 rounded-full bg-orange-500 p-2.5 text-white backdrop-blur transition hover:scale-110"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default WatchLiveSection;
