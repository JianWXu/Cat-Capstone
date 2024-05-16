import React from 'react';
import { Nav, Container, Navbar } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import whiskurrLogo from '../../assets/Editted_Cat.png';
import '../../css/navbar.css';

function AppNavBar() {
  return (
    <Navbar expand="lg" className="navbar">
      <Navbar.Brand href="/home">
          <img src={whiskurrLogo} 
          alt="Whiskurr Logo"
          className="logo" />
        </Navbar.Brand>
      <Container className=" navbarContainer d-flex justify-content-between">
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="navbar-collapse">
          <Nav>
            <LinkContainer to="/login">
              <Nav.Link className="nav-link">Login</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/signup">
              <Nav.Link className="nav-link">Signup</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavBar;
