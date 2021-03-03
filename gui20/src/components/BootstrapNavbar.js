import React from 'react'

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams, useRouteMatch,
} from "react-router-dom";
import { Navbar,Nav } from 'react-bootstrap'
import Home from './Home';
import Authors from './authors/Authors';
import Books from './books/Books';
import Genres from './genres/Genres';

import 'bootstrap/dist/css/bootstrap.min.css';

class BootstrapNavbar extends React.Component {

    render() {
        return(
            <div>
                <Router>
                    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="mr-auto">
                                <Nav.Link href="/">Home</Nav.Link>
                                <Nav><Link className="nav-link" to="/Books">Books</Link></Nav>
                                <Nav><Link className="nav-link" to="/Authors">Authors</Link></Nav>
                                <Nav><Link className="nav-link" to="/Genres">Genres</Link></Nav>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                    <br />

                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route path="/Books" component={Books} />
                        <Route path="/Authors" component={Authors} />
                        <Route path="/Genres" component={Genres} />
                    </Switch>
                </Router>
            </div>
        )
    }
}

export default BootstrapNavbar;