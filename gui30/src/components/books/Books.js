import React,{Component} from 'react';
import {BrowserRouter as Router, Link, Switch, Route, useParams, useRouteMatch} from 'react-router-dom';
import BooksTable from "./BooksTable";
import BookInfo from "./BookInfo";
import { withRouter } from "react-router";

class Books extends Component {
    componentDidMount() {
        document.title = 'Books'
    }

    render() {
        const { match, location, history } = this.props;
        return ( <div>
            <Switch>
                <Route path={`${match.path}/:topicId`}>
                    <BookInfo />
                </Route>
                <Route path={match.path}>
                    <BooksTable />
                </Route>
            </Switch>

        </div>)
    }
}
export default withRouter(Books);