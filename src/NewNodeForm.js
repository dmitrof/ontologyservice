/**
 * Created by Дмитрий on 23.01.2018.
 */

import React, { Component } from 'react';
import axios from 'axios';
import style from './style';
import TreeNode from './TreeNode';
import Domain from './Domain'


class NewNodeForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            uri: "",
            description: "",
            domain_uri: this.props.domain_uri
        };
        console.log(this.props.domain_uri);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleUriChange = this.handleUriChange.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        let name = this.state.name;
        let description = this.state.description;
        let uri = this.state.uri;
        let domain_uri = this.props.domain_uri;
        console.log(domain_uri);
        this.props.addNode({name: name, description: description, uri:uri, domain_uri:domain_uri, parent_uri: this.props.selectedParent,
            prereq_uris: this.props.selectedPrereqs.map(prereq => prereq.uri)});
    }
    //todo унифицированть чендж хендлы
    handleNameChange(e) {
        this.setState({ name: e.target.value });
    }

    handleDescriptionChange(e) {
        this.setState({ description: e.target.value });
    }

    handleUriChange(e) {
        this.setState({ uri: e.target.value });
    }


    render() {
        console.log('rendering');
        console.log(this.props.selectedPrereqs);
        let prereqList = this.props.selectedPrereqs.map(prereq => this.prereqInList(prereq));
        let selectedParent = this.parentNode(this.props.selectedParent);
        return (
            <form onSubmit={ this.handleSubmit}>
                URI
                <input
                    type='text'
                    placeholder='URI'
                    value={this.state.uri}
                    onChange={ this.handleUriChange } />
                <br/>
                Наименование области знаний
                <input
                    type='text'
                    placeholder='Название'
                    value={this.state.name}
                    onChange={ this.handleNameChange } />
                <br/>
                Описание области знаний
                <input
                    type='text'
                    placeholder='Описание'
                    value={this.state.description}
                    onChange={ this.handleDescriptionChange } />
                <br/>
                <div>
                    <h3>Выбранные пререквизиты: {prereqList}</h3>
                    <button type="button" onClick={this.props.prereqMode}>
                        Выбрать пререквезиты
                    </button>
                </div>
                <div>
                    <h3>Выбранный раздел: {selectedParent}</h3>
                    <button type="button" onClick={this.props.parentSelectionMode}>
                        Поместить в раздел
                    </button>
                </div>
                <button type="button" onClick={this.props.normalMode}>
                    Отменить выбор
                </button>
                <br/>
                <input
                    type='submit'
                    value='Post'/>
            </form>
        )
    }


    prereqInList = (prereq) => {
        return (<h5> {prereq.name}
        </h5>)
        ;
    }

    parentNode = (parentUri) => {
        return (<h5> {parentUri}
        </h5>)
            ;
    }
}


export default NewNodeForm;

