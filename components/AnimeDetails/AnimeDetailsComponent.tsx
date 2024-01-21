// components/AnimeDetails/AnimeDetailsComponent.tsx

import React from 'react';
import styles from './AnimeDetailsComponent.module.css'; // Make sure the file name matches
import '../../src/app/globals.css'

// Define the props that AnimeDetailsComponent accepts
interface AnimeDetailsProps {
  title: string;
  image: string;
  description: string;
}

const AnimeDetailsComponent: React.FC<AnimeDetailsProps> = ({ title, image, description }) => {
  return (
    <div className={styles.animeContainer}>
      <div className={styles.animeDetails}>
        <h1 id={styles.animeTitle}>{title}</h1>
        <div id={styles.animeImage}>
          <img src={image} alt={title} />
        </div>
        <p className={styles.animeDesc}>{description}</p>
      </div>
    </div>
  );
};

export default AnimeDetailsComponent;
