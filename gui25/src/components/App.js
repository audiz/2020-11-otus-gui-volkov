import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import BootstrapNavbar from './BootstrapNavbar'


export default class App extends React.Component {
    render() {
        return (
            <React.Fragment>
                <BootstrapNavbar/>
            </React.Fragment>
        )
    }
};
