import React, { Component} from 'react';
import DomainForm from './DomainForm';

class EditDomainForm extends DomainForm {
    constructor(props) {
        super(props);
        this.state = {
            name : this.props.domain.name,
            description : this.props.domain.description
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let name = this.state.name;
        let description = this.state.description;
        this.props.updateDomain({name: name, description: description, uri: this.props.domain.uri});
    };


    render() {
        return (
            <form onSubmit={ this.handleSubmit}>
                URI: {this.props.domain.uri}

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
                <input
                    type='submit'
                    value='Post'/>
            </form>
        )
    }
}

export default EditDomainForm;