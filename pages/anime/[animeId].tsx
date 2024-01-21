// pages/anime/[animeId].tsx

import React from 'react';
import { useRouter } from 'next/router';
import AnimeSearch from '../../components/AnimeSearch/AnimeSearch';
import Header from '../../components/Header/Header';
import AnimeDetailsComponent from '../../components/AnimeDetails/AnimeDetailsComponent';
import AnimeEpisodesComponent from '../../components/AnimeEpisodes/AnimeEpisodes';
import FetchAnimeDetails from '../../components/API/FetchAnimeDetails';
import '../../src/app/globals.css'; // This includes the loader styles

export default function AnimeDetailsPage() {
  const router = useRouter();
  const { animeId } = router.query;
  const { anime, loading, error } = FetchAnimeDetails(animeId);

  if (loading) {
    return <div className="loader"></div>; // Use the global loader class
  }

  if (error) {
    return <div>Error loading data: {error}</div>;
  }

  if (!anime) {
    return <div>Anime not found.</div>;
  }

  return (
    <>
      <Header />
      <AnimeSearch setQuery={(query: string) => console.log("Anime Search Query:", query)} />

      <AnimeDetailsComponent 
        title={anime.title}
        image={anime.image}
        description={anime.description}
      />

      <AnimeEpisodesComponent episodes={anime.episodes} />
    </>
  );
}
