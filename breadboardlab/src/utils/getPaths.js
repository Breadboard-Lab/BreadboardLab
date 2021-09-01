import * as PathFinder from "ngraph.path"

/** getPaths
 *
 * @param graph     The graph to traverse.
 * @param rootNodeID
 * @returns {*[]}   The matrix of paths/cycles.
 */
function getPaths(graph, rootNodeID) {
    /*console.log("links")
    graph.forEachLink(function(link){
        console.log(link)
    })*/

    let pathFinder = PathFinder.aStar(graph, {
        oriented: true
    });
    let rootNode = graph.getNode(rootNodeID)
    const getOutgoingLinks = (node) => node.links.filter(link => node.id === link.fromId)
    const getOutGoingLinksID = getOutgoingLinks(rootNode).map(link => link.toId)
    console.log(getOutGoingLinksID)


    let array = []
    for (const id of getOutGoingLinksID){
        let cycle = pathFinder.find(id, rootNodeID)
        if (cycle.length !== 0) {
            array.push(cycle)
        }
    }

    // DFS implementation (unused)
    /*let visitedNodes = [];
    dfs(graph, rootNode, visitedNodes);
    console.log("dfsArray", visitedNodes)*/
    return array;
}

let masterList = [];

function getCircuits(circuit, listOfBatteries) {
    masterList = [];

    for (let battery of listOfBatteries) {
        getCycles(circuit, battery, [], [])
    }
    return masterList;
}

function checkGround(node) {
    for (let [, component] of node.data.attachTo) {
        if (component) {
            if (component.ref.state.type === "Breadboard") {
                for (let c of component.ref.getConnectedComponents(component.id, node.data)) {
                    if (c.id === "ground") {
                        return true;
                    }
                }
            } else if (component.id === "ground") {
                return true;
            }
        }
    }
    return false;
}

function getCycles(graph, currentNode, visitedNodes, ignoredNodes) {
    let outBoundNodes = [];

    if (checkGround(currentNode)) {
        visitedNodes.push(currentNode.id);
        masterList.push(visitedNodes);
        return masterList;
    }

    graph.forEachLinkedNode(currentNode.id, function (otherNode) {
        if (!(visitedNodes.includes(otherNode.id) || ignoredNodes.includes(otherNode.id))) {
            outBoundNodes.push(otherNode);
        }
    }, true);

    if (!(visitedNodes.includes(currentNode.id) || ignoredNodes.includes(currentNode.id)))
        visitedNodes.push(currentNode.id);
        
    if (outBoundNodes.length > 1) {
        for (let node of outBoundNodes) {
            let i = outBoundNodes.filter((n) => n !== node).map((n) => n.id).concat(ignoredNodes);
            
            if (!(visitedNodes.includes(node.id) || i.includes(node.id))) {
                visitedNodes.push(node.id);
                getCycles(graph, node,  [...visitedNodes].filter((node) => !i.includes(node)), i);
            }
        }
    } else if (outBoundNodes.length === 1) {
        getCycles(graph, outBoundNodes[0], [...visitedNodes], ignoredNodes);
    } else {
        if (checkGround(currentNode)) {
            masterList.push(visitedNodes);
            return;
        }
    }
    return masterList;
}

export {getCircuits}

