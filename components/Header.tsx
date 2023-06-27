import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="header-wrapper logo">
      <Link href='/' passHref>
        <h1 className="logo">Anime Site</h1> {/* Replace with your actual logo */}
      </Link>
    </header>
  );
};

export default Header;
