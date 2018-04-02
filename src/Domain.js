/**
 * Created by Дмитрий on 19.11.2017.
 */
import React, { Component} from 'react';
import axios from 'axios';
import style from './style';
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';
import EditDomainForm from './EditDomainForm'

class Domain extends Component
{
    constructor(props) {
        super(props);
        console.log(this.props.domain.uri);
        this.state = { editing: false};
    }

    editDomain = () => {
        this.setState({editing: !this.state.editing})
    };

    render() {
        return (
                <div>
                    <div>
                        <h3>Область знаний: {this.props.domain.name}</h3>
                        uri области: {this.props.domain.uri}
                        <br/>
                        Описание:
                        {this.props.domain.description}
                        <br/>
                        <Link to={`/trees/${this.props.domain.uri}`}>Перейти</Link>
                    </div>
                    <div class="domainManagement">
                        <button onClick={() => this.props.deleteTree(this.props.domain.uri)}>
                            Удалить
                        </button>
                        <button onClick={this.editDomain}>
                            Изменить
                        </button>
                        {this.editDomainForm()}
                    </div>
                </div>
        )
    }

    editDomainForm = () => {
        if (this.state.editing)
            return (<EditDomainForm domain={this.props.domain} updateDomain={this.props.updateDomain}/>)
    };
}

export default Domain;