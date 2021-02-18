import React,{Component} from 'react';
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import ErrorAlerts from "../alerts/ErrorAlerts";
import {fetchHandler} from "../scripts/fetchHandler";

class BookInfo extends Component {
    apiPath = "/api/books";

    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };

    constructor() {
        super();
        this.state = {
            book: false,
            comments: [],
            errorMsg: false,
            loading: false,
            commentLink: false,
            textVal: ''
        };
    }

    componentDidMount() {
        let topicId = this.props.match.params.topicId;
        this.setState({loading: true});
        fetchHandler(this.apiPath + '/' + topicId, null,(json) => {
            this.loadComments(json._links.commentList.href);
            this.setState({loading: false, book: json, commentLink:json._links.commentList.href })
        }, (json) =>  this.setState({loading: false, errorMsg: json}))
    }

    loadComments(link) {
        fetchHandler(link, null,(json) => {
            if(json._embedded === undefined) {
                this.setState({comments: [] })
                return;
            }
            this.setState({comments: json._embedded.commentList })
        }, (json) => this.setState({loading: false, errorMsg: json}))
    }

    saveComment(comment) {
        fetchHandler(this.apiPath + '/' + this.state.book.id + '/comments', {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                comment: comment
            })
        }, json => this.loadComments(this.state.commentLink), json => this.setState({loading: false, errorMsg: json}))
    }

    handleRemove = id => {
        fetchHandler(this.apiPath + '/' + this.state.book.id + '/comments/' + id, {method: "delete"},
            json => this.loadComments(this.state.commentLink), json => this.setState({loading: false, errorMsg: json}))
    };

    handleChange = event =>  {
        this.setState({ textVal: event.target.value.substr(0, 100) });
    };

    handleSaveComment = event => {
        let comment = this.state.textVal;
        this.setState({ textVal: ""});
        this.saveComment(comment);
    };

    render() {
        return (
            this.state.loading ? <div>loading...</div> :
                this.state.errorMsg ? <ErrorAlerts errorMsg={this.state.errorMsg}/> :
                    this.state.book &&
            <div>
                <h3>{this.state.book.title}</h3>
                <ul className="list-group">
                    <li className="list-group-item"><b>Author:</b> {this.state.book.author.name}</li>
                    <li className="list-group-item"><b>Genre:</b> {this.state.book.genre.name}</li>
                </ul>

                <Comments comments={this.state.comments} textVal={this.state.textVal} handleRemove={this.handleRemove} handleChange={this.handleChange} handleSaveComment={this.handleSaveComment}/>

            </div>
        );
    }

}
export default withRouter(BookInfo);

function Comments(props) {
    return (
        <div>
            <h5>Comments:</h5>
            {props.comments.map((obj,i) => (
                <div key={i} className="alert alert-secondary" role="alert">
                    <strong>{obj.comment}</strong>
                    <button type="button" className="close" aria-label="Close"  onClick={() => props.handleRemove(obj.id)}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            ))}
            <div className="input-group">
                <textarea className="form-control" aria-label="Write Comment:" value={props.textVal} onChange={props.handleChange}/>
                <button className="btn btn-primary" type="button" onClick={props.handleSaveComment}>Save comment</button>
            </div>
        </div>
    );
}
