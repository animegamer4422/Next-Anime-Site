import { useRouter } from 'next/router';
import { SetStateAction, useEffect, useState } from 'react';
import Link from 'next/link';
import AnimeSearch from '../../components/AnimeSearch/AnimeSearch';

import '../../src/app/globals.css';
import styles from './AnimeDetails.module.css'
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

      const primaryApiUrl = `https://api-consumet-org-six.vercel.app/anime/gogoanime/info/${animeId}`;
      const fallbackUrl = `https://api.consumet.org/anime/gogoanime/info/${animeId}`;

      try {
        const response = await fetch(primaryApiUrl);
        console.log(primaryApiUrl);

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
    <>
      <Header/>
      <form id="search-form">
        <AnimeSearch />
      </form>
    
      <div className={styles.content}>
        <div className={styles.animeContainer}>
          {loading ? (
            <div className={styles.loader}></div>
          ) : anime ? (
            <div className={styles.animeContainer}>
              <div className={styles.animeDetails}>
                <h1 id="anime-title">{anime.title}</h1>
                <div id="anime-image">
                  <img src={anime.image} alt={anime.title} />
                </div>
                <p className={styles.animeDesc}> {anime.description}</p>
              </div>
    
              <div className={styles.episodesSection}>
                <div className={styles.episodeSearchSection}>
                  <form className={styles.episodeSearchForm}>
                    <input 
                      type="text" 
                      placeholder="Search episode..." 
                      value={searchTerm} 
                      onChange={handleSearch} 
                      className={styles.episodeSearchInput}
                    />
                  </form>
                </div>
                <ul id="anime-episodes" className={styles.episodeGrid}>
                  {filteredEpisodes.map((episode) => (
                    <li key={episode.id}>
                      <Link href={`/video-player/${episode.number}/${episode.id}`}>
                          <h2 className={styles.episodeBtn}>
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
      </div>
    </>
  );  
}