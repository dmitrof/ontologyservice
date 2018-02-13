/**
 * Created by Дмитрий on 19.11.2017.
 */
import React, { Component} from 'react';
import axios from 'axios';
import style from './style';
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';
import DomainForm from './DomainForm'

class Domain extends Component
{
    constructor(props) {
        super(props);
        console.log(this.props.domain.uri);
        this.state = { domain: this.props.domain };
        this.handleUpdate = this.handleUpdate.bind(this);
    }

    render()
    {
        return (
                <div>
                    <div>
                        <h3>Область знаний: {this.state.domain.name}</h3>
                        uri области: {this.state.domain.uri}
                        <br/>
                        Описание:
                        {this.state.domain.description}
                        <br/>
                        <Link to={`/trees/${this.state.domain.uri}`}>Перейти</Link>
                    </div>
                </div>
        )
    }

    handleUpdate = function(newDomain)
    {
        axios.post('tree/editDomain', newDomain)
            .then(res => console.log(res.data.message))
    };
}

export default Domain;