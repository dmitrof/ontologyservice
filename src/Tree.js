/**
 * Created by Дмитрий on 15.11.2017.
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import axios from 'axios';
import TreeNode from './TreeNode';
import Domain from './Domain'
import NewNodeForm from './NewNodeForm'
import EditNodeForm from './EditNodeForm'
import ChildNodeForm from './ChildNodeForm'
import treeMode from './modes'
import nodeUtils from './nodeUtils'
import TreeManagementPane from './TreeManagementPane'
import StatusPane from './StatusPane'


class Tree extends Component {
    static rootFormId = "rootForm";

    constructor(props) {
        super(props);
        let formsMap = {};
        formsMap[Tree.rootFormId] = {selectedPrereqs: []};
        this.state = {
            domain: {},
            tree: [],
            isolated: [],
            mode: treeMode.NORMAL,
            formsMap: formsMap,
            selectedPrereqs: [],
            activeFormId: null,
            validParents: [],
            validPrereqs: [],
            status: {},
            nodeRefs: {},
            uiMessage: ''
        };
        this.getClassName = this.getClassName.bind(this);
        this.pollInterval = null;
    }

    loadTree = () => {
        axios.get('http://localhost:3001/api/trees/'.concat(this.props.match.params.domain_uri)).then(res => {
            //console.log(res.data.domain);
            let tree = res.data.tree;
            let nodesMap = {};
            for (let subTree of tree)
                this.fillNodesMap(subTree, nodesMap)
            for (let node of res.data.isolated)
                nodesMap[node.uri] = node;
            this.setState({
                domain: res.data.domain, tree: tree, isolated: res.data.isolated,
                nodesMap: nodesMap, mode: treeMode.NORMAL
            });
        });
    };

    fillNodesMap = (treeNode, nodesMap) => {
        treeNode.selected = false;
        nodesMap[treeNode.uri] = treeNode;
        if (treeNode.children)
            for (let childNode of treeNode.children) {
                this.fillNodesMap(childNode, nodesMap);
            }
    };

    toggleSelectNode = (selectedNode) => {
        console.log("activeFormId = " + this.state.activeFormId);
        let nodesMap = this.state.nodesMap;
        let node = this.state.nodesMap[selectedNode.uri];
        if (this.state.mode !== treeMode.NORMAL) {
            let formsMap = this.state.formsMap;
            let selectedPrereqsUris = formsMap[this.state.activeFormId].selectedPrereqs;
            let selectedParentUri = formsMap[this.state.activeFormId].selectedParent;
            node.selected = !node.selected;
            if (this.state.mode === treeMode.CHOOSEPREREQ) {
                if (node.selected && selectedPrereqsUris.indexOf(node.uri) <= -1)
                    selectedPrereqsUris.push(node.uri);
                else {
                    let index = selectedPrereqsUris.indexOf(node.uri);
                    if (index !== -1) selectedPrereqsUris.splice(index, 1);
                }
            }
            else if (this.state.mode === treeMode.CHOOSEPARENT) {
                if (selectedParentUri !== node.uri && selectedParentUri)
                    nodesMap[selectedParentUri].selected = false;
                selectedParentUri = node.selected ? node.uri : null;
                formsMap[this.state.activeFormId].selectedParent = selectedParentUri;
            }
            console.log("activeFormId=" + this.state.activeFormId +
                " , selectedParent=" + formsMap[this.state.activeFormId].selectedParent +
                " ,selectedPrereqs=" + formsMap[this.state.activeFormId].selectedPrereqs);
            this.setState({nodesMap: nodesMap, formsMap: formsMap});
        }
    };

    normalMode = () => {
        console.log("going to normal mode");
        let nodesMap = this.selectNodesForPredicate(null, () => false);
        this.setState({
            uiMessage: '',
            mode: treeMode.NORMAL, nodesMap: nodesMap, selectedPrereqs: [],
            validParents: [], validPrereqs: []
        });
    };

    // when choosing prereqs for new node
    prereqMode = (activeFormId) => {
        if (this.state.mode === treeMode.CHOOSEPREREQ)
        {
            console.log("goint back to NORMAL");
            this.normalMode();
            return;
        }


        let nodesMap = this.selectNodesForPredicate(activeFormId,
            (formData, nodeUri) => formData.selectedPrereqs.indexOf(nodeUri) > -1);
        let validPrereqs = nodeUtils.getValidPrereqs(activeFormId, this.state.nodesMap);
        let uiMessage = "Выберите компетенции, требуемые для усвоения темы " + activeFormId;
        console.log(uiMessage);
        this.setState({mode: treeMode.CHOOSEPREREQ, uiMessage: uiMessage,
            activeFormId: activeFormId, nodesMap: nodesMap, validPrereqs: validPrereqs})
    };



    // indicates whether the node must be marked as unselectable (dull, inactive)
    isNodeUnselectable = (nodeUri) => {
        //console.log("iSNU: nodeUri=" + nodeUri + " activeFormId=" + this.state.activeFormId + " validPrereqs=" + this.state.validPrereqs);
        if (this.state.activeFormId === null && this.state.activeFormId === Tree.rootFormId)
            return false;
        else return (this.state.mode === treeMode.CHOOSEPARENT && this.state.validParents.indexOf(nodeUri) <= -1) ||
            (this.state.mode === treeMode.CHOOSEPREREQ && this.state.validPrereqs.indexOf(nodeUri) <= -1);
    };

    //when choosing parent for new node
    parentSelectionMode = (activeFormId) => {
        if (this.state.mode === treeMode.CHOOSEPARENT) {
            this.normalMode();
            return;
        }
        let validParents = nodeUtils.getValidParents(activeFormId, this.state.nodesMap);
        let uiMessage = "Выберите раздел, в который надо поместить тему " + activeFormId;
        let nodesMap = this.selectNodesForPredicate(activeFormId, (formData, nodeUri) => formData.selectedParent === nodeUri);
        this.setState({mode: treeMode.CHOOSEPARENT, uiMessage: uiMessage, activeFormId: activeFormId,
            nodesMap: nodesMap, validParents: validParents})
    };


    selectNodesForPredicate = (activeFormId, predicate) => {
        let nodesMap = this.state.nodesMap;
        for (let nodeUri in nodesMap) {
            if (activeFormId && nodesMap.hasOwnProperty(nodeUri) && predicate(this.state.formsMap[activeFormId], nodeUri))
                nodesMap[nodeUri].selected = true;
            else
                nodesMap[nodeUri].selected = false;
        }
        return nodesMap;
    };

    addNode = (params) => {
        axios.post('http://localhost:3001/api/node/add', params).then(res => {
            console.log(res);
            this.setState({serverResponse: res.data.message});
            this.loadTree();
        }).catch(err => console.log(err));
    };

    updateNode = (params) => {
        axios.post('http://localhost:3001/api/node/update', params).then(res => {
            console.log(res);
            this.setState({serverResponse: res.data.message});
            this.loadTree();
        }).catch(err => console.log(err));
    };

    deleteNode = (nodeUri) => {
        console.log(nodeUri);
        axios.post('http://localhost:3001/api/node/remove', {node_uri: nodeUri}).then(res => {
            console.log(res);
            this.setState({serverResponse: res.data.message});
            this.loadTree();
        }).catch(err => console.log(err));
    };

    getMode = () => this.state.mode;

    componentDidMount() {
        this.loadTree();
    }

    getClassName() {
        if (this.state.mode === treeMode.NORMAL)
            return 'treeNormal';
        else if (this.state.mode === treeMode.CHOOSEPREREQ)
            return 'treePrereq';
        /*else if (this.state.mode === treeMode.CHOOSEPARENT)
            return style.TreeChooseParent;*/
    }

    render() {
        let rootNodes = this.state.tree.map(node => {
            return this.constructNode(node)
        });
        console.log(this.state.uiMessage)
        let isolatedNodes = this.state.isolated.map(node => this.constructNode(node));
        return (
            <div className="treeContainer">
                <div className={this.getClassName()}>
                    <div>
                        <Domain domain={this.state.domain}/>
                    </div>
                    <div className="treePane">
                        {rootNodes}
                    </div>
                    <div className="isolatedNodesPane">
                        <h3>Изолированные разделы
                            {isolatedNodes}
                        </h3>
                    </div>
                    <br/>
                    {/*<TreeManagementPane newNodeForm={this.newNodeForm} UIMessage={null} serverResponse={null} tree={this}/>*/}
                    <StatusPane serverResponse={this.state.serverResponse}
                                uiMessage={this.state.uiMessage}/>
                </div>
            </div>

        )
    }

    //Управление созданием нод должно быть у самого старшего элемента иерархии - "дерева"
    constructNode = (node) => {
        let nodeRef = React.createRef();
        return (
            <TreeNode
                node={node}
                nodeRef={nodeRef}
                getTreeViewMode={this.getMode}
                selected={node.selected}
                onToggle={this.toggleSelectNode}
                childNodeForm={this.childNodeForm}
                editNodeForm={this.editNodeForm}
                constructNode={this.constructNode}
                deleteNode={this.deleteNode}
                isNodeUnselectable={this.isNodeUnselectable}
                normalMode={this.normalMode}
                tree={this}
            >
            </TreeNode>
        )
    };

    // getting a form for the child element of a node (parent_uri). Is used by TreeNode.js
    childNodeForm = (parentUri) => {
        let formId = parentUri + '_newchild';

        if (!(formId in this.state.formsMap))
            this.state.formsMap[formId] = {selectedPrereqs: [], selectedParent: parentUri};

        let selectedPrereqsUris = this.state.formsMap[formId].selectedPrereqs;
        return <ChildNodeForm formId={formId} domain_uri={this.state.domain.uri}
                            selectedPrereqs={selectedPrereqsUris} selectedParent={parentUri}
                            childNodeForm={true}
                            tree={this}/>
    };

    editNodeForm = (nodeUri) => {
        if (!(nodeUri in this.state.formsMap))
            this.state.formsMap[nodeUri] = {selectedPrereqs: this.state.nodesMap[nodeUri].prereq_uris,
                selectedParent: this.state.nodesMap[nodeUri].parent_uri};

        let selectedPrereqsUris = this.state.formsMap[nodeUri].selectedPrereqs;
        let selectedParentUri = this.state.formsMap[nodeUri].selectedParent;
        return <EditNodeForm uri={nodeUri} formId={nodeUri} name={this.state.nodesMap[nodeUri].name} description={this.state.nodesMap[nodeUri].description}
                             domain_uri={this.state.domain.uri}
                            selectedPrereqs={selectedPrereqsUris} selectedParent={selectedParentUri}
                            childNodeForm={false}
                             tree={this}/>
    };

    newNodeForm = () => {
        return <NewNodeForm formId={Tree.rootFormId} domain_uri={this.state.domain.uri} addNode={this.addNode}
                            prereqMode={this.prereqMode}
                            normalMode={this.normalMode} parentSelectionMode={this.parentSelectionMode}
                            selectedPrereqs={this.state.formsMap[Tree.rootFormId].selectedPrereqs}
                            selectedParent={this.state.formsMap[Tree.rootFormId].selectedParent}
                            tree={this}/>
    };


    deletePrereqFromList = (formId, prereqUri) => {
        let formsMap = this.state.formsMap;
        let index = formsMap[formId].selectedPrereqs.indexOf(prereqUri);
        if (index !== -1)
            formsMap[formId].selectedPrereqs.splice(index, 1);
        this.setState({formsMap: formsMap});
        this.selectNodesForPredicate(formId, (formData, nodeUri) => formData.selectedPrereqs.indexOf(nodeUri) > -1)
    };


    prereqInList = (formId, prereqUri) => {
        let node = this.state.nodesMap[prereqUri];
        if (node)
        {
            return (<h5> {this.state.nodesMap[prereqUri].name}
                <div onClick={() => this.deletePrereqFromList(formId, prereqUri)}>X</div>
            </h5>)
                ;
        }
    };

    scrollToNode = (nodeRef) => {
        const element = ReactDOM.findDOMNode(this.refs[nodeRef]);
        console.log(this.refs);
        window.scrollTo(0, element.offsetTop);
    };

    requiredPrereqLink = (prereqUri, nodeRef) => {
        let prereq = this.state.nodesMap[prereqUri];
        if (prereq)
        {
            return <div className='requiredPrereq' onClick={() => this.scrollToNode(prereq.uri)}>{prereq.name}</div>
        }
    };

    isNormalMode = () =>
    {
        return (this.state.mode === treeMode.NORMAL);
    }
}

export default Tree;