/**
 * Created by Дмитрий on 19.11.2017.
 */
import React, { Component} from 'react';
import {Link} from 'react-router-dom';
import EditDomainForm from './EditDomainForm'


class Domain extends Component
{
    constructor(props) {
        super(props);
        console.log(this.props.domain.uri);
        this.state = { editing: false, expand:false};
    }

    editDomain = () => {
        this.setState({editing: !this.state.editing})
    };

    render() {
        return (
                <div className="domainPane">
                    <div>
                        <h3 className="domainName">{this.props.domain.name}</h3>
                        {/*{this.expandButton()}*/}
                        {this.descriptionPane()}
                        <Link to={`/trees/${this.props.domain.uri}`}>Перейти</Link>
                    </div>
                    <div className="domainManagement">
                        <img src="/delete.png" className="deleteButton" onClick={() => this.props.deleteTree(this.props.domain.uri)}/>
                        <img src="/edit.jpg" className="editButton" onClick={this.editDomain}/>
                        {this.editDomainForm()}
                    </div>
                </div>
        )
    }

    editDomainForm = () => {
        if (this.state.editing)
            return (<EditDomainForm domain={this.props.domain} updateDomain={this.props.updateDomain}/>)
    };

    expand = () => {
        this.setState({expand: !this.state.expand});
    };

    expandButton = () => {
        let text = this.state.expand ? "-" : "+";
        return <div className="expandButton" onClick={this.expand}>{text} Описание</div>
    };

    descriptionPane = () => {
        if (this.state.expand)
            return (<div className="descriptionPane">
                uri области: {this.props.domain.uri}
                <br/>
                Описание:
                {this.props.domain.description}
                <br/>
            </div>);
    }
}

export default Domain;