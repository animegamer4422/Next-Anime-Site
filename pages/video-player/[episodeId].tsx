import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Hls from 'hls.js';
import Header from '../../components/Header/Header';
import AnimeSearch from '../../components/AnimeSearch/AnimeSearch';
import Footer from '../../components/Footer/Footer';
import '../../src/app/globals.css';
import styles from './Episode.module.css';

interface Anime {
  title: string;
  episode: string;
}

declare global {
  interface Window { Artplayer: any; }
}

const artplayerStyles = {
  width: '600px',
  height: '400px',
  margin: '60px auto 0',
};

export default function VideoPlayer() {
  const router = useRouter();
  const { episodeId } = router.query;
  const videoContainerRef = useRef(null);
  const [anime, setAnime] = useState<Anime | null>(null);
  const [mainUrl, setMainUrl] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (episodeId && typeof episodeId === 'string') {
      const apiUrl = `https://api.amvstr.me/api/v2/stream/${episodeId}`;
      console.log("Fetching stream from:", apiUrl);
  
      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          const mainUrl = data.stream.multi.main.url;
          const episodeParts = episodeId.split('-');
          const episodeNumber = episodeParts.pop() || 'Unknown';
          const animeTitle = episodeParts.join(' ');
  
          setMainUrl(mainUrl);
          setAnime({ title: animeTitle, episode: episodeNumber });
        })
        .catch(error => console.error('Error fetching stream:', error));
    }
  }, [episodeId]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/artplayer/dist/artplayer.js';
    script.async = true;
  
    script.onload = () => {
      if (mainUrl && videoContainerRef.current) {
        const artplayerOptions = {
          container: videoContainerRef.current,
          url: mainUrl,
          volume: 0.5,
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
          lang: navigator.language.toLowerCase(),
          customType: {
            'application/vnd.apple.mpegurl': function (video, url) {
              if (Hls.isSupported()) {
                const hls = new Hls();
                hls.loadSource(url);
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                  video.play();
                });
              } else {
                console.error('This browser does not support HLS');
              }
            },
          },
        };

        if (window.Artplayer) {
          const player = new window.Artplayer(artplayerOptions);
          if (mainUrl.endsWith('.m3u8')) {
            artplayerOptions.customType['application/vnd.apple.mpegurl'](player.video, mainUrl);
          }
        } else {
          console.error('Artplayer is not loaded');
        }
      }
    };
  
    script.onerror = () => {
      console.error('Error loading Artplayer script');
    };
  
  
    document.body.appendChild(script);
  
    return () => {
      document.body.removeChild(script);
    };
  }, [mainUrl, videoContainerRef]);
  
  // Function to update searchQuery from AnimeSearch
  const updateSearchQuery = (query: string) => {
    setSearchQuery(query);
    // Additional logic to handle search results can be added here
  };

  return (
    <>
          <Header />
    <div>
            <div className="search-section">
        <AnimeSearch setQuery={updateSearchQuery} />
      </div>
      
      <main>
        <section>
          <div className={styles.container}> 
            <h2 className={styles.currentEp}> 
              Current Episode - {anime?.episode}
            </h2>
            <div className={styles.playerWrapper} ref={videoContainerRef} style={artplayerStyles}> 
              {/* Artplayer will initialize its video player here */}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
    </>
  );
}