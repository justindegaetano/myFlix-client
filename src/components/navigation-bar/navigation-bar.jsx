import { Navbar, Container, Nav, Form, FormControl } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./navigation-bar.scss";

export const NavigationBar = ({ user, onLoggedOut, handleSearchInput, handleFilterSelection }) => {
  return (
    <Navbar className="mt-1 mb-4" bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          myFlix
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
          {!user && (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/signup">
                  Signup
                </Nav.Link>
              </>
            )}
            {user && (
              <>
                <Nav.Link as={Link} to="/">
                  Movies
                </Nav.Link>
                <Nav.Link as={Link} to="/profile">
                  Profile
                </Nav.Link>
                <Nav.Link onClick={onLoggedOut}>
                  Logout
                </Nav.Link>
              </>
            )}
          </Nav>
          {user && (
            <Form inline className="d-flex">
              <FormControl
                type="text"
                placeholder="Search"
                className="mr-sm-2 mx-2 field-border"
                onChange={handleSearchInput}
              />
              {/* Dropdown for filter selection*/}
              <FormControl
                as="select"
                onChange={handleFilterSelection}
                className="field-border"
              >
                <option value="title">Title</option>
                <option value="genre">Genre</option>
                <option value="director">Director</option>
              </FormControl>
            </Form>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};