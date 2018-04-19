/**
 * Created by Дмитрий on 11.02.2018.
 */

let validateParentRec = (nodeUri, parentCandidate, nodesMap) => {
    if (parentCandidate.uri === nodeUri)
        return false;
    else
    {
        let grandParent = nodesMap[parentCandidate.parent_uri];
        if (grandParent && grandParent.uri in nodesMap)
        {
            return validateParentRec(nodeUri, grandParent, nodesMap);
        }
        else
            return true;
    }
};

let validatePrereq = (nodeUri, prereq, nodesMap) => {
    console.log(prereq.uri + " " + nodeUri);
    if (prereq.uri === nodeUri)
        return false;
    else if (prereq.prereq_uris.length === 0)
        return true;
    else
        return validatePrereqRec(nodeUri, prereq, nodesMap, {});
};


let validatePrereqRec = (node_uri, prereq, nodesMap, seenNodes) => {
    seenNodes[prereq.uri] = true;
    let result = true;
    for (let adjacentNodeUri of prereq.prereq_uris) {
        let adjacentNode = nodesMap[adjacentNodeUri];
        if (seenNodes[adjacentNode.uri] || adjacentNodeUri === node_uri)
            return false;
        else
            result = validatePrereqRec(node_uri, adjacentNode, nodesMap, seenNodes);
    }
    return result;
};

/**
 * Extracting the uris of nodes, that can be prerequisites for specified node_uri from nodesMap
 * @param node_uri - node uri for which prereqs are being searched
 * @param nodesMap - structure node_uri -> node
 */
let getValidPrereqs = (node_uri, nodesMap) => {
    let validPrereqUris = [];
    for (let candidate_uri in nodesMap) {
        if (nodesMap.hasOwnProperty(candidate_uri) && validatePrereq(node_uri, nodesMap[candidate_uri], nodesMap))
            validPrereqUris.push(candidate_uri);
    }
    console.log("validPrereqUris =" + validPrereqUris)
    return validPrereqUris;
};

/**
 * Extracting the uris of nodes, that can be parents for specified node_uri from nodesMap
 * @param node_uri - node uri for which parents are being searched
 * @param nodesMap - structure node_uri -> node
 */
let getValidParents = (node_uri, nodesMap) => {
    let validParentUris = [];
    for (let candidate_uri in nodesMap)
    {
        if (nodesMap.hasOwnProperty(candidate_uri) && validateParentRec(node_uri, nodesMap[candidate_uri], nodesMap))
            validParentUris.push(candidate_uri);
    }
    return validParentUris;
};

const nodeUtils = {
    validatePrereq : validatePrereq,
    getValidParents : getValidParents,
    getValidPrereqs : getValidPrereqs,
};


module.exports = nodeUtils;