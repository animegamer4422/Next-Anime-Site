import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import Header from '../../components/Header/Header';
import AnimeSearch from '../../components/AnimeSearch/AnimeSearch';
import Footer from '../../components/Footer/Footer';
import ArtplayerComponent from './ArtplayerComponent';
import '../../src/app/globals.css';
import styles from './Episode.module.css';
import AnimeEpisodesComponent from '../../components/AnimeEpisodes/AnimeEpisodes';
import FetchAnimeDetails from '../../components/API/FetchAnimeDetails';

const artplayerStyles = {
  width: '600px',
  height: '400px',
  margin: '60px auto 0',
};

export default function VideoPlayer() {
  const router = useRouter();
  const { episodeId } = router.query;
  const [mainUrl, setMainUrl] = useState("");
  const [editableEpisodeNumber, setEditableEpisodeNumber] = useState("");
  const [episodeNotFound, setEpisodeNotFound] = useState(false);
  const { anime, loading, error } = FetchAnimeDetails(router.query.animeId);
  const playerRef = useRef(null); // Reference to the video player element
  
  useEffect(() => {
    const loadAnimeData = async (id: string) => {
      const apiUrl = `https://api.amvstr.me/api/v2/stream/${id}`;
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data && data.stream && data.stream.multi && data.stream.multi.main && data.stream.multi.main.url) {
          setMainUrl(data.stream.multi.main.url);
          setEpisodeNotFound(false);
        } else {
          setEpisodeNotFound(true);
        }
      } catch (error) {
        console.error('Error fetching stream:', error);
        setEpisodeNotFound(true);
      }
    };

    if (episodeId && typeof episodeId === 'string') {
      const episodeParts = episodeId.split('-');
      const episodeNumber = episodeParts.pop() || '';
      setEditableEpisodeNumber(episodeNumber);
      loadAnimeData(episodeId);
    }
  }, [episodeId]);

  const handleEpisodeInputChange = useCallback((event: { target: { value: React.SetStateAction<string>; }; }) => {
    setEditableEpisodeNumber(event.target.value);
    setEpisodeNotFound(false);
  }, []);

  const handleEpisodeInputConfirm = useCallback(() => {
    const parsedEpisodeNumber = parseInt(editableEpisodeNumber, 10);
    if (!isNaN(parsedEpisodeNumber)) {
      const baseId = typeof episodeId === 'string' ? episodeId.split('-episode-')[0] : '';
      const newEpisodeId = `${baseId}-episode-${parsedEpisodeNumber}`;
      router.push(`/video-player/${newEpisodeId}`);
    } else {
      setEpisodeNotFound(true);
    }
  }, [editableEpisodeNumber, episodeId, router]);

  const handleAnimeSearch = useCallback((query: any) => {
    console.log("Anime Search Query:", query);
  }, []);

  if (error) {
    return <div>Error loading data: {error}</div>;
  }

  return (
    <>
      <Header />
      <AnimeSearch setQuery={handleAnimeSearch} />
      <main>
        <section className={styles.container}>
          <h2 className={styles.currentEp}>Current Episode</h2>
          <input
            type="text"
            value={editableEpisodeNumber}
            className={styles.episodeSearchInput}
            onChange={handleEpisodeInputChange}
            onBlur={handleEpisodeInputConfirm}
            onKeyDown={(e) => { if (e.key === 'Enter') handleEpisodeInputConfirm(); }}
          />
          {episodeNotFound && <span className={styles.errorMsg}>Episode not found</span>}
          <div ref={playerRef} className={styles.playerWrapper}>
            {mainUrl && <ArtplayerComponent mainUrl={mainUrl} style={artplayerStyles} />}
          </div>
          {anime && <AnimeEpisodesComponent episodes={anime.episodes} />}
        </section>
      </main>
      <Footer />
    </>
  );
}
