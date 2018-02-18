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
        this.getStyle = this.getStyle.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
        this.onToggle = this.onToggle.bind(this);
        this.state = {selected:false };
    }

    getStyle() {
        let treeMode = this.props.getTreeViewMode();

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
    }

    onMouseOver(){
        this.setState({hover:true});
    }

    onMouseOut(){
        this.setState({hover:false});
    }

    onToggle()
    {
        this.props.onToggle(this.props.node);
    }

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
        //console.log(this.props.node);
        return(
            <div style={style.subTree}>
                <div style={this.getStyle()} onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut}
                    onClick={this.onToggle}>
                    <h3>{this.props.node.name}</h3>
                    <h5>uri : {this.props.node.uri}</h5>
                    <h5>Требуемые компетенции: {this.props.node.prereq_uris.map(prereq => this.prereqInList(prereq))}</h5>
                    <button onClick={() => this.props.deleteNode(this.props.node.uri)}>Удалить</button>
                </div>
            Подразделы:
                <p style={{marginLeft:40}}>
                    {children}
                        <button onClick={this.childModeToggle}>Создать подраздел</button>
                    {childForm}
                </p>

            </div>
        )
    }

    prereqInList = (prereq) => {
        return <div> uri: {prereq} </div>;
    };

    newChildForm = () => {
        if (this.state.childMode) {
            return this.props.childNodeForm(this.props.node.uri);
        }
    }
}

export default TreeNode;