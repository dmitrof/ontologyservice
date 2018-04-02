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
            domain_uri: this.props.domain_uri,
            root : true,
        };
        console.log(this.props.domain_uri);

    }

    handleSubmit = (e) => {
        e.preventDefault();
        let name = this.state.name;
        let description = this.state.description;
        let uri = this.state.uri;
        let domain_uri = this.props.domain_uri;
        let parent_uri = (this.props.childNodeForm || !this.state.root) ? this.props.selectedParent : this.props.domain_uri;
        console.log("NEW NODE: " + uri + "FOR PARENT " + parent_uri);
        this.props.tree.addNode({name: name, description: description, uri:uri, domain_uri:domain_uri, parent_uri: parent_uri,
            prereq_uris: this.props.selectedPrereqs});
    };

    handleNameChange = (e) => {
        this.setState({ name: e.target.value });
    };

    handleDescriptionChange = (e) => {
        this.setState({ description: e.target.value });
    };

    handleUriChange = (e) => {
        this.setState({ uri: e.target.value });
    };


    render() {
        console.log('rendering');
        console.log(this.props.selectedPrereqs);
        let prereqList = this.props.selectedPrereqs.map(prereqUri => this.props.tree.prereqInList(this.props.formId, prereqUri));
        let selectedParent = this.parentNode(this.props.selectedParent);
        let parentSelectionPane = this.parentSelectionPane(selectedParent);
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
                    <button type="button" onClick={() => this.props.tree.prereqMode(this.props.formId)}>
                        Выбрать пререквезиты
                    </button>
                </div>
                {this.rootCheckBox()}
                {parentSelectionPane}
                <button type="button" onClick={() => this.props.tree.normalMode(this.props.formId)}>
                    Отменить выбор
                </button>
                <br/>
                <input
                    type='submit'
                    value='Post'/>
            </form>
        )
    }

    parentSelectionPane = (selectedParent) => {
        let panestyle = this.props.childNodeForm ? style.parentSelectionPaneHidden :
            (this.state.root ? style.parentSelectionPaneInactive : style.parentSelectionPane);
        return (<div style={panestyle}>
            <h3>Выбранный раздел: {selectedParent}</h3>
            <button type="button" onClick={this.props.tree.parentSelectionMode}>
                Поместить в раздел
            </button>
        </div>)
    };


    parentNode = (parentUri) => {
        return (<h5> {parentUri}
        </h5>)
            ;
    };

    changeRootStatus = () => {
        let root = !this.state.root;
        this.setState({root: root});
    };


    rootCheckBox = () => {
        if (!this.props.childNodeForm)
            return (<div>Добавить в корень<input type="checkbox" checked={this.state.root} onChange={this.changeRootStatus}/></div>);
    };
}


export default NewNodeForm;

