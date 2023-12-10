import { useEffect, useState } from 'react';
import style from "./RecentAnime.module.css";

interface Episode {
  id: string;
  image: string;
  title: string;
  episodeNumber: number;
  url: string;
}

export default function RecentEpisodes() {
  const [recentEpisodes, setRecentEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRecentEpisodes();
  }, []);

  async function fetchRecentEpisodes() {
    setLoading(true);
    try {
      let response = await fetch('https://animetrix-api.vercel.app/anime/gogoanime/recent-episodes');
      if (!response.ok) throw new Error('Error with first API');
      const data = await response.json();
      setRecentEpisodes(data.results.map((episode: Episode) => ({
        ...episode,
        url: `http://localhost:3000/video-player/${episode.episodeNumber}/${episode.title.replace(/\s+/g, '-').toLowerCase()}-episode-${episode.episodeNumber}`
      })));
    } catch (error) {
      console.log('First API failed, trying with fallback API');
      try {
        const responseFallback = await fetch('https://api.consumet.org/anime/gogoanime/recent-episodes');
        if (!responseFallback.ok) throw new Error('Error with fallback API');
        const dataFallback = await responseFallback.json();
        setRecentEpisodes(dataFallback.results.map((episode: Episode) => ({
          ...episode,
          url: `http://localhost:3000/video-player/${episode.episodeNumber}/${episode.title.replace(/\s+/g, '-').toLowerCase()}-episode-${episode.episodeNumber}`
        })));
      } catch (fallbackError) {
        console.error('Fallback API also failed', fallbackError);
        setRecentEpisodes([]);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-4">New Releases</h1>
      {loading && <div className={style.loader}></div>}
      <div className="grid">
        {recentEpisodes.map((episode: Episode) => (
          <a key={episode.id} href={episode.url}>
            <div className={style.recentAnimeImage}>
              <div className={style.recentAnimeImg} style={{backgroundImage: `url(${episode.image})`}} />
              <h2 className={style.recentAnimeName}>{episode.title}</h2>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
