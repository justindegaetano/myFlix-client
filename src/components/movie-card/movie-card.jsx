import PropTypes from "prop-types";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./movie-card.scss";

export const MovieCard = ({ movie }) => {
  return (
    <Card className="h-100 movie-card">
      <Card.Img className="card-image" variant="top" src={movie.image} />
      <Card.Body className="text-center d-flex flex-column justify-content-between">
        <Card.Title className="card-title text-center">{movie.title}</Card.Title>
        <Card.Text className="card-text">{movie.director}</Card.Text>
        <Link to={`/movies/${encodeURIComponent(movie.id)}`}>
          <Button>More</Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.shape({
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    director: PropTypes.string.isRequired
  }).isRequired
};