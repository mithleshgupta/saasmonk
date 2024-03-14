import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Addbtn from './Addbtn';
import Review from './Review';

function Homepage() {
    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResult, setSearchResult] = useState([]);

    useEffect(() => {
        fetchMovies();
    }, [movies]);

    const fetchMovies = async () => {
        try {
            const response = await axios.get('http://localhost:4510/movies');
            setMovies(response.data);
        } catch (error) {
            console.error('Error fetching movies:', error);
        }
    };

    const deleteMovie = async (id) => {
        try {
            await axios.delete(`http://localhost:4510/movies/${id}`);
            // After deleting the movie, refetch the updated list of movies
            fetchMovies();
        } catch (error) {
            console.error('Error deleting movie:', error);
        }
    };

    const handleSearch = () => {
        console.log("Search term:", searchTerm);
        console.log("Movies:", movies);
        const result = movies.filter(movie =>
            movie.reviews && movie.reviews.some(review =>
                review.review_comments.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        console.log("Search result:", result);
        setSearchResult(result);
    };


    return (
        <div className="Homepage bg-white min-h-screen text-gray-900">
            <div className="bg-gray-800 p-4 flex justify-between items-center">
                <h1 className="text-4xl uppercase font-bold">Moviecritic</h1>
                <div className="flex space-x-4">
                    <Addbtn />
                    <Review />
                </div>
            </div>
            <div className="p-6 flex items-center">
                <input
                    type="text"
                    placeholder="Search movies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:border-purple-500 bg-gray-100 text-gray-900 mr-2"
                />
                <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Search</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                {(searchResult.length > 0 ? searchResult : movies).map(movie => (
                    <div key={movie.id} className="movie-card bg-gray-100 border border-gray-200 shadow hover:bg-gray-200 p-4 rounded-lg">
                        <Link to={`/movies/${movie.id}`}>
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">{movie.Name}</h5>
                            <p className="font-normal text-gray-700">Release Date: {movie.ReleaseDate}</p>
                            <p className="font-normal text-gray-700">Average Rating: {movie.AverageRating}</p>
                        </Link>
                        <button onClick={() => deleteMovie(movie.id)} className="mt-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:bg-red-600">Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Homepage;
