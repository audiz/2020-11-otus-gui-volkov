import React, {Component} from "react";

class Select extends Component {
    constructor(props) {
        super(props);
        this.state = {objects: [], value: this.props.selObj.id};
    }

    componentDidMount() {
        fetch(this.props.apiPath)
            .then(response => response.json())
            .then(json => {
                if(this.props.selObj.id === undefined){
                    this.props.selObj.id = json._embedded[this.props.listName][0].id;
                }
                this.props.callBack(this.props.selObj.id, this.props.listName);
                this.setState({objects: json._embedded[this.props.listName]})
            });
    }

    handleChange = event => {
        this.props.callBack(event.target.value, this.props.listName);
        this.setState({ value: event.target.value });
    };

    render() {
        return (<select className="form-control" value={this.state.value} onChange={this.handleChange}>
            {
                this.state.objects.map((obj,i) => (
                    <option key={i} value={obj.id}>{obj.name}</option>
                ))
            }
        </select>)
    }
}
export default Select;
