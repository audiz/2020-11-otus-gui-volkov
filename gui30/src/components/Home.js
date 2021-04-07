import React,{Component} from 'react';
import {fetchHandler} from "./scripts/fetchHandler";
import ErrorAlerts from "./alerts/ErrorAlerts";
import {Link} from "react-router-dom";

class Home extends Component {
    apiPath = '/api/summary';

    constructor() {
        super();
        this.state = { object: false };
    }

    componentDidMount() {
        document.title = 'Home'
        this.refresh();
    }

    refresh() {
        fetchHandler(this.apiPath, null,(json) => this.setState({object: json}), (json) =>  this.setState({errorMsg: json, hasErrors: true}))
    }

    render(){
        let sum = Object.keys(this.state.object).reduce((sum,key)=>sum+parseFloat(this.state.object[key]||0),0);
        return(
                <div className="d-flex justify-content-center">
                    <div>
                    <h2>Summary</h2>
                    <ErrorAlerts errorMsg={this.state.errorMsg} />

                    <table className="table table-sm w-auto">
                        <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Table</th>
                            <th scope="col">Records</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th className="align-middle" scope="row">1</th>
                            <td><Link className="nav-link" to="/Books">Books</Link></td>
                            <td className="align-middle">{this.state.object.books}</td>
                        </tr>
                        <tr>
                            <th className="align-middle" scope="row">2</th>
                            <td><Link className="nav-link" to="/Authors">Authors</Link></td>
                            <td className="align-middle">{this.state.object.authors}</td>
                        </tr>
                        <tr>
                            <th className="align-middle" scope="row">3</th>
                            <td><Link className="nav-link" to="/Genres">Genres</Link></td>
                            <td className="align-middle">{this.state.object.genres}</td>
                        </tr>
                        <tr>
                            <th scope="row">4</th>
                            <td>Comments</td>
                            <td>{this.state.object.comments}</td>
                        </tr>
                        </tbody>

                        <tfoot>
                        <tr>
                            <td colSpan="2">Sum</td>
                            <td>{sum}</td>
                        </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        );
    }
}
export default Home;