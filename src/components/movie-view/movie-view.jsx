import React, { useState } from 'react';
import { Button, Row, Col } from "react-bootstrap";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import "./movie-view.scss";

export const MovieView = ({ movies }) => {
  const { movieId } = useParams();

  const movie = movies.find((m) => m.id === movieId);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");
  const [user, setUser] = useState(storedUser? storedUser : null);
  const [token, setToken] = useState(storedToken? storedToken : null);

  const updateUser = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  }

  const handleFavorite = () => {
    fetch("https://justin-myflixdb.herokuapp.com/users/"+user.Username+"/movies/"+movie.id, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    }).then((response) => {
      alert("Added to favorites.");
      return response.json();
    }).then(data => updateUser(data))
    .catch(error => {
        alert("Something went wrong.");
    });
  };

  const handleRemoveFavorite = () => {
    fetch("https://justin-myflixdb.herokuapp.com/users/"+user.Username+"/movies/"+movie.id, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    }).then((response) => {
      if (response.ok) {
        alert("Removed from favorites.");
        const revisedUser = {
          ...user,
          FavoriteMovies: user.FavoriteMovies.filter(id => id != movie.id)
        }
        updateUser(revisedUser);
      } else {
        alert("Something went wrong.");
      }
    });
  };
 
    return (
      <Row>
        <Col md={6}>
          <img className="movie-img img-fluid d-block mx-auto" 
          crossOrigin="anonymous" 
          src={movie.image} />
        </Col>
        <Col md={6}>
          <div className="my-3">
            <span>
              <strong>{movie.title}</strong>
            </span>
          </div>
          <div>
            <strong>Director: </strong>
            <span>{movie.director}</span>
          </div>
          <div>
            <strong>Genre: </strong>
            <span>{movie.genre}</span>
          </div>
          <div>
            <strong>Description: </strong>
            <span>{movie.description}</span>
          </div>

          {
            storedUser.FavoriteMovies.indexOf(movie.id) >= 0 ? (
              <Button 
                onClick={() => handleRemoveFavorite(movie.id, "remove")}
                variant="danger"
              >
                Remove from Favorites
              </Button>
            ) : (
              <Button 
                onClick={() => handleFavorite(movie.id, "add")}
              >
                + Add to Favorites
              </Button>
            )
          }
          
          <Link to={`/`}>
            <Button className="back-button m-2">Back</Button>
          </Link>
        </Col>
      </Row>
    );
  };