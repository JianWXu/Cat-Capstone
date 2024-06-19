import React, { useContext } from 'react';
import { Nav, Container, Navbar } from 'react-bootstrap';
import UserContext from "../../../userContext";
import { LinkContainer } from 'react-router-bootstrap';
import whiskurrLogo from '../../../assets/Editted_Cat.png';
import './navbar.css';

function AppNavBar() {
  const { user, signOut } = useContext(UserContext);

  console.log(user); // Check if user is correctly fetched

  return (
    <Navbar expand="lg" className="navbar">
      <Navbar.Brand href="/home">
        <img src={whiskurrLogo} alt="Whiskurr Logo" className="logo" />
      </Navbar.Brand>
      <Container className="navbarContainer d-flex justify-content-between">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="navbar-collapse">
          <Nav>
            {user ? (
              <>
                <LinkContainer to="/profile">
                  <Nav.Link className="nav-link">{user.username}</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/swipe">
                  <Nav.Link className="nav-link">Swipe</Nav.Link>
                </LinkContainer>
                <Nav.Link className="nav-link" onClick={signOut}>Log out</Nav.Link>
              </>
            ) : (
              <>
                <LinkContainer to="/login">
                  <Nav.Link className="nav-link">Login</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/signup">
                  <Nav.Link className="nav-link">Signup</Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavBar;
