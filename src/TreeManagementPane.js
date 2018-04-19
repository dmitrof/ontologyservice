/**
 * Created by Дмитрий on 19.11.2017.
 */
import React, { Component} from 'react';


class TreeManagementPane extends Component
{
    constructor(props) {
        super(props);
        this.state = { showNodeForm : false, status : null};
    }

    getClassName = () => {
        if (this.state.showNodeForm || this.props.serverResponse || this.props.UIMessage)
            return 'treeManagementPane';
        else
            return 'treeManagementPaneHidden';
    };

    render() {
        return (
                <div className='treeManagementPane'>
                    <StatusPane serverResponse={this.props.serverResponse}
                                uiMessage={this.props.UIMessage}/>
                    {this.state.showNodeForm ? this.props.newNodeForm() : null}
                    <button type="button" style={this.props.tree.isNormalMode()? {display:'none'} : {display:'show'}}
                            onClick={() => this.props.tree.normalMode(this.props.formId)}>
                        Отменить выбор
                    </button>
                    <button dataTitle="Создать тему" className='addNewNodeButton'
                         onClick={() => this.setState({showNodeForm : !this.state.showNodeForm})}><p>+</p></button>
                </div>
        )
    }
}

const StatusPane = ({serverResponse}, {UIMessage}) => {
    return (
        <div className="statusPane">
            {serverResponse ? serverResponse + '<br/>' : null}
            {UIMessage ? UIMessage + '<br/>' : null}
        </div>
    )
};


export default TreeManagementPane;