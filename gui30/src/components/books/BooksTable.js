import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import ErrorAlerts from "../alerts/ErrorAlerts";
import Select from "./Select";
import {fetchHandler} from "../scripts/fetchHandler";

var AUTHOR_LIST = "authors";
var GENRE_LIST = "genres";

class BooksTable extends Component {
    apiPath = "/datarest/books";
    saveName = "Book";
    listName = 'books';

    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };

    constructor() {
        super();
        this.state = {books: [], hasErrors: false, errorMsg: false, newObjectName: '',  editObjectName: '', editPosition: 0, [AUTHOR_LIST]: 0, [GENRE_LIST]: 0 };
    }

    componentDidMount() {
       this.refresh();
    }

    refresh() {
        fetchHandler(this.apiPath, null,(json) => {
            var objects = json._embedded[this.listName];
            objects.forEach(function (entry) {
                var link = entry._links.self.href;
                var arr = link.split("/");
                entry.id = arr[(arr.length - 1)];
            });
            this.setState({books: json._embedded.books})
        }, (json) =>  this.setState({errorMsg: json, hasErrors: true}))
    }

    deleteItem = id => {
        this.setState({ errorMsg: false, hasErrors: false });
        fetchHandler(this.apiPath + '/' + id, {method: "delete"}, json => this.refresh(), json => this.setState({errorMsg: json, hasErrors: true}))
    };

    editObject = (id, authorObj, genreObj, title) => {
        fetchHandler(this.apiPath + '/' + id, {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                author: authorObj,
                genre: genreObj
            })
        }, json => this.refresh(), json => this.setState({errorMsg: json, hasErrors: true}))
    };

    addObject = (title, authorObj, genreObj) => {
        fetchHandler(this.apiPath, {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                author: authorObj,
                genre: genreObj
            })
        }, json => this.refresh(), json => this.setState({errorMsg: json, hasErrors: true}))
    };

    handleChange = event => {
        const{name, value} = event.target;
        this.setState({ [name]: value.substr(0, 30)});
    };
    handleEditBth = (id, name) => {
        this.setState({ editPosition: id, editObjectName: name, errorMsg: false, hasErrors: false })
    };
    handleSaveBth = id => {
        this.editObject(id, this.state[AUTHOR_LIST], this.state[GENRE_LIST], this.state.editObjectName);
        this.setState({ editPosition: 0 , errorMsg: false, hasErrors: false})
    };
    handleCancelBth = id => {
        this.setState({ editPosition: 0, errorMsg: false, hasErrors: false })
    };

    handleAdd = event => {
        let name = this.state.newObjectName;
        this.setState({ newObjectName: "", errorMsg: false, hasErrors: false });
        this.addObject(name, this.state[AUTHOR_LIST + "_new"], this.state[GENRE_LIST + "_new"]);
    };

    callBack = (id, listName) => {
        this.setState({[listName]: id});
    };

    newCallBack = (id, listName) => {
        this.setState({[listName + "_new"]: id});
    };

    render() {
        const { match, location, history } = this.props;

        return (
            <React.Fragment>
                <h2>Books</h2>

                <ErrorAlerts errorMsg={this.state.errorMsg} />

                <table className="table table-striped table-hover">
                    <thead className="thead-dark">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Title</th>
                        <th scope="col">Author</th>
                        <th scope="col">Genre</th>
                        <th scope="col">Comments</th>
                        <th scope="col">Edit</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.books.map((book, i) => (
                            this.state.editPosition === book.id ?
                                <EditRow key={i} book={book} stateName={this.state.editObjectName} handleSaveBth={this.handleSaveBth} handleCancelBth={this.handleCancelBth} handleChange={this.handleChange}
                                         callBack={this.callBack} />
                             :
                                <ShowRow key={i} book={book} match={match} deleteItem={this.deleteItem} handleEditBth={this.handleEditBth}/>
                        ))
                    }

                    <AddFrom name={this.saveName} newObjectName={this.state.newObjectName} handleChange={this.handleChange} handleAdd={this.handleAdd} callBack={this.newCallBack} />

                    </tbody>
                </table>
            </React.Fragment>
        )
    }
}
export default withRouter(BooksTable);

function AddFrom(props) {
    return <tr className="table-success">
        <td colSpan={2}>
            <div className="form-group">
                <label htmlFor="exampleInputEmail1">Insert new {props.name}</label>
                <input type="text" name="newObjectName" className="form-control" placeholder="Enter name" value={props.newObjectName} onChange={props.handleChange} />
            </div>
        </td>
        <td style={{verticalAlign: "middle"}}>
            <Select apiPath={"/datarest/authors"} listName={AUTHOR_LIST} selObj={{}} callBack={props.callBack}/>
        </td>
        <td style={{verticalAlign: "middle"}}>
            <Select apiPath={"/datarest/genres"} listName={GENRE_LIST} selObj={{}} callBack={props.callBack}/>
        </td>
        <td></td>
        <td style={{verticalAlign: "middle"}}> <button type="button" className="btn btn-success"  onClick={props.handleAdd}>Add {props.name}</button></td>
    </tr>
}

function ShowRow(props) {
    return  <tr>
        <td scope="row" style={{width: '5%'}}>{props.book.id}</td>
        <td scope="row" style={{width: '40%'}}> <Link to={`${props.match.url}/${props.book.id}`}>{props.book.title}</Link></td>
        <td scope="row" style={{width: '20%'}}>{props.book.author.name}</td>
        <td scope="row" style={{width: '20%'}}>{props.book.genre.name}</td>
        <td scope="row">{props.book.commentsSize}</td>
        <td scope="row" style={{width: '10%'}}>
            <button type="button" className="btn btn-primary" onClick={() => props.handleEditBth(props.book.id, props.book.title)}>Edit</button>
            <button type="button" className="btn btn-danger"
                    onClick={(e) => { if (window.confirm('Are you sure you wish to delete this item?')) props.deleteItem(props.book.id) } }>
                Delete</button>
        </td>
    </tr>
}

function EditRow(props) {
    return <tr>
        <td scope="row" style={{width: '5%'}}>{props.book.id}</td>
        <td scope="row" style={{width: '40%'}}> <input type="text" name="editObjectName" className="form-control" placeholder="Enter name" value={props.stateName} onChange={props.handleChange} /></td>
        <td scope="row" style={{width: '20%'}}>
            <Select apiPath={"/datarest/authors"} listName={AUTHOR_LIST} selObj={props.book.author} callBack={props.callBack}/>
        </td>
        <td scope="row" style={{width: '20%'}}>
            <Select apiPath={"/datarest/genres"} listName={GENRE_LIST} selObj={props.book.genre} callBack={props.callBack}/>
        </td>
        <td scope="row"> </td>
        <td scope="row" style={{width: '10%'}}>
            <button type="button" className="btn btn-primary" onClick={() => props.handleSaveBth(props.book.id)}>Save</button>
            <button type="button" className="btn btn-secondary" onClick={() => props.handleCancelBth(props.book.id)}>Cancel</button>
        </td>
    </tr>
}