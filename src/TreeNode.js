/**
 * Created by Дмитрий on 15.11.2017.
 */
import React, { Component } from 'react';
import axios from 'axios';
import style from './style';
import treeModes from './modes'

class TreeNode extends Component
{
    constructor(props) {
        super(props);
        this.state = {selected:false, editing : false, editNodeForm : null, expand: true};
    }

    getStyle = () => {
        let treeMode = this.props.getTreeViewMode();
        if (this.props.isNodeUnselectable(this.props.node.uri))
            return style.TreeNodeUnselectable;
        if (treeMode === treeModes.NORMAL) {
            return style.TreeNode;
        }
        else if (treeMode === treeModes.CHOOSEPREREQ || treeMode === treeModes.CHOOSEPARENT) {
            if (this.state.hover)
                return style.TreeNodePrereqHover;
            else if (this.props.selected)
                return style.TreeNodeSelected;
        }
        //todo написать стили для selectedasparent и сделать мессаджи о том, для кого нода selected
    };

    onMouseOver = () => {
        this.setState({hover:true});
    };

    onMouseOut = () => {
        this.setState({hover:false});
    };

    onToggle = () => {
    {
        this.props.onToggle(this.props.node);
    }

    editNode = () => {
        let editing = !this.state.editing;
        if (!editing)
            this.props.normalMode();
        this.setState({editing : editing});
    };

    childModeToggle = () => {
        this.setState({childMode: !this.state.childMode});
    };

    render()
    {
        if (this.props.node.children && this.props.node.children !==undefined)
        {
            var children = this.props.node.children.map(node => this.props.constructNode(node));
        }
        else {var children = []};
        let childForm = this.newChildForm();
        let editNodeForm = this.editNodeForm();
        console.log(this.state.expand);
        return(
            <div style={style.subTree}>
                <div style={this.getStyle()} onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut}>
                    <div onClick={this.onToggle}>
                        <h3>{this.props.node.name}</h3>
                        <h5>uri : {this.props.node.uri}</h5>
                        <h5>Требуемые компетенции: {this.props.node.prereq_uris.map(prereq => this.prereqInList(prereq))}</h5>
                    </div>
                    <div>
                        <img src="/edit.jpg" style={style.editButton} onClick={this.editNode}/>
                        <br/>
                        {editNodeForm}
                        <br/>
                        <img src="/delete.png" style={style.deleteButton} onClick={() => this.props.deleteNode(this.props.node.uri)}/>
                    </div>
                </div>
                {this.expandButton()}
                <div className="childrenPane">
                    {this.childrenExpansion(children)}
                    <button onClick={this.childModeToggle}>Создать подраздел</button>
                    {childForm}
                </div>




            </div>
        )
    }

    childrenExpansion = (children) => {
        if (this.state.expand)
        return (<div style={this.state.expand ? style.childNodes : style.childNodesHidden}>
            Подразделы:
            <p style={{marginLeft:40}}>
                {children}
            </p>
        </div>)
    };

    expandButton = () => {
        let text = this.state.expand ? "-" : "+";
        return <div style={style.ExpandButton} onClick={this.expand}>{text}</div>
    };

    expand = () => {
        this.setState({expand: !this.state.expand});
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


export default TreeNode;