/**
 * Created by Дмитрий on 15.11.2017.
 */
import React, {Component} from 'react';
import treeModes from './modes'

class TreeNode extends Component {
    constructor(props) {
        super(props);
        this.state = {selected: false, editing: false, editNodeForm: null, expand: true, expandInfo: false};
    }

    getClassName = () => {
        let treeMode = this.props.getTreeViewMode();
        if (treeMode === treeModes.NORMAL) {
            return "nodePresentation";
        }
        else if (treeMode === treeModes.CHOOSEPREREQ || treeMode === treeModes.CHOOSEPARENT) {
            if (this.props.isNodeUnselectable(this.props.node.uri))
                return "nodePresentationUnselectable";
            else if (this.props.selected)
                return "nodePresentationSelected";
            else
                return "nodePresentation";
        }
    };


    onToggle = () => {
        this.props.onToggle(this.props.node);
    };

    editNode = () => {
        let editing = !this.state.editing;
        if (!editing)
            this.props.normalMode();
        this.setState({editing: editing});
    };

    childModeToggle = () => {
        this.setState({childMode: !this.state.childMode});
    };

    render() {
        if (this.props.node.children && this.props.node.children !== undefined) {
            var children = this.props.node.children.map(node => this.props.constructNode(node));
        }
        else {
            var children = []
        }
        ;
        let childForm = this.newChildForm();
        let editNodeForm = this.editNodeForm();
        return (
            <div className="subTree">
                <div className={this.getClassName()} onClick={this.onToggle} onMouseOver={this.onMouseOver}
                     onMouseOut={this.onMouseOut} ref={this.props.nodeRef}>
                    <div className="nodeMain">
                        <div>
                            {this.expandButton(this.expand, this.state.expand)}
                        </div>
                        <div className='nodeTitle'>
                            {this.props.node.name}
                        </div>
                    </div>
                    <div className='nodeManagement'>
                        <img src="/see.png" className='nodeDescriptionButton' onClick={this.expandInfo}/>
                        <img src="/new.png" className='newChildNodeButton' onClick={this.childModeToggle}/>
                        <img src="/edit.jpg" className='editButton' onClick={this.editNode}/>
                        <img src="/delete.png" className='deleteButton'
                             onClick={() => this.props.deleteNode(this.props.node.uri)}/>
                    </div>
                    {this.nodeInfoExpansion()}
                </div>

                <div className="editNodeForm">
                    {editNodeForm}
                </div>
                <div className="childrenPane">
                    {this.childrenExpansion(children)}
                    {this.state.childMode ? childForm : ''}
                </div>
            </div>
        )
    }

    childrenExpansion = (children) => {
        if (this.state.expand)
            return (<div className={this.state.expand ? 'childNodes' : 'childNodesHidden'}>
                {children}
            </div>)
    };

    nodeInfoExpansion = () => {
        if (this.state.expandInfo)
            return (<div className='nodeInfo'>
                Уникальный идентификатор темы : {this.props.node.uri}
                <br/>
                <div className='nodeDescription'>
                    Описание : <br/> {this.props.node.description}
                </div>
                <div className='requiredPrereqList'>
                    Требуемые компетенции: <br/>
                    {this.props.node.prereq_uris.map(prereq_uri => this.props.tree.requiredPrereqLink(prereq_uri))}
                </div>
            </div>)
    };

    expandButton = (cb, predicate, postfix) => {
        let text = (predicate ? "- " : "+ ") + (postfix ? postfix : '');
        return <div className='nodeExpandButton' onClick={cb}>{text}</div>
    };


    expand = () => {
        this.setState({expand: !this.state.expand});
    };

    expandInfo = () => {
        this.setState({expandInfo: !this.state.expandInfo});
    };

    prereqInList = (prereq) => {
        return <div> uri: {prereq} </div>;
    };

    newChildForm = () => {
        if (this.state.childMode) {
            return this.props.childNodeForm(this.props.node.uri);
        }
    };

    editNodeForm = () => {
        if (this.state.editNodeForm === null)
            this.setState({editNodeForm: this.props.editNodeForm(this.props.node.uri)});

        if (this.state.editing)
            return this.props.editNodeForm(this.props.node.uri);
    }
}

class NodeLink extends Component {

}

export default TreeNode;