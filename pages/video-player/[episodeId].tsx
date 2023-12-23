import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Header from '../../components/Header/Header';
import AnimeSearch from '../../components/AnimeSearch/AnimeSearch';
import Footer from '../../components/Footer/Footer';
import ArtplayerComponent from './ArtplayerComponent'; // Import the ArtplayerComponent
import '../../src/app/globals.css';
import styles from './Episode.module.css';

interface Anime {
  title: string;
  episode: string;
}

const artplayerStyles = {
  width: '600px',
  height: '400px',
  margin: '60px auto 0',
};

export default function VideoPlayer() {
  const router = useRouter();
  const { episodeId } = router.query;
  const [anime, setAnime] = useState<Anime | null>(null);
  const [mainUrl, setMainUrl] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const loadAnimeData = async (id: string) => {
    try {
      const apiUrl = `https://api.amvstr.me/api/v2/stream/${id}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      const mainUrl = data.stream.multi.main.url;
      const episodeParts = id.split('-');
      const episodeNumber = episodeParts.pop() || 'Unknown';
      const animeTitle = episodeParts.join(' ');
      setMainUrl(mainUrl);
      setAnime({ title: animeTitle, episode: episodeNumber });
    } catch (error) {
      console.error('Error fetching stream:', error);
    }
  };

  useEffect(() => {
    if (episodeId && typeof episodeId === 'string') {
      loadAnimeData(episodeId);
    }
  }, [episodeId]);

  const updateSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return (
    <>
      <Header />
      <div>
        <div className="search-section">
          <AnimeSearch setQuery={updateSearchQuery} />
        </div>
        <main>
          <section>
            <div className={styles.container}> 
              <h2 className={styles.currentEp}> 
                Current Episode - {anime?.episode}
              </h2>
              <div className={styles.playerWrapper}>
                {mainUrl && <ArtplayerComponent mainUrl={mainUrl} style={artplayerStyles}/>}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
