import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AnimeSearch from '../../components/AnimeSearch/AnimeSearch';
import Header from '../../components/Header/Header';
import styles from './AnimeDetails.module.css';

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
  const router = useRouter();
  const { animeId } = router.query;
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAnimeDetails = useCallback(async () => {
    setLoading(true);
    if (!animeId || typeof animeId !== 'string') return;

    // Use environment variables or fallback to hardcoded URL
    const apiUrl = `https://api-consumet-org-six.vercel.app/anime/gogoanime/info/${animeId}`;
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch anime details');
      }
      const data = await response.json();
      setAnime(data);
    } catch (error) {
      console.error('Error fetching anime details:', error);
    } finally {
      setLoading(false);
    }
  }, [animeId]);

  useEffect(() => {
    fetchAnimeDetails();
  }, [fetchAnimeDetails]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredEpisodes = anime?.episodes.filter((episode) =>
    episode.number.toString().includes(searchTerm)
  ) || [];

  const renderAnimeDetails = () => {
    if (loading) return <div className={styles.loader}></div>;
    if (!anime) return <p>Error loading data...</p>;
    return (
      <div className={styles.animeDetails}>
        <h1 id="anime-title">{anime.title}</h1>
        <img src={anime.image} alt={anime.title} />
        <p>{anime.description}</p>
        <div>
          <input 
            type="text" 
            placeholder="Search episode..." 
            value={searchTerm} 
            onChange={handleSearch} 
          />
          <ul>
            {filteredEpisodes.map((episode) => (
            <li key={episode.id}>
            <Link href={`/video-player/${episode.id}`}>
              EP{episode.number}
            </Link>
          </li>
        ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <>
      <Header />
      <AnimeSearch setQuery={setSearchTerm} />
      <div className={styles.content}>
        {renderAnimeDetails()}
      </div>
    </>
  );
}
