import { useEffect, useState } from 'react';
import { useDebounce } from 'react-use';
import Search from './components/Search';
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
import {getTrendingMovies, updateSearchCount} from "./lib/appwrite.js";

const API_KEY = import.meta.env.VITE_TRAKT_API_KEY;
const SECRET_KEY = import.meta.env.VITE_TRAKT_SECRET_KEY;
const API_OPTIONS = {
    method: 'GET',
    headers: {
        'Content-Type':'application/json',
        'trakt-api-key': API_KEY,
        'trakt-api-version': '2',
        'X-Sort-By': 'popularity',
    },
    next: {
        revalidate: 60,
    },
}

const App = () => {
    const [movieList, setMovieList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const [trendingMovies, setTrendingMovies] = useState([]);
    const [isLoadingTrending, setIsLoadingTrending] = useState(false);
    const [errorTrending, setErrorTrending] = useState('');

    useDebounce(() => setDebouncedSearchTerm(searchTerm), 1000, [searchTerm]);

    const fetchMovies = async (query='') => {
        setIsLoading(false);
        setErrorMessage('');

        try {
            const endpoint = query ?
                `/api/search/movie?query=${encodeURIComponent(query)}&extended=full,images` :
                `/api/movies/popular?extended=full,images`;
            const response = await fetch(endpoint, API_OPTIONS);

            if(!response.ok) {
                throw new Error(`Failed to fetch movies: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            setMovieList(query ? data.map((movies) => movies.movie) : data || []);

            if(query && data.length > 0) {
                await updateSearchCount(query, data.map((movies) => movies.movie)[0]);
            }

        } catch (error) {
            console.log(`Error fetching movies: ${error}`);
            setErrorMessage('Error fetching movies. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    }

    const loadTrendingMovies = async () => {
        setIsLoadingTrending(true);
        try {
            const movies = await getTrendingMovies();
            setTrendingMovies(movies);
        } catch (error) {
            console.log(`Error fetching trending movies: ${error}`);
            setErrorTrending('Error fetching trending movies. Please try again later.');
        } finally {
            setIsLoadingTrending(false);
        }
    }

    useEffect(() => {
        fetchMovies(debouncedSearchTerm);
    }, [debouncedSearchTerm]);

    useEffect(() => {
        loadTrendingMovies();
    }, [])

    return (
        <div className="pattern">
            <div className="wrapper gap-10">
                <header>
                    <img src="./hero.png" alt="hero"/>
                    <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the hassle</h1>
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
                </header>

                {trendingMovies.length > 0 && (
                    <div>
                        {isLoadingTrending ? (
                            <Spinner />
                        ) : errorTrending ? (
                            <p className="text-red-500">{errorTrending}</p>
                        ): (
                            <section className="trending">
                                <h2>Trending</h2>
                                <ul>
                                    {trendingMovies.map((movie, index) => (
                                        <li key={movie.$id}>
                                            <p>{index + 1}</p>
                                            <img src={movie.poster_url} alt={movie.title}/>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}
                    </div>
                )}

                <section className="all-movies">
                    {searchTerm ? (
                            <h2 className="mr-[40px]">
                                Search results for: <span className="text-gradient">{searchTerm}</span>
                            </h2>
                        ) : (
                            <h2 className="mr-[40px]">Popular</h2>
                        )
                    }

                    {isLoading ? (
                        <Spinner />
                    ) : errorMessage ? (
                        <p className="text-red-500">{errorMessage}</p>
                    ) : (
                        <ul>
                            {movieList.map((movie) => (
                                <MovieCard key={movie.ids.trakt} movie={movie}/>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </div>
    );
};

export default App;