import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import style from './AnimeSearch.module.css';

interface Anime {
  id: string;
  image: string;
  title: string;
}

interface AnimeSearchProps {
  setQuery: (query: string) => void;
}

const AnimeSearch: React.FC<AnimeSearchProps> = ({ setQuery: setParentQuery }) => {
  const [localQuery, setLocalQuery] = useState('');
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [isDub, setIsDub] = useState(false);

  useEffect(() => {
    if (localQuery) {
      performSearch();
    } else {
      // If the search field is empty, fetch and display recent anime or new releases
      fetchRecentAnime();
    }
  }, [localQuery, isDub]);

  const performSearch = async () => {
    try {
      let response = await fetch(`https://api-consumet-org-six.vercel.app/anime/gogoanime/${localQuery}`);
      if (!response.ok) throw new Error('Error with first API');
      const data = await response.json();
      setAnimeList(filterResults(data.results));
    } catch (error) {
      console.error('Error with primary API:', error);
      // Handle fallback API logic here if necessary
    }
  };

  const fetchRecentAnime = async () => {
    try {
      // Fetch and display recent anime or new releases when the search field is empty
      let response = await fetch('https://api-consumet-org-six.vercel.app/anime/recent');
      if (!response.ok) throw new Error('Error fetching recent anime');
      const data = await response.json();
      setAnimeList(data.results);
    } catch (error) {
      console.error('Error fetching recent anime:', error);
      setAnimeList([]);
    }
  };

  const filterResults = (results: Anime[]) => {
    return isDub
      ? results.filter(anime => anime.title.toLowerCase().includes('(dub)'))
      : results.filter(anime => !anime.title.toLowerCase().includes('(dub)'));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setLocalQuery(newQuery);
    setParentQuery(newQuery);
  };

  const handleToggleChange = () => {
    setIsDub(!isDub);
  };

  return (
    <div className={style.container}>
      <div className={style.searchForm}>
        <input
          type="text"
          placeholder="Search anime..."
          value={localQuery}
          onChange={handleSearchChange}
          className={style.searchInput}
        />
        <div className={style.toggleSwitchContainer}>
          <label className={style.switch}>
            <input
              type="checkbox"
              checked={isDub}
              onChange={handleToggleChange}
            />
            <span className={`${style.slider} ${style.round}`}></span>
          </label>
          <span className={style.toggleLabel}>
            {isDub ? 'Dub' : 'Sub'}
          </span>
        </div>
      </div>
      <div className={style.grid}>
        {animeList.map(anime => (
  <Link key={anime.id} href={`/anime/${anime.id}`} passHref>
    <div className={style.searchResultImage}>
      <div className={style.imageContainer}>
        <img src={anime.image} alt={anime.title} className={style.searchImage} />
      </div>
      <h2 className={style.searchResultName}>{anime.title}</h2>
    </div>
  </Link>
))}
      </div>
    </div>
  );
};

export default AnimeSearch;
