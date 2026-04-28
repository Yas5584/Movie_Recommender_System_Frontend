// // import { useState } from "react";
// // import axios from "axios";
// // import "./App.css";

// // function App() {
// //   const [movie, setMovie] = useState("");
// //   const [recommendations, setRecommendations] = useState([]);
// //   const [error, setError] = useState("");

// //   const getRecommendations = async () => {
// //     if (!movie) return;

// //     try {
// //       const response = await axios.get(
// //         `http://127.0.0.1:8000/api/recommend/?movie=${movie}`
// //       );



// //       setRecommendations(response.data.recommendations);
// //       setError("");
// //     } catch (err) {
// //       setError("Movie not found or server error");
// //       setRecommendations([]);
// //     }

// //     const posterResponse = await axios.get(
// //       `http://127.0.0.1:8000/api/poster/?movie=${movie}`
// //     );
// //     console.log(posterResponse.data.poster_url);

// //   };

// //   return (
// //     <div className="container">
// //       <h1>🎬 Movie Recommender</h1>

// //       <div className="search-box">
// //         <input
// //           type="text"
// //           placeholder="Enter movie name (e.g. Avatar)"
// //           value={movie}
// //           onChange={(e) => setMovie(e.target.value)}
// //         />
// //         <button onClick={getRecommendations}>Recommend</button>
// //       </div>

// //       {error && <p className="error">{error}</p>}

// //       <div className="results">
// //         {recommendations.map((rec, index) => (
// //           <div key={index} className="card">
// //             {rec}
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }

// // export default App;

// import { useState, useEffect } from "react";
// import axios from "axios";
// import "./App.css";

// function App() {
//   const [movie, setMovie] = useState("");
//   const [movies, setMovies] = useState([]);
//   const [error, setError] = useState("");

//   // 🔥 Load initial movies (homepage)
//   useEffect(() => {
//     fetchInitialMovies();
//   }, []);

//   const fetchInitialMovies = async () => {
//     const sampleMovies = ["Avatar", "Batman", "Inception", "Titanic", "Avengers"];

//     const results = await Promise.all(
//       sampleMovies.map(async (m) => {
//         const res = await axios.get(
//           `http://127.0.0.1:8000/api/poster/?movie=${m}`
//         );

//         return {
//           title: m,
//           poster: res.data.Poster,
//         };
//       })
//     );

//     setMovies(results);
//   };

//   // 🔍 Search + Recommendations
//   const getRecommendations = async () => {
//     try {
//       const res = await axios.get(
//         `http://127.0.0.1:8000/api/recommend/?movie=${movie}`
//       );

//       const allMovies = [...res.data.recommendations];

//       const results = await Promise.all(
//         allMovies.map(async (m) => {
//           const posterRes = await axios.get(
//             `http://127.0.0.1:8000/api/poster/?movie=${m}`
//           );
//           console.log(posterRes);
//           return {
//             title: m,
//             // poster: posterRes.data.poster_url,
//             poster: data.Poster,
//             rating: data.imdbRating,
//             year: data.Year,
//             plot: data.Plot,
//           };
//         })
//       );

//       setMovies(results);
//       setError("");
//     } catch {
//       setError("Movie not found");
//     }
//   };

//   return (
//     <div className="container">
//       <h1>🎬 Movie Recommender</h1>

//       <div className="search-box">
//         <input
//           type="text"
//           placeholder="Search movie..."
//           value={movie}
//           onChange={(e) => setMovie(e.target.value)}
//         />
//         <button onClick={getRecommendations}>Search</button>
//       </div>

//       {error && <p className="error">{error}</p>}

//       <div className="grid">
//         {movies.map((m, index) => (
//           <div key={index} className="card">
//             <img src={m.poster} alt={m.title} />
//             <p>{m.title}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default App;

