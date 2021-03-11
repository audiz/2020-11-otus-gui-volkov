import React from 'react'

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
    Link,
    useParams, useRouteMatch,
} from "react-router-dom";
import { Navbar,Nav } from 'react-bootstrap'
import Home from './Home';
import Authors from './authors/Authors';
import Books from './books/Books';
import Genres from './genres/Genres';
import * as storage from './scripts/storage';
import 'bootstrap/dist/css/bootstrap.min.css';
import {fetchHandler} from "./scripts/fetchHandler";

class BootstrapNavbar extends React.Component {
    apiPath = '/api/authinfo';

    constructor() {
        super();
        this.state = { object: false, authorities:[] };
    }

    componentDidMount() {
        this.refresh();
    }

    refresh() {
        fetchHandler(this.apiPath, null,(json) => {
            this.setState({object: json, authorities: json.authorities}, () => storage.setAuthInfo(this.state.object))
        }, (json) =>  {})
    }

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
                                {
                                    this.state.object.username === "anonymous" ?
                                        <Nav><Link className="nav-link" to="/login">Login</Link></Nav> :
                                        <Nav><Link className="nav-link" to="/logout">Logout [{this.state.object.username}({this.state.authorities.join(", ")})]</Link></Nav>
                                }

                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                    <br />

                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route path="/Books" component={Books} />
                        <Route path="/Authors" component={Authors} />
                        <Route path="/Genres" component={Genres} />
                        <Route exact path="/login" component={() => {
                            window.location.href = '/login';
                            return null;
                        }}/>
                        <Route exact path="/logout" component={() => {
                            window.location.href = '/logout';
                            return null;
                        }}/>
                    </Switch>
                </Router>
            </div>
        )
    }
}

export default BootstrapNavbar;