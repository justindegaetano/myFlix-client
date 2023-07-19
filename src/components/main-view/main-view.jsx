import { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { ProfileView } from "../profile-view/profile-view";
import { NavigationBar } from "../navigation-bar/navigation-bar";
import { Row, Col } from "react-bootstrap";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./main-view.scss";

export const MainView = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");
  const [user, setUser] = useState(storedUser? storedUser : null);
  const [token, setToken] = useState(storedToken? storedToken : null);
  const [movies, setMovies] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filterCriteria, setFilterCriteria] = useState("title");
  
  // Return early if no token is present.
  useEffect(() => {
    if (!token) return;

    // API fetch for all movie data
    fetch("https://myflix-webapi.onrender.com/movies", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // Remapped movie data into simpler format
        const moviesFromApi = data.map((movie) => {
          return {
            id: movie._id,
            title: movie.Title,
            director: movie.Director.Name,
            image: movie.ImagePath,
            genre: movie.Genre.Name,
            description: movie.Description
          };
        });
        setMovies(moviesFromApi);
      });
  }, [token]);

    // Handle search field changes
  const handleSearchInput = (e) => {
    setSearchInput(e.target.value);
  };

  // Handle filter field changes
  const handleFilterSelection = (e) => {
    setFilterCriteria(e.target.value);
  };

  // Filter movies based on title, genre, or director
  const filteredMovies = movies.filter((movie) => {
    if (filterCriteria === "title") {
      return movie.title.toLowerCase().includes(searchInput.toLowerCase());
    }
    if (filterCriteria === "genre") {
      return movie.genre.toLowerCase().includes(searchInput.toLowerCase());
    }
    if (filterCriteria === "director") {
      return movie.director.toLowerCase().includes(searchInput.toLowerCase());
    }
  });

  return (
    <BrowserRouter>
      <NavigationBar
        user={user}
        onLoggedOut={() => {
          setUser(null);
          setToken(null);
          localStorage.clear();
          setSearchInput("");
          setFilterCriteria("title");
        }}
        handleSearchInput={(e) => setSearchInput(e.target.value)}
        handleFilterSelection={(e) => setFilterCriteria(e.target.value)}
       />
      <Row className="justify-content-md-center">
        <Routes>
          <Route
            path="/signup"
            element={
              <>
                {user ? (
                  <Navigate to="/" />
                ) : (
                  <Col md={5}>
                    <SignupView />
                  </Col>
                )}
              </>

            }
          />
          <Route
            path="/login"
            element={
              <>
                {user ? (
                  <Navigate to="/" />
                ) : (
                  <Col md={5}>
                    <LoginView 
                      onLoggedIn={(user, token) => {
                        setUser(user);
                        setToken(token);
                      }} 
                    />
                  </Col>
                )}
              </>

            }
          />
          <Route
            path="/movies/:movieId"
            element={
              <>
                {!user ? (
                  <Navigate to="/login" replace />
                ) : movies.length === 0 ? (
                  <Col>The list is empty!</Col>
                ) : (
                  <Col md={8}>
                    <MovieView movies={movies} />
                  </Col>
                )}
              </>
            }
          />
          <Route
            path="/"
            element={
              <>
                {!user ? (
                  <Navigate to="/login" replace />
                ) : movies.length === 0 ? (
                  <Col>The list is empty!</Col>
                ) : (
                  <>
                    {filteredMovies.map((movie) => (
                      <Col className="mb-4" key={movie.id} md={3}>
                        <MovieCard movie={movie} />
                      </Col>
                    ))}
                  </>
                )}
              </>
            }
          />
          <Route
          path="/profile"
          element={
            <>
              {!user ? (
                <Navigate to="/login" replace />
              ) : user.length === 0 ? (
                <Col>No such user found!</Col>
              ) : (
                <Col>
                  <ProfileView user={user} movies={movies} />
                </Col>
              )}
            </>
          }
        />
        </Routes>
      </Row>
    </BrowserRouter>
  );
};