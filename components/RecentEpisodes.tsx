import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Episode {
  id: string;
  image: string;
  title: string;
  episodeNumber: number;
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
      setRecentEpisodes(data.results);
    } catch (error) {
      console.log('First API failed, trying with fallback API');
      try {
        const responseFallback = await fetch('https://api.consumet.org/anime/gogoanime/recent-episodes');
        if (!responseFallback.ok) throw new Error('Error with fallback API');
        const dataFallback = await responseFallback.json();
        setRecentEpisodes(dataFallback.results);
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
      {loading && <div className="loader"></div>}
      <div className="grid">
        {recentEpisodes.map(episode => (
          <Link key={episode.id} href={`/anime/${episode.id}`} className="recent-anime-image">
            <div className="image-container">
              <img src={episode.image} alt={episode.title} className="recent-anime-img" />
            </div>
            <h2 className="recent-anime-name">{episode.title}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