import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [movie, setMovie] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const CACHE_KEY = "movie_cache_v1";

  const sampleMovies = ['Avatar', "Pirates of the Caribbean: At World's End", 'Spectre',
       'The Dark Knight Rises', 'John Carter', 'Spider-Man 3', 'Tangled',
       'Avengers: Age of Ultron',
       'Harry Potter and the Half-Blood Prince',
       'Batman v Superman: Dawn of Justice', 'Superman Returns',
       'Quantum of Solace', "Pirates of the Caribbean: Dead Man's Chest",
       'The Lone Ranger', 'Man of Steel',
       'The Chronicles of Narnia: Prince Caspian', 'The Avengers',
       'Pirates of the Caribbean: On Stranger Tides',
       'The Hobbit: The Battle of the Five Armies',
       'The Amazing Spider-Man', 'Robin Hood',
       'The Hobbit: The Desolation of Smaug', 'The Golden Compass',
       'King Kong', 'Titanic', 'Captain America: Civil War', 'Battleship',
       'Jurassic World', 'Skyfall', 'Spider-Man 2', 'Iron Man 3',
       'Alice in Wonderland', 'X-Men: The Last Stand',
       'Monsters University', 'Transformers: Revenge of the Fallen',
       'Transformers: Age of Extinction', 'Oz: The Great and Powerful',
       'The Amazing Spider-Man 2', 'TRON: Legacy', 'Cars 2',
       'Green Lantern', 'Toy Story 3', 'Terminator Salvation',
       'Furious 7', 'World War Z', 'X-Men: Days of Future Past',
       'Star Trek Into Darkness', 'Jack the Giant Slayer',
       'The Great Gatsby', 'Prince of Persia: The Sands of Time',
       'Pacific Rim', 'Transformers: Dark of the Moon',
       'Indiana Jones and the Kingdom of the Crystal Skull',
       'The Good Dinosaur', 'Brave', 'Star Trek Beyond', 'WALL·E',
       'Rush Hour 3', '2012', 'A Christmas Carol', 'Jupiter Ascending',
       'The Legend of Tarzan',
       'The Chronicles of Narnia: The Lion, the Witch and the Wardrobe',
       'X-Men: Apocalypse', 'The Dark Knight', 'Up', 'Monsters vs Aliens',
       'Iron Man', 'Hugo']
  // 🔥 SAFE FETCH
  const fetchMovies = async (movieList, useCache = false) => {
    try {
      setLoading(true);

      if (useCache) {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          console.log("⚡ Loaded from cache");
          setMovies(JSON.parse(cached));
          setLoading(false);
          return;
        }
      }

      const results = [];

      for (let m of movieList) {
        try {
          const res = await axios.get(
            `https://movie-recommender-system-4-f2ie.onrender.com/api/poster/?movie=${encodeURIComponent(m)}`
          );

          const data = res.data;

          results.push({
            title: data.Title || m,
            poster:
              data.Poster && data.Poster !== "N/A"
                ? data.Poster
                : "https://via.placeholder.com/300x450?text=No+Image",
            rating: data.imdbRating || "N/A",
            year: data.Year || "N/A",
            plot: data.Plot || "No description available",
          });

        } catch (err) {
          console.log("❌ Failed:", m);

          results.push({
            title: m,
            poster: "https://via.placeholder.com/300x450?text=No+Image",
            rating: "N/A",
            year: "N/A",
            plot: "No data available",
          });
        }
      }

      setMovies(results);

      if (useCache) {
        localStorage.setItem(CACHE_KEY, JSON.stringify(results));
      }

      setLoading(false);

    } catch (err) {
      console.error(err);
      setError("Failed to load movies");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(sampleMovies, true);
  }, []);

  const getRecommendations = async () => {
    if (!movie) return;

    try {
      setLoading(true);

      const res = await axios.get(
        `https://movie-recommender-system-4-f2ie.onrender.com/api/recommend/?movie=${encodeURIComponent(movie)}`
      );

      const allMovies = [movie, ...res.data.recommendations];

      await fetchMovies(allMovies, false);
      setError("");

    } catch {
      setError("Movie not found");
      setLoading(false);
    }
  };

  // return (
  //   <div className="container">
  //     <h1>🎬 Movie Recommender</h1>

  //     <div className="search-box">
  //       <input
  //         type="text"
  //         placeholder="Search movie..."
  //         value={movie}
  //         onChange={(e) => setMovie(e.target.value)}
  //       />
  //       <button onClick={getRecommendations}>Search</button>
  //     </div>

  //     {loading && <p className="loading">Loading movies...</p>}
  //     {error && <p className="error">{error}</p>}

  //     {!loading && movies.length === 0 && (
  //       <p className="error">No movies found</p>
  //     )}

  //     <div className="grid">
  //       {movies.map((m, index) => (
  //         <div key={index} className="card">
  //           <img src={m.poster} alt={m.title} />
  //           <h3>{m.title}</h3>
  //           <p>⭐ {m.rating} | {m.year}</p>
  //           <p className="plot">
  //             {m.plot ? m.plot.slice(0, 80) + "..." : "No description"}
  //           </p>
  //         </div>
  //       ))}
  //     </div>
  //   </div>
  // );

  return (
  <div className="app">
    {/* 🔥 Header */}
    <div className="header">
      <h1>🎬 Movie Recommender</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search movies..."
          value={movie}
          onChange={(e) => setMovie(e.target.value)}
        />
        <button onClick={getRecommendations}>Search</button>
      </div>
    </div>

    {/* 🔥 Content */}
    <div className="content">
      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}

      <div className="grid">
        {movies.map((m, index) => (
          <div key={index} className="card">
            <div className="image-wrapper">
              <img src={m.poster} alt={m.title} />

              <div className="overlay">
                <p>{m.plot.slice(0, 100)}...</p>
              </div>
            </div>

            <div className="card-info">
              <h3>{m.title}</h3>
              <div className="meta">
                ⭐ {m.rating} | {m.year}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
}

export default App;
