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

                var objects = json._embedded[this.props.listName];
                objects.forEach(function (entry) {
                    var link = entry._links.self.href;
                    var arr = link.split("/");
                    entry.id = arr[(arr.length - 1)];
                });

                if(this.props.selObj.id === undefined) {
                    this.props.selObj.id = json._embedded[this.props.listName][0].id;
                }
                var name = objects.find(x => x.id === this.props.selObj.id ).name;
                this.props.callBack({ id: this.props.selObj.id, name: name}, this.props.listName);
                this.setState({objects: json._embedded[this.props.listName]})
            });
    }

    handleChange = event => {
        var name = this.state.objects.find(x => x.id === event.target.value).name;
        this.props.callBack({ id: event.target.value, name: name}, this.props.listName);
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
