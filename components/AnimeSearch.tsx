import React, { useState } from 'react';
import Link from 'next/link';

interface Anime {
  id: string;
  image: string;
  title: string;
}

const AnimeSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [animeList, setAnimeList] = useState<Anime[]>([]);

  const searchAnime = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setQuery(e.target.value);

    if(e.target.value !== '') {
      try {
        let response = await fetch(`https://animetrix-api.vercel.app/anime/gogoanime/${e.target.value}`);
        if (!response.ok) throw new Error('Error with first API');
        const data = await response.json();
        setAnimeList(data.results);
      } catch (error) {
        console.log('First API failed, trying with fallback API');
        try {
          const responseFallback = await fetch(`https://api.consumet.org/anime/gogoanime/${e.target.value}`);
          if (!responseFallback.ok) throw new Error('Error with fallback API');
          const dataFallback = await responseFallback.json();
          setAnimeList(dataFallback.results);
        } catch (fallbackError) {
          console.error('Fallback API also failed', fallbackError);
          setAnimeList([]);
        }
      }
    } else {
      setAnimeList([]);
    }
  }

  return (
    <div className="container">
      <div id="search-form">
        <input
          type='text'
          placeholder='Search anime...'
          value={query}
          onChange={searchAnime}
          className="input[type='search']"
        />
      </div>
      <div className="grid">
      {animeList && animeList.map(anime => (
  <Link key={anime.id} href={`/anime/${anime.id}`} className="search-result-image">
    <div className="image-container">
      <img src={anime.image} alt={anime.title} className="search-image" />
    </div>
    <h2 className="search-result-name">{anime.title}</h2>
  </Link>
))}

      </div>
    </div>
  );
};

export default AnimeSearch;
