import React from 'react';

const MovieCard = ({ movie: { title, vote_average, release_date, original_language }}) => {
    return (
        <div className="movie-card">
            <p className="text-white">{title}</p>
        </div>
    );
};

export default MovieCard;