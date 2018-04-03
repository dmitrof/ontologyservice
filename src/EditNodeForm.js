import React, { Component } from 'react';
import NewNodeForm from "./NewNodeForm";

class EditNodeForm extends NewNodeForm {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.name,
            description: this.props.description,
            domain_uri: this.props.domain_uri
        };
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let name = this.state.name;
        let description = this.state.description;
        let uri = this.props.uri;
        let domain_uri = this.props.domain_uri;
        let parent_uri = this.state.root ? this.props.domain_uri : this.props.selectedParent;
        this.props.tree.updateNode({uri: uri, name: name, description: description, domain_uri:domain_uri, parent_uri: parent_uri,
            prereq_uris: this.props.selectedPrereqs});
    }

    render() {
        console.log(this.props.selectedPrereqs);
        let prereqList = this.props.selectedPrereqs.map(prereqUri => this.props.tree.prereqInList(this.props.formId, prereqUri));
        let selectedParent = this.parentNode(this.props.selectedParent);
        let parentSelectionPane = this.parentSelectionPane(selectedParent);
        return (
            <form onSubmit={ this.handleSubmit}>
                URI: {this.props.uri}
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
                    <button type="button" onClick={() => this.props.tree.editPrereqMode(this.props.formId)}>
                        Выбрать пререквезиты
                    </button>
                </div>
                {this.rootCheckBox()}
                {parentSelectionPane}
                <button type="button" onClick={this.props.tree.normalMode}>
                    Отменить выбор
                </button>
                <br/>
                <input
                    type='submit'
                    value='Подтвердить изменения'/>
            </form>
        )
    }

    parentSelectionPane = (selectedParent) => {
        let className = this.props.childNodeForm ? 'parentSelectionPaneHidden' :
            (this.state.root ? 'parentSelectionPaneInactive' : 'parentSelectionPane');
        return (<div className={className}>
            <h3>Выбранный раздел: {selectedParent}</h3>
            <button type="button" onClick={() => this.props.tree.editParentMode(this.props.formId)}>
                Поместить в раздел
            </button>
        </div>)
    };
}




export default EditNodeForm;

