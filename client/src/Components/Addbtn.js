import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Addbtn.css';

const Addbtn = () => {
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [movies, setMovies] = useState([]);
    const [clicked, setClicked] = useState(false);
    useEffect(() => {
        fetchMovies();
    }, []);

    const toggleForm = () => {
        setShowForm(!showForm);
        setClicked(!clicked);
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleReleaseDateChange = (e) => {
        setReleaseDate(e.target.value);
    };

    const fetchMovies = async () => {
        try {
            const response = await axios.get('http://localhost:4510/movies');
            setMovies(response.data);
            console.log("this is the data of movies ", response.data);
        } catch (error) {
            console.error('Error fetching movies:', error);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4510/movies', {
                name: name,
                releaseDate: releaseDate
            });
            console.log('Movie added:', response.data);


            fetchMovies();

            setName('');
            setReleaseDate('');
            setShowForm(false);
        } catch (error) {
            console.error('Error adding movie:', error);
        }
    };






    return (
        <div>
            <button
                onClick={toggleForm}
                type="button"
                className={`focus:outline-none text-sm px-5 py-2.5 mb-2 font-medium ${clicked ? 'text-purple-700 bg-white' : 'text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300'}`}
                style={{ backgroundColor: clicked ? 'rgba(101,88,245)' : 'rgba(101,88,245, 0.8)' }}
            >
                Add New Movie
            </button>
            {showForm && (
                <div id="crud-modal" tabIndex="-1" aria-hidden="true" className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
                    <div className="relative p-4 w-full max-w-md max-h-full">
                        <div className="relative bg-white shadow">
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Add a Movie
                                </h3>
                                <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" onClick={toggleForm}>
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            <form className="p-4 md:p-5" onSubmit={handleSubmit}>
                                <div className="grid gap-4 mb-4">
                                    <div>
                                        <label htmlFor="name" className="block mb-2 text-sm font-medium  text-gray-900"></label>
                                        <input type="text" id="name" value={name} onChange={handleNameChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500" placeholder="Enter movie name" required />
                                    </div>
                                    <div>
                                        <label htmlFor="releaseDate" className="block mb-2 text-sm font-medium text-gray-900"></label>
                                        <input type="date" id="releaseDate" value={releaseDate} onChange={handleReleaseDateChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500" required />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button type="submit" className="text-purple-700 bg-white hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                        Add new movie
                                    </button>
                                </div>


                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Addbtn;
