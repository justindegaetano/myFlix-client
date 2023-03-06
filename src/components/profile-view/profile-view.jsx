import React, { useState } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { MovieCard } from "../movie-card/movie-card";

export const ProfileView = ({ movies }) => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");
  const [user, setUser] = useState(storedUser? storedUser : null);
  const [token, setToken] = useState(storedToken? storedToken : null);
  const [username, setUsername] = useState(user.Username);
  const [password, setPassword] = useState();
  const [email, setEmail] = useState(user.Email);

  let favoriteMovies = movies.filter(
    (m) =>
      user.FavoriteMovies && user.FavoriteMovies.indexOf(m.id) >= 0
  );

  const updateUser = (username) => {
    fetch("https://justin-myflixdb.herokuapp.com/users/" + username, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((user) => {
        if (user) {
          setUser(user);
          localStorage.setItem("user", JSON.stringify(user));
          window.location.reload();
        }
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      Username: username,
      Password: password,
      Email: email,
    };

    fetch("https://justin-myflixdb.herokuapp.com/users/" + user.Username, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    .then((response) => response.json())
    .then((updatedUser) => {
      if (updatedUser) {
        alert("Changes saved");
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        window.location.reload();
      } else {
        alert("Something went wrong");
      }
    });
  };

  const handleDeregister = () => {
    fetch("https://justin-myflixdb.herokuapp.com/users/" + user.Username, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (response.ok) {
        alert("Account successfully deleted");
        localStorage.clear();
        window.location.reload();
      } else {
        alert("Something went wrong");
      }
    });
  };

  return (
    <Row>
      <Col>
        <Form className="profile-update" onSubmit={handleSubmit}>
          <h2>Update info</h2>
          <Form.Group>
            <Form.Label>Username: </Form.Label>
            <Form.Control
              className="mx-2 field-border"
              type="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Password: </Form.Label>
            <Form.Control
              className="mx-2 field-border"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Email: </Form.Label>
            <Form.Control
              className="mx-2 field-border"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Button type="submit" className="button-primary m-3">
            Save Changes
          </Button>
          <Button
            onClick={() => handleDeregister(user._id)}
            className="button-delete"
            type="submit"
            variant="danger"
          >
            Delete Account
          </Button>
        </Form>
      </Col>
      <Col>
        <div>
          <div className="mt-4">
            <strong className="label">Username: </strong>
            <span className="value">{user.Username}</span>
          </div>
          <div className="mt-2">
            <strong className="label">Email: </strong>
            <span className="value">{user.Email}</span>
          </div>
          <div className="mt-2">
            <strong className="label">Birthday: </strong>
            <span className="value">{user.Birthday}</span>
          </div>
        </div>
      </Col>
      <Row className="my-4">
        <h2 className="mb-3">Favorite Movies</h2>
        {favoriteMovies.length > 0 &&
          favoriteMovies.map((movie) => (
            <Col className="mb-5" key={movie.id} sm={5} md={3}>
              <MovieCard movie={movie} />
            </Col>
          ))}
      </Row>
    </Row>
  );
};