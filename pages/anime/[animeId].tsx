import { useRouter } from 'next/router';
import { SetStateAction, useEffect, useState } from 'react';
import Link from 'next/link';
import AnimeSearch from '../../components/AnimeSearch/AnimeSearch';

import '../../src/app/globals.css';
import Header from '../../components/Header/Header';

interface Anime {
  id: string;
  title: string;
  image: string;
  description: string;
  episodes: Episode[];
}

interface Episode {
  number: number;
  id: string;
}

export default function AnimeDetails() {
  const [anime, setAnime] = useState<Anime | null>(null);
  const router = useRouter();
  const { animeId } = router.query;
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredEpisodes = anime ? anime.episodes.filter((episode) =>
    episode.number.toString().includes(searchTerm)
  ) : [];

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      setLoading(true);
      if (typeof animeId === 'undefined') return;

      const primaryApiUrl = `https://animetrix-api.vercel.app/anime/gogoanime/info/${animeId}`;
      const fallbackUrl = `https://api.consumet.org/anime/gogoanime/info/${animeId}`;

      try {
        const response = await fetch(primaryApiUrl);

        if (!response.ok) {
          throw new Error('Error fetching data from primary API');
        }

        const data = await response.json();
        setAnime(data);
      } catch (primaryApiError) {
        console.error('Error:', primaryApiError);
      
        try {
          const fallbackResponse = await fetch(fallbackUrl);

          if (!fallbackResponse.ok) {
            throw new Error('Error fetching data from fallback API');
          }

          const fallbackData = await fallbackResponse.json();
          setAnime(fallbackData);
        } catch (fallbackApiError) {
          console.error('Error:', fallbackApiError);
        }
      }
      setLoading(false);
    };

    fetchAnimeDetails();
  }, [animeId]);

  return (
    <div className="container">
  <Header/>
      <div className="search-section">
        <form id="search-form">
          <AnimeSearch />
        </form>
      </div>
  
      {loading ? (
        <div className="loader"></div>
      ) : anime ? (
        <div className="anime-container">
          <div className="anime-details" id="anime-details">
            <h1 id="anime-title">{anime.title}</h1>
            <div id="anime-image">
              <img src={anime.image} alt={anime.title} />
            </div>
            <p className="anime-desc" id="anime-description">{anime.description}</p>
          </div>
  
          <div className="episodes-section" id="episode-list">
            <div className="episode-search-section">
              <form className="episode-search-form">
                <input 
                  type="text" 
                  placeholder="Search episode..." 
                  value={searchTerm} 
                  onChange={handleSearch} 
                  className="episode-search-input"
                />
              </form>
            </div>
            <ul id="anime-episodes" className="episode-grid">
              {filteredEpisodes.map((episode) => (
                <li key={episode.id}>
                  <Link href={`/video-player/${episode.number}/${episode.id}`}>
                      <h2 className="episode-btn">
                        EP {episode.number}
                      </h2>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p>Error loading data...</p>
      )}
    </div>
  );  
}  