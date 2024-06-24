"use client";

import dynamic from "next/dynamic";

// Dynamically import react-player to avoid SSR issues
const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });

interface VideoPlayerProps {
  url: string;
}

export function VideoPlayer({ url }: VideoPlayerProps) {
  return (
    <div className="relative aspect-video w-full bg-black rounded-xl overflow-hidden">
      <ReactPlayer
        url={url}
        width="100%"
        height="100%"
        controls
        playing={false}
        config={{
          youtube: {
            playerVars: { modestbranding: 1, rel: 0 },
          },
        }}
      />
    </div>
  );
}
