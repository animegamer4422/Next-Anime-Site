import React from 'react';
import AnimeSearch from '../components/AnimeSearch/AnimeSearch';
import RecentEpisodes from '../components/RecentEpisode/RecentEpisodes';
import '../src/app/globals.css';
// import Link from 'next/link'; // Import the Link component
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer'; // import the Footer component
import styleSearch from "../components/AnimeSearch/AnimeSearch.module.css"

const Home = () => {
  return (
    <div className="container">
      <Header />

      <div className={styleSearch.searchSection}>
        <form id="search-form">
          <AnimeSearch />
        </form>
      </div>

      <div id="search-results">
        <RecentEpisodes />
      </div>

      <Footer />
    </div>
  );
};

export default Home;
