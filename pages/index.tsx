import React, { useState } from 'react';
import AnimeSearch from '../components/AnimeSearch/AnimeSearch';
import RecentEpisodes from '../components/RecentEpisode/RecentEpisodes';
import '../src/app/globals.css';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import styleSearch from "../components/AnimeSearch/AnimeSearch.module.css";

const Home = () => {
  const [query, setQuery] = useState('');
  const isSearchActive = !!query;

  return (
    <div className="container">
      <Header />

      <div className={styleSearch.searchSection}>
        <AnimeSearch setQuery={setQuery} />
      </div>

      {!isSearchActive && (
        <div id="search-results">
          <RecentEpisodes />
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Home;
