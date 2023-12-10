import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import style from "./RecentAnime.module.css";

interface Episode {
  id: string;
  image: string;
  title: string;
  episodeNumber: number;
  episodeId: string;
}

export default function RecentEpisodes() {
  const [recentEpisodes, setRecentEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Initialize useRouter

  // Function to navigate to the video player
  const navigateToVideoPlayer = (episodeId: string) => {
    router.push(`/video-player/${episodeId}`);
};

  useEffect(() => {
    fetchRecentEpisodes();
  }, []);

  async function fetchRecentEpisodes() {
    setLoading(true);
    try {
      let response = await fetch('https://animetrix-api.vercel.app/anime/gogoanime/recent-episodes');
      if (!response.ok) throw new Error('Error with first API');
      const data = await response.json();
      setRecentEpisodes(data.results); // Set the episodes directly without modifying the URL
    } catch (error) {
      console.log('First API failed, trying with fallback API');
      try {
        const responseFallback = await fetch('https://api.consumet.org/anime/gogoanime/recent-episodes');
        if (!responseFallback.ok) throw new Error('Error with fallback API');
        const dataFallback = await responseFallback.json();
        setRecentEpisodes(dataFallback.results); // Set the episodes directly from the fallback API
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
        {recentEpisodes.map((episode) => (
          <div 
            key={episode.id} 
            className={style.recentAnimeImage} 
            onClick={() => navigateToVideoPlayer(episode.episodeId)}
            style={{cursor: 'pointer'}}
          >
            <div className={style.recentAnimeImg} style={{backgroundImage: `url(${episode.image})`}} />
            <h2 className={style.recentAnimeName}>{episode.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
