/**
 * Created by Дмитрий on 15.11.2017.
 */
import React, { Component } from 'react';
import axios from 'axios';
import style from './style';

class TreeNode extends Component
{
    constructor(props) {
        super(props);
        this.state = { node: {}, isLeave:false };
    }

    render()
    {
        if (this.props.node.children && this.props.node.children !==undefined)
        {
            var children = this.props.node.children.map(node => {
                return (
                    <TreeNode
                        node={node}>
                    </TreeNode>
                )
            });
        }
        else {var children = []};
        console.log(this.props.node);
        return(<div>
            <h3>{this.props.node.name}</h3>
            <h5>uri : {this.props.node.uri}</h5>
            Подразделы:
                <p style={{marginLeft:40}}>
                    {children}
                </p>
        </div>)
    }
}

export default TreeNode;