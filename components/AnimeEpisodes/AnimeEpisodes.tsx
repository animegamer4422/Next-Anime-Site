// components/AnimeEpisodes/AnimeEpisodesComponent.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import styles from './AnimeEpisodes.module.css';
import '../../src/app/globals.css'

// Import the Episode interface from FetchAnimeDetails
import { Episode } from '../../components/API/FetchAnimeDetails';

interface AnimeEpisodesProps {
  episodes: Episode[];
}

const AnimeEpisodesComponent = ({ episodes }: AnimeEpisodesProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleEpisodeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredEpisodes = episodes.filter((episode) =>
    episode.number.toString().includes(searchTerm)
  );

  return (
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
    <li key={episode.id} className={styles.episodeListItem}>
      <Link className={styles.episodeBtn} href={`/video-player/${episode.id}`}>
        EP {episode.number}
      </Link>
    </li>
  ))}
</ul>
    </div>
  );
};

export default AnimeEpisodesComponent;
