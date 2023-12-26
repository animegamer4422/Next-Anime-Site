import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Header from '../../components/Header/Header';
import AnimeSearch from '../../components/AnimeSearch/AnimeSearch';
import Footer from '../../components/Footer/Footer';
import ArtplayerComponent from './ArtplayerComponent';
import useFetchAnimeDetails from '../../components/API/FetchAnimeDetails';
import '../../src/app/globals.css';
import styles from './Episode.module.css';

const artplayerStyles = {
  width: '600px',
  height: '400px',
  margin: '60px auto 0',
};

export default function VideoPlayer() {
  const router = useRouter();
  const { episodeId } = router.query;
  const { anime } = useFetchAnimeDetails(episodeId);
  const [mainUrl, setMainUrl] = useState("");
  const [editableEpisodeNumber, setEditableEpisodeNumber] = useState("");
  const [episodeNotFound, setEpisodeNotFound] = useState(false);

  console.log("Initial episodeId from router.query:", episodeId); // Debug log

  useEffect(() => {
    if (episodeId && typeof episodeId === 'string') {
      const episodeParts = episodeId.split('-');
      const episodeNumber = episodeParts.pop() || '';
      setEditableEpisodeNumber(episodeNumber);
      loadAnimeData(episodeId);
    }
  }, [episodeId, anime]);

  const loadAnimeData = async (id: string) => {
    const apiUrl = `https://api.amvstr.me/api/v2/stream/${id}`;
    console.log("Attempting to load data from:", apiUrl); // Debug log

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data && data.stream && data.stream.multi && data.stream.multi.main && data.stream.multi.main.url) {
        setMainUrl(data.stream.multi.main.url);
        setEpisodeNotFound(false);
      } else {
        console.error("Stream data is invalid:", data); // Debug log
        setEpisodeNotFound(true);
      }
    } catch (error) {
      console.error('Error fetching stream:', error);
      setEpisodeNotFound(true);
    }
  };
  

  const handleEpisodeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditableEpisodeNumber(event.target.value);
    setEpisodeNotFound(false);
  };

  const handleEpisodeInputConfirm = () => {
    const parsedEpisodeNumber = parseInt(editableEpisodeNumber);
    console.log("Parsed episode number:", parsedEpisodeNumber); // Debug log
  
    if (!isNaN(parsedEpisodeNumber)) {
      // Ensure episodeId is a string and extract the base ID
      const baseId = typeof episodeId === 'string' ? episodeId.split('-episode-')[0] : '';
      const newEpisodeId = `${baseId}-episode-${parsedEpisodeNumber}`;
      console.log("New episodeId generated:", newEpisodeId); // Debug log
  
      loadAnimeData(newEpisodeId);
    } else {
      console.log("Invalid episode number input:", editableEpisodeNumber); // Debug log
      setEpisodeNotFound(true);
    }
  };

    // New function to handle anime search
  const handleAnimeSearch = (query: string) => {
    // You can update state, fetch data, or redirect based on the query
    console.log("Anime Search Query:", query);
    // Implement logic to handle anime search
  };

  return (
    <>
      <Header/>
      <form id="search-form">
      <AnimeSearch setQuery={handleAnimeSearch} />
      </form>
      <main>
      <section>
  <div className={styles.container}> 
    <h2 className={styles.currentEp}> 
      Current Episode - 
      <input 
        type="text" 
        value={editableEpisodeNumber}
        className={styles.episodeSearchInput} // Apply the same styling class
        onChange={handleEpisodeInputChange}
        onBlur={handleEpisodeInputConfirm}
        onKeyDown={(e) => { if (e.key === 'Enter') handleEpisodeInputConfirm(); }}
      />
      {episodeNotFound && <span className={styles.errorMsg}>Episode not found</span>}
    </h2>
    <div className={styles.playerWrapper}>
      {mainUrl && <ArtplayerComponent mainUrl={mainUrl} style={artplayerStyles}/>}
    </div>
  </div>
</section>

      </main>
      <Footer />
    </>
  );
}
