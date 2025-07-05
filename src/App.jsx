import { useEffect, useState } from 'react';
import Search from './components/Search';
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";

const API_BASE_URL = 'https://api.trakt.tv';
const API_KEY = import.meta.env.VITE_TRAKT_API_KEY;
const SECRET_KEY = import.meta.env.VITE_TRAKT_SECRET_KEY;
const API_OPTIONS = {
    method: 'GET',
    headers: {
        'Content-Type':'application/json',
        'trakt-api-key': API_KEY,
        'trakt-api-version': '2',
    },
    next: {
        revalidate: 60,
    },
}

const App = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState();
    const [movieList, setMovieList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchMovies = async () => {
        setIsLoading(false);
        setErrorMessage('');

        try {
            const endpoint = `${API_BASE_URL}/movies/popular?extended=images`;
            const response = await fetch(endpoint, API_OPTIONS);

            if(!response.ok) {
                throw new Error(`Failed to fetch movies: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            setMovieList(data || []);
            console.log(data);

        } catch (error) {
            console.log(`Error fetching movies: ${error}`);
            setErrorMessage('Error fetching movies. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchMovies();
    }, []);

    return (
        <div className="pattern">
            <div className="wrapper">
                <header>
                    <img src="./hero.png" alt="hero"/>
                    <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the hassle</h1>
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
                </header>
                <section className="all-movies">
                    <h2 className="mr-[40px]">All Movies</h2>

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