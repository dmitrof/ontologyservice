/**
 * Created by Дмитрий on 15.11.2017.
 */
import React, { Component } from 'react';
import axios from 'axios';
import style from './style';
import TreeNode from './TreeNode';
import Domain from './Domain'
import NewNodeForm from './NewNodeForm'
import treeMode from './modes'


class Tree extends Component
{
    constructor(props) {
        super(props);
        this.state = { domain: {}, tree: [], isolated: [], mode: treeMode.NORMAL, selectedPrereqs: []};
        this.loadTree = this.loadTree.bind(this);
        this.addNode = this.addNode.bind(this);
        this.getStyle = this.getStyle.bind(this);
        this.pollInterval = null;
    }

    loadTree()
    {
        axios.get('http://localhost:3001/api/trees/'.concat(this.props.match.params.domain_uri)).then(res => {
            console.log(res.data.domain);
            let tree = res.data.tree;
            let nodesMap = {};
            for (let subTree of tree)
                this.fillNodesMap(subTree, nodesMap)
            for (let node of res.data.isolated)
                nodesMap[node.uri] = node;
            this.setState({domain: res.data.domain, tree: tree, isolated: res.data.isolated,
                nodesMap: nodesMap, mode: treeMode.NORMAL});
        });
    }

    fillNodesMap = (treeNode, nodesMap) => {
        treeNode.selected = false;
        nodesMap[treeNode.uri] = treeNode;
        for (let childNode of treeNode.children)
        {
            this.fillNodesMap(childNode, nodesMap);
        }
    };

    //todo удаление пререков
    toggleSelectNode = (selectedNode) => {
        let nodesMap = this.state.nodesMap;
        let node = this.state.nodesMap[selectedNode.uri];
        if (this.state.mode !== treeMode.NORMAL) {
            let selectedPrereqs = this.state.selectedPrereqs;
            let selectedParent = this.state.selectedParent;
            node.selected = !node.selected;
            if (this.state.mode === treeMode.CHOOSEPREREQ) {
                if (node.selected)
                    selectedPrereqs.push(node);
                else {
                    let index = selectedPrereqs.indexOf(node);
                    if (index !== -1) selectedPrereqs.splice(index, 1);
                }
            }
            else if (this.state.mode === treeMode.CHOOSEPARENT) {
                if (selectedParent !== node.uri && selectedParent)
                    nodesMap[selectedParent].selected = false;
                selectedParent = node.selected ? node.uri : null;
            }
            console.log(selectedParent);
            this.setState({nodesMap: nodesMap, selectedPrereqs: selectedPrereqs, selectedParent: selectedParent});
        }
    };


    normalMode = () => {
        //all nodes are unselected
        let nodesMap = this.state.nodesMap;
        console.log(this.state.nodesMap);
        for (let nodeUri in nodesMap)
            nodesMap[nodeUri].selected = false;
        this.setState({mode: treeMode.NORMAL, nodesMap: nodesMap, selectedPrereqs: [], selectedParent: null});
    };

    prereqMode = () => {
        this.setState({mode: treeMode.CHOOSEPREREQ})
    };

    parentSelectiontMode = () => {
        this.setState({mode: treeMode.CHOOSEPARENT})
    };

    addNode = (params) => {
        axios.post('http://localhost:3001/api/node/add', params).then(res => {
            console.log(res);
            this.loadTree();
        }).catch(err => console.log(err));
    };

    deleteNode = (nodeUri) => {
        console.log(nodeUri);
        axios.post('http://localhost:3001/api/node/remove', {node_uri:nodeUri}).then(res => {
            console.log(res);
            this.loadTree();
        }).catch(err => console.log(err));
    };

    getMode = () => this.state.mode;

    componentDidMount()
    {
        this.loadTree();
    }

    getStyle()
    {
        if (this.state.mode === treeMode.NORMAL)
            return style.TreeNormal;
        else if (this.state.mode === treeMode.CHOOSEPREREQ)
            return style.TreePrereq;
        /*else if (this.state.mode === treeMode.CHOOSEPARENT)
            return style.TreeChooseParent;*/
    }

    render()
    {
        let rootNodes = this.state.tree.map(node => {
            return this.constructNode(node)
        });

        let isolatedNodes = this.state.isolated.map(node => this.constructNode(node));
        return (
            <div style={this.getStyle()}>
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
                    <NewNodeForm domain_uri={this.state.domain.uri} addNode={this.addNode} prereqMode={this.prereqMode}
                        normalMode={this.normalMode} parentSelectionMode={this.parentSelectiontMode}
                                 selectedPrereqs={this.state.selectedPrereqs} selectedParent={this.state.selectedParent}/>
                </div>
            </div>
        )
    }

    //Управление созданием нод должно быть у самого старшего элемента иерархии - "дерева"
    constructNode = (node) =>
    {
        return (
            <TreeNode
                node={node}
                getTreeViewMode={this.getMode}
                selected={node.selected}
                onToggle={this.toggleSelectNode}
                childNodeForm={this.childNodeForm}
                constructNode={this.constructNode}
                deleteNode={this.deleteNode}>
            </TreeNode>
        )
    };

    childNodeForm = (parentUri) => {
        return <NewNodeForm domain_uri={this.state.domain.uri} addNode={this.addNode} prereqMode={this.prereqMode}
                            normalMode={this.normalMode} parentSelectionMode={this.parentSelectiontMode}
                            selectedPrereqs={this.state.selectedPrereqs} selectedParent={parentUri}
                            childNodeForm={true}/>
    }
}



export default Tree;