import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
import Hls from 'hls.js';
import Head from 'next/head';
import Header from '../../components/Header/Header';
import AnimeSearch from '../../components/AnimeSearch/AnimeSearch';
import Footer from '../../components/Footer/Footer';
import '../../src/app/globals.css';
import './Episode.module.css';

interface Anime {
  title: string;
  episode: string;
}

export default function VideoPlayer() {
  const router = useRouter();
  const { episodeId } = router.query;
  const videoRef = useRef<HTMLVideoElement>(null);
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
    if (mainUrl && videoRef.current) {
      const video = videoRef.current;
      const player = new Plyr(video, {
        controls: [
          "play-large", "rewind", "play", "fast-forward", "progress",
          "current-time", "duration", "mute", "volume", "captions",
          "settings", "pip", "airplay", "fullscreen",
        ],
      });

      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(mainUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => video.pause());
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = mainUrl;
        video.addEventListener("canplaythrough", () => video.pause());
      } else {
        console.error("This is a legacy browser that does not support HLS.");
      }
    }
  }, [mainUrl]);

  // Function to update searchQuery from AnimeSearch
  const updateSearchQuery = (query: string) => {
    setSearchQuery(query);
    // Additional logic to handle search results can be added here
  };

  return (
    <div>
      <Head>
        <title>{anime ? `${anime.title} - Episode ${anime.episode}` : 'Loading...'} | Anime Site</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <link rel="stylesheet" href="https://cdn.plyr.io/3.6.9/plyr.css" />
        <style>{`
          :root {
            --plyr-color-main: #ff69b4;
            --plyr-video-background: #282a36;
          }
        `}</style>
      </Head>

      <Header />
      <div className="search-section">
        <AnimeSearch setQuery={updateSearchQuery} />
      </div>

      <main>
        <section className="video-section">
          <div className="container">
            <h2 className="current-ep">Current Episode - {anime?.episode}</h2>
            <div className="player-wrapper">
              {mainUrl && (
                <video ref={videoRef} id="player" width="320" height="240" controls playsInline>
                  <source src={mainUrl} type="application/vnd.apple.mpegurl" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
