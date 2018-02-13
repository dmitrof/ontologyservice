/**
 * Created by Дмитрий on 19.11.2017.
 */
import React, { Component } from 'react';
import axios from 'axios';
import style from './style';
import Domain from './Domain'
import DomainForm from './DomainForm'

class TreeList extends Component
{
    constructor(props) {
        super(props);
        this.loadDomains = this.loadDomains.bind(this);
        this.addDomain = this.addDomain.bind(this);
        this.state = { domains : []};
    }

    loadDomains()
    {
        axios.get('http://localhost:3001/api/trees').then(res => {
            console.log(res.data.domains);
            this.setState({domains: res.data.domains});
        }).catch(err => console.log(err));
    }

    componentDidMount()
    {
        this.loadDomains();
    }

    addDomain(params)
    {
        axios.post('http://localhost:3001/api/trees', params).then(res => {
            console.log(res.data.message);
            this.loadDomains();
        }).catch(err => console.log(err));
    }

    render()
    {
        let domains = this.state.domains.map(domain =>
            <Domain
                domain = {domain}
            >
            </Domain>
        );
        return (
            <div>
                <h2>Доступные обасти знаний:</h2>
                <br/>
                {domains}
                <div>
                    <br/>
                    Создать новую область знаний
                    <br/>
                    <DomainForm onFormSubmit={this.addDomain}/>
                </div>
            </div>
        )
    }
}

export default TreeList;