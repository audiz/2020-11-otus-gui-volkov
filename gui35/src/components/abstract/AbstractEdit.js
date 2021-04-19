import React, {Component} from 'react';
import ErrorAlerts from "../alerts/ErrorAlerts";
import {fetchHandler} from "../scripts/fetchHandler";

class AbstractEdit extends Component {
    apiPath = '/api/path';
    listName = 'someList';
    pageName = 'PageName';
    saveName = 'Name';

    constructor() {
        super();
        this.state = { objects: [], hasErrors: false, errorMsg: false, newObjectName: '',  editObjectName: '', editPosition: 0, loading: false };
    }
    componentDidMount() {
        document.title = this.pageName;
        this.refresh();
    }

    refresh() {

        this.setState({loading: true});

        fetchHandler(this.apiPath, null,(json) => {
            if(json._embedded === undefined) {
                this.setState({objects: [], loading: false})
            } else {
                this.setState({objects: json._embedded[this.listName], loading: false})
            }
        }, (json) =>  this.setState({errorMsg: json, hasErrors: true, loading: false}))
    }

    deleteObject = id => {
        this.setState({ errorMsg: false, hasErrors: false });
        fetchHandler(this.apiPath + '/' + id, {method: "delete"}, json => this.refresh(), json => this.setState({errorMsg: json, hasErrors: true}))
    };

    addObject = name => {
        fetchHandler(this.apiPath, {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name
            })
        }, json => this.refresh(), json => this.setState({errorMsg: json, hasErrors: true}))
    };

    editObject = (id, name) => {
        fetchHandler(this.apiPath + '/' + id, {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name
            })
        }, json => this.refresh(), json => this.setState({errorMsg: json, hasErrors: true}))
    };

    handleChange = event => {
        const{name, value} = event.target;
        this.setState({ [name]: value.substr(0, 30)});
    };

    handleAdd = event => {
        let name = this.state.newObjectName;
        this.setState({ newObjectName: "", errorMsg: false, hasErrors: false });
        this.addObject(name);
    };

    handleEditBth = (id, name) => {
        this.setState({ editPosition: id, editObjectName: name, errorMsg: false, hasErrors: false })
    };
    handleSaveBth = id => {
        this.editObject(id, this.state.editObjectName);
        this.setState({ editPosition: 0 , errorMsg: false, hasErrors: false})
    };
    handleCancelBth = id => {
        this.setState({ editPosition: 0, errorMsg: false, hasErrors: false })
    };

    render() {
        return (
            <React.Fragment>
                <h2>{this.pageName}</h2>

                <ErrorAlerts errorMsg={this.state.errorMsg} />

                <table className="table table-striped table-hover">
                    <thead className="thead-dark">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Operations</th>
                    </tr>
                    </thead>
                    <tbody>
                    { this.state.loading ? "loading..." :
                        this.state.objects.map((obj, i) => ( this.state.editPosition === obj.id ?
                            <EditRow key={i} object={obj} stateName={this.state.editObjectName} handleSaveBth={this.handleSaveBth} handleCancelBth={this.handleCancelBth} handleChange={this.handleChange} />
                                :
                            <ShowRow key={i} object={obj} handleEditBth={this.handleEditBth} deleteItem={this.deleteObject}/>
                        ))
                    }
                    <AddFrom name={this.saveName} newObjectName={this.state.newObjectName} handleChange={this.handleChange} handleAdd={this.handleAdd} />
                    </tbody>
                </table>
            </React.Fragment>
        )
    }
}
export default AbstractEdit;


function AddFrom(props) {
    return <tr className="table-success">
        <td scope="row" colSpan={2}>
            <div className="form-group">
                <label htmlFor="exampleInputEmail1">Insert new {props.name}</label>
                <input type="text" name="newObjectName" className="form-control" placeholder="Enter name" value={props.newObjectName} onChange={props.handleChange} />
            </div>
        </td>
        <td scope="row" style={{verticalAlign: "middle"}}> <button type="button" className="btn btn-success"  onClick={props.handleAdd}>Add {props.name}</button></td>
    </tr>
}

function ShowRow(props) {
    return <tr>
        <td scope="row" style={{width: '5%'}}>{props.object.id}</td>
        <td scope="row">{props.object.name}</td>
        <td scope="row" style={{width: '10%'}}>
            <button type="button" className="btn btn-primary" onClick={() => props.handleEditBth(props.object.id, props.object.name)}>Edit</button>
            <button type="button" className="btn btn-danger"
                    onClick={(e) => { if (window.confirm('Are you sure you wish to delete this item?')) props.deleteItem(props.object.id) } }>
                Delete</button>
        </td>
    </tr>
}

function EditRow(props) {
    return <tr>
        <td scope="row" style={{width: '5%'}}>{props.object.id}</td>
        <td scope="row"> <input type="text" name="editObjectName" className="form-control" placeholder="Enter name" value={props.stateName} onChange={props.handleChange} /></td>
        <td scope="row" style={{width: '10%'}}>
            <button type="button" className="btn btn-primary" onClick={() => props.handleSaveBth(props.object.id)}>Save</button>
            <button type="button" className="btn btn-secondary" onClick={() => props.handleCancelBth(props.object.id)}>Cancel</button>
        </td>
    </tr>
}