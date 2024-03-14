import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const MovieDetailPage = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:4510/movies/${id}`);
                setMovie(response.data);
            } catch (error) {
                console.error('Error fetching movie details:', error);
                setError('Failed to fetch movie details');
            } finally {
                setLoading(false);
            }
        };
        fetchMovieDetails();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!movie) {
        return <div>No movie found.</div>;
    }

    return (
        <div className="bg-gray-900 min-h-screen text-white p-8">
            <h1 className="text-3xl font-bold mb-4">{movie.Name}</h1>
            <div className="mb-4">
                <p className="text-lg">Average Rating: {movie.averageRating} / 10</p>

            </div>
            <h2 className="text-xl mb-2">Reviews:</h2>
            <ul className="divide-y divide-gray-700">
                {movie.reviews.map(review => (
                    <li key={review.id} className="py-4">
                        <div className="flex justify-between border border-gray-700 p-4 rounded">
                            <div>
                                <p className="text-lg font-bold">Name: {review.reviewer_name}</p>
                                <p className="text-sm">Comments: {review.review_comments}</p>
                            </div>
                            <p className="text-lg font-bold">{review.rating}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MovieDetailPage;
