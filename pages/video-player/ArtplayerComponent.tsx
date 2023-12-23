import React, { useEffect, useRef } from 'react';
import Artplayer from 'artplayer';
import Hls from 'hls.js';

interface ArtplayerComponentProps {
  mainUrl: string; // URL of the video to be played
  style?: React.CSSProperties; // Optional style prop
}

interface ExtendedArtplayer extends Artplayer {
  [key: string]: any; // Allows for additional properties such as hlsInstance
}

const ArtplayerComponent: React.FC<ArtplayerComponentProps> = ({ mainUrl, style }) => {
  const artRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Function to handle m3u8 format using HLS.js
    const playM3u8 = (video: HTMLVideoElement, url: string, art: ExtendedArtplayer) => {
      if (Hls.isSupported()) {
        if (art.hlsInstance) art.hlsInstance.destroy();
        const hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(video);
        art.hlsInstance = hls;
        art.on('destroy', () => {
          hls.destroy();
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
      } else {
        art.notice.show = 'Unsupported playback format: m3u8';
      }
    };

    // Ensure the container exists
    if (mainUrl && artRef.current) {
      const artplayerOptions = {
        container: artRef.current,
        url: mainUrl,
        type: 'm3u8',
        customType: {
          m3u8: playM3u8,
        },
              isLive: false,
              muted: false,
              autoplay: false,
              pip: true,
              autoSize: true,
              autoMini: true,
              screenshot: true,
              setting: true,
              loop: true,
              flip: true,
              playbackRate: true,
              aspectRatio: true,
              fullscreen: true,
              fullscreenWeb: true,
              subtitleOffset: true,
              miniProgressBar: true,
              mutex: true,
              backdrop: true,
              playsInline: true,
              autoPlayback: true,
              airplay: true,
              theme: '#23ade5',
      };

      const art = new Artplayer(artplayerOptions) as ExtendedArtplayer;
      art.on('ready', () => {
        console.info('Artplayer is ready:', art);
      });

      return () => {
        if (art) {
          art.destroy();
        }
      };
    }
  }, [mainUrl]);

  return <div ref={artRef} style={style}></div>;
};

export default ArtplayerComponent;