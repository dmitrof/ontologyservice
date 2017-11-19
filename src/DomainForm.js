/**
 * Created by Дмитрий on 20.11.2017.
 */
import React, { Component} from 'react';

class DomainForm extends Component
{
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.name,
            uri: this.props.uri,
            description: this.props.description
        };
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
        this.props.onFormSubmit({name: name, description: description, uri:uri});
        this.setState({name: name, description: description, uri:uri});
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
                <input
                    type='submit'
                    value='Post'/>
            </form>
        )
    }


}

export default DomainForm;
