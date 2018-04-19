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
}




export default EditNodeForm;

