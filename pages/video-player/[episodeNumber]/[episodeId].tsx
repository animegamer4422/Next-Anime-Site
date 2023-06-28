import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
import Hls from 'hls.js';
import '../../../src/app/globals.css';
import Head from 'next/head';
import Header from '../../../components/Header';
import AnimeSearch from '../../../components/AnimeSearch';


interface Anime {
  title: string;
}

export default function VideoPlayer() {
  const router = useRouter();
  const { episodeNumber, episodeId } = router.query;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [anime, setAnime] = useState<Anime | null>(null);
  const [mainUrl, setMainUrl] = useState("");

  const fetchAnimeDetails = async (animeId: string) => {
    const primaryApiUrl = `https://animetrix-api.vercel.app/anime/gogoanime/${animeId}`;
    const fallbackUrl = `https://api.consumet.org/anime/gogoanime/${animeId}`;

    try {
      const response = await fetch(primaryApiUrl);
      if (!response.ok)
        throw new Error(
          `Error fetching anime details from primary API: ${response.statusText}`
        );
      const data = await response.json();
      setAnime(data);
    } catch (primaryApiError) {
      console.error("Error:", primaryApiError);

      // Fallback API
      console.log("Fetching data from fallback API...");
      const fallbackResponse = await fetch(fallbackUrl);
      if (!fallbackResponse.ok)
        throw new Error(
          `Error fetching anime details from fallback API: ${fallbackResponse.statusText}`
        );
      const fallbackData = await fallbackResponse.json();
      setAnime(fallbackData);
    }
  };

  const navigateToEpisode = (episodeChange: number) => {
    const newEpisodeNumber = Number(episodeNumber) + episodeChange;
    const baseAnimeId = episodeId ? episodeId.toString().split('-')[0] : '';
    router.push(`/path/to/episode/${baseAnimeId}-${newEpisodeNumber}?episodeNumber=${newEpisodeNumber}&episodeId=${baseAnimeId}-${newEpisodeNumber}`);
  }

  useEffect(() => {
    if (episodeNumber && episodeId) {
      let baseAnimeId = '';
      if (typeof episodeId === 'string') {
        baseAnimeId = episodeId.substring(0, episodeId.lastIndexOf("-"));
      } else {
        // handle the case when episodeId is not a string
        console.error('episodeId is not a string', episodeId);
      }
      fetchAnimeDetails(baseAnimeId);

      const apiUrl = `https://api.amvstr.ml/api/v2/stream/${episodeId}`;
      fetch(apiUrl)
          .then(response => response.json())
          .then(data => {
            const mainUrl = data.data.stream.multi.main.url;
            setMainUrl(mainUrl);
          })
          .catch(error => console.error('Error:', error));
      }
  }, [episodeNumber, episodeId]);
      
  useEffect(() => {
    if (mainUrl && videoRef.current) {
      const video = videoRef.current;
      const player = new Plyr(video, {
        controls: [
          "play-large",
          "rewind",
          "play",
          "fast-forward",
          "progress",
          "current-time",
          "duration",
          "mute",
          "volume",
          "captions",
          "settings",
          "pip",
          "airplay",
          "fullscreen",
        ],
      });
      
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(mainUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          video.pause();
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = mainUrl;
        video.addEventListener("canplaythrough", function () {
          video.pause();
        });
    } else {
        console.error("This is a legacy browser that does not support HLS.");
    }
  }
}, [mainUrl]);

return (
  <div>
    <Head>
      <title>Anime Site - Video Player</title>
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
      <AnimeSearch />
    </div>

    <main>
      <section className="video-section">
        <div className="container">
          <h2 className="video-title">Video Player</h2>
          <div className="player-wrapper">
            {mainUrl && (
              <video ref={videoRef} id="player" width="320" height="240" controls playsInline>
                <source src={mainUrl} type="application/vnd.apple.mpegurl" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
          {anime && episodeNumber && (
            <p className="current-ep">{anime.title} - Episode {episodeNumber}</p>
          )}
        </div>
      </section>

      <div className="episode-navigation">
        <button 
          id="prev-episode" 
          className="episode-button" 
          onClick={() => navigateToEpisode(-1)}
          disabled={Number(episodeNumber) <= 1} // Disable button if it's the first episode
        >
          Previous
        </button>
        <button 
          id="next-episode" 
          className="episode-button" 
          onClick={() => navigateToEpisode(1)}
        >
          Next
        </button>
      </div>

    </main>

    <footer className="footer">
      <div className="footer-wrapper">
        <p>&copy; Anime Site 2023</p>
      </div>
    </footer>
  </div>
);
}
