// useFetchAnimeDetails.ts
import { useState, useEffect } from 'react';

// Interfaces for Anime details
interface Anime {
  id: string;
  title: string;
  image: string;
  description: string;
  episodes: Episode[];
}

interface Episode {
  number: number;
  id: string;
}

const FetchAnimeDetails = (animeId: string | string[] | undefined) => {
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      if (!animeId || typeof animeId !== 'string') return;

      setLoading(true);
      setError('');

      const apiUrl = `https://api-consumet-org-six.vercel.app/anime/gogoanime/info/${animeId}`;
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Failed to fetch');

        const data = await response.json() as Anime;
        setAnime(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeDetails();
  }, [animeId]);

  return { anime, loading, error };
};

export default FetchAnimeDetails;
