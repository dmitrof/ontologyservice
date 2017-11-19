/**
 * Created by Дмитрий on 15.11.2017.
 */
import React, { Component } from 'react';
import axios from 'axios';
import style from './style';
import TreeNode from './TreeNode';
import Domain from './Domain'


class Tree extends Component
{
    constructor(props) {
        super(props);
        this.state = { domain: {}, tree: [], isolated: [] };
        this.loadTree = this.loadTree.bind(this);
        this.pollInterval = null;
    }

    loadTree()
    {
        axios.get('http://localhost:3001/api/trees/'.concat(this.props.match.params.domain_uri)).then(res => {
            this.setState({domain: res.data.domain, tree: res.data.tree, isolated: res.data.isolated});
        });
    }

    componentDidMount()
    {
        this.loadTree();
    }

    render()
    {
        let rootNodes = this.state.tree.map(node => this.constructNode(node));
        let isolatedNodes = this.state.isolated.map(node => this.constructNode(node));
        let domain = this.state.domain !== undefined ? this.state.domain : {name: "", uri:"", description: ""};
        console.log(this.state.isolated);
        console.log(this.state.tree);
        console.log(this.state.domain);

        return (
            <div>
                <div>
                    <Domain domain = {this.state.domain}/>
                </div>
                <div>
                    {rootNodes}
                </div>
                <div>
                    <br/>
                    <h3>Изолированные разделы
                    {isolatedNodes}
                        </h3>
                </div>
            </div>
        )


    }

    constructNode = function(node)
    {
        return (
            <TreeNode
                node={node}>
            </TreeNode>
        )
    };
}



export default Tree;