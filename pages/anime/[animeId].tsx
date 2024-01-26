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
    return (
      <>
        <Header />
        <AnimeSearch setQuery={(query: string) => console.log("Anime Search Query:", query)} />
        <div className="loader"></div>
      </>
    );
  }
  

  if (error) {
    return (
      <div>
        <p>Error loading data: {error}</p>
        <button onClick={() => router.back()}>Go Back</button>
      </div>
    );
  }

  if (!anime) {
    return (
      <div>
        <p>Anime not found.</p>
        <button onClick={() => router.back()}>Go Back</button>
      </div>
    );
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
