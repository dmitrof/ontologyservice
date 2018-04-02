/**
 * Created by Дмитрий on 19.11.2017.
 */
import React, { Component} from 'react';
import style from './style';
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
                <div style={style.DomainPane}>
                    <div>
                        <h3 className="domainName">{this.props.domain.name}</h3>
                        {this.expandButton()}
                        {this.descriptionPane()}
                        <Link to={`/trees/${this.props.domain.uri}`}>Перейти</Link>
                    </div>
                    <div class="domainManagement">
                        <img src="/delete.png" style={style.deleteButton} onClick={() => this.props.deleteTree(this.props.domain.uri)}/>
                        <img src="/edit.jpg" style={style.editButton} onClick={this.editDomain}/>
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

    //TODO: to separate component
    expandButton = () => {
        let text = this.state.expand ? "-" : "+";
        return <div style={style.ExpandButton} onClick={this.expand}>{text} Описание</div>
    };

    descriptionPane = () => {
        if (this.state.expand)
            return (<div style={style.descriptionPane}>
                uri области: {this.props.domain.uri}
                <br/>
                Описание:
                {this.props.domain.description}
                <br/>
            </div>);
    }
}

export default Domain;