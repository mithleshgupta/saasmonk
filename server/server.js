const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 4510;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root123',
    database: 'saasmonk'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');

    const createMoviesTableQuery = `
        CREATE TABLE IF NOT EXISTS movies (
            id INT AUTO_INCREMENT PRIMARY KEY,
            Name VARCHAR(255) NOT NULL,
            ReleaseDate DATE NOT NULL,
            AverageRating DECIMAL(3, 1),
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    db.query(createMoviesTableQuery, (err, result) => {
        if (err) {
            console.error('Error creating movies table:', err);
        } else {
            console.log('Movies table created successfully');
        }
    });

    const createReviewsTableQuery = `
        CREATE TABLE IF NOT EXISTS reviews (
            id INT AUTO_INCREMENT PRIMARY KEY,
            movie_id INT NOT NULL,
            reviewer_name VARCHAR(255),
            rating DECIMAL(3, 1),
            review_comments TEXT,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
        )
    `;

    db.query(createReviewsTableQuery, (err, result) => {
        if (err) {
            console.error('Error creating reviews table:', err);
        } else {
            console.log('Reviews table created successfully');
        }
    });
});

app.post('/movies', (req, res) => {
    const { name, releaseDate } = req.body;
    const sql = 'INSERT INTO movies (Name, ReleaseDate) VALUES (?, ?)';
    db.query(sql, [name, releaseDate], (err, result) => {
        if (err) {
            console.error('Error inserting movie:', err);
            return res.status(500).send('Error inserting movie');
        }
        console.log('Movie inserted:', result);
        res.status(200).send('Movie inserted successfully');
    });
});

app.post('/reviews', (req, res) => {
    const { movieId, reviewerName, rating, reviewComments } = req.body;
    const sql = 'INSERT INTO reviews (movie_id, reviewer_name, rating, review_comments) VALUES (?, ?, ?, ?)';
    db.query(sql, [movieId, reviewerName, rating, reviewComments], async (err, result) => {
        if (err) {
            console.error('Error inserting review:', err);
            return res.status(500).send('Error inserting review');
        }
        console.log('Review inserted:', result);


        const avgRatingQuery = 'SELECT AVG(rating) AS avg_rating FROM reviews WHERE movie_id = ?';
        db.query(avgRatingQuery, [movieId], async (avgErr, avgResult) => {
            if (avgErr) {
                console.error('Error calculating average rating:', avgErr);
                return res.status(500).send('Error calculating average rating');
            }

            const newAvgRating = avgResult[0].avg_rating;


            const updateAvgRatingQuery = 'UPDATE movies SET AverageRating = ? WHERE id = ?';
            db.query(updateAvgRatingQuery, [newAvgRating, movieId], async (updateErr, updateResult) => {
                if (updateErr) {
                    console.error('Error updating average rating:', updateErr);
                    return res.status(500).send('Error updating average rating');
                }
                console.log('Average rating updated for movie:', movieId);
                res.status(200).send('Review inserted successfully');
            });
        });
    });
});

app.get('/movies', (req, res) => {
    const sql = 'SELECT * FROM movies';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching movies:', err);
            return res.status(500).send('Error fetching movies');
        }
        res.json(result);
        console.log('List of movies:', result);
    });
});


app.delete('/movies/:id', (req, res) => {
    const movieId = req.params.id;
    const deleteMovieQuery = 'DELETE FROM movies WHERE id = ?';
    const deleteReviewsQuery = 'DELETE FROM reviews WHERE movie_id = ?';
    db.query(deleteReviewsQuery, [movieId], (err, result) => {
        if (err) {
            console.error('Error deleting reviews:', err);
            return res.status(500).send('Error deleting reviews');
        }
        db.query(deleteMovieQuery, [movieId], (err, result) => {
            if (err) {
                console.error('Error deleting movie:', err);
                return res.status(500).send('Error deleting movie');
            }
            console.log('Movie and associated reviews deleted');
            res.status(200).send('Movie and associated reviews deleted');
        });
    });
});


app.get('/reviews/search', (req, res) => {
    const searchTerm = req.query.search;
    const searchQuery = 'SELECT * FROM reviews WHERE review_comments LIKE ?';
    const searchParam = `%${searchTerm}%`;
    db.query(searchQuery, [searchParam], (err, result) => {
        if (err) {
            console.error('Error searching review comments:', err);
            return res.status(500).send('Error searching review comments');
        }
        console.log('Search results:', result);
        res.status(200).send(result);
    });
});


app.get('/movies/:id', (req, res) => {
    const movieId = req.params.id;
    const movieQuery = 'SELECT * FROM movies WHERE id = ?';
    db.query(movieQuery, [movieId], async (err, movieResult) => {
        if (err) {
            console.error('Error fetching movie:', err);
            return res.status(500).send('Error fetching movie');
        }
        if (movieResult.length === 0) {
            return res.status(404).send('Movie not found');
        }
        const movie = movieResult[0];


        const avgRatingQuery = 'SELECT AVG(rating) AS avg_rating FROM reviews WHERE movie_id = ?';
        db.query(avgRatingQuery, [movieId], async (avgErr, avgResult) => {
            if (avgErr) {
                console.error('Error calculating average rating:', avgErr);
                return res.status(500).send('Error calculating average rating');
            }
            const averageRating = avgResult[0].avg_rating || 0;


            const reviewsQuery = 'SELECT * FROM reviews WHERE movie_id = ?';
            db.query(reviewsQuery, [movieId], (reviewsErr, reviewsResult) => {
                if (reviewsErr) {
                    console.error('Error fetching reviews:', reviewsErr);
                    return res.status(500).send('Error fetching reviews');
                }
                const movieDetails = {
                    id: movie.id,
                    name: movie.Name,
                    releaseDate: movie.ReleaseDate,
                    averageRating: parseFloat(averageRating).toFixed(1),
                    reviews: reviewsResult
                };
                res.status(200).json(movieDetails);
            });
        });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
