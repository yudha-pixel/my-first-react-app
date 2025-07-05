import React from 'react';

const MovieCard = ({ movie: { title, rating, images: { poster }, language, released }}) => {
    return (
        <div className="movie-card">
            <img 
                src={poster && poster !== '' ?
                    `https://${poster}` : 
                    '/no-movie.png'} 
                alt={title}
                onError={(e) => {
                    e.target.onerror = null; // Prevent infinite loop if fallback image fails
                    e.target.src = '/no-movie.png';
                }}
            />
            <div className="mt-4">
                <h3>{title}</h3>

                <div className="content">
                    <div className="rating">
                        <img src="/star.svg" alt="star" />
                        <p>{rating ? rating.toFixed(1) : 'N/A'}</p>
                    </div>

                    <span>•</span>
                    <p className="lang">{language}</p>
                    <span>•</span>
                    <p className="year">
                        {released ? released.slice(0, 4) : 'N/A'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;