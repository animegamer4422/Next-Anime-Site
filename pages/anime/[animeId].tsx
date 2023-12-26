import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AnimeSearch from '../../components/AnimeSearch/AnimeSearch';
import Header from '../../components/Header/Header';
import styles from './AnimeDetails.module.css';
import FetchAnimeDetails from '../../components/API/FetchAnimeDetails';

export default function AnimeDetails() {
  const router = useRouter();
  const { animeId } = router.query;
  const { anime, loading, error } = FetchAnimeDetails(animeId);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAnimeSearch = (query: string) => {
    console.log("Anime Search Query:", query);
  };

  const handleEpisodeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredEpisodes = anime ? anime.episodes.filter((episode) =>
    episode.number.toString().includes(searchTerm)
  ) : [];

  return (
    <>
      <Header/>
      <form id="search-form">
      <AnimeSearch setQuery={handleAnimeSearch} />
      </form>

      <div className={styles.content}>
        {loading ? (
          <div className={styles.loader}></div>
        ) : error ? (
          <p>Error loading data: {error}</p>
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
            <input 
              type="text" 
              placeholder="Search episode..." 
              value={searchTerm} 
              onChange={handleEpisodeSearch} 
              className={styles.episodeSearchInput}
            />
          </div>

              <ul id="anime-episodes" className={styles.episodeGrid}>
                {filteredEpisodes.map((episode) => (
                  <li key={episode.id}>
                    <Link href={`/video-player/${episode.id}`}>
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
          <p>Anime not found.</p>
        )}
      </div>
    </>
  );
}
