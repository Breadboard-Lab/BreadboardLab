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

/**
 * Detects all cycles in circuit(graph) that starts and ends with a battery
 * 
 * @param {object} circuit - The graph to transverse
 * @param {*[]} listOfBatteries - List of nodes that is a battery
 * 
 * @returns {string[][]} List of lists containg all the cycles that has a battery(power) from that start and ends with a battery(ground)
 */
function getCircuits(circuit, listOfBatteries) {
    masterList = [];

    for (let battery of listOfBatteries) {
        getCycles(circuit, battery, [], [])
    }
    return masterList;
}

/**
 * Checks if the current node is connected to the ground
 * 
 * @param {object} node - The node to check
 * 
 * @returns Return true if connected to ground, otherwise false
 */
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

/**
 * A DFS-based algorithm to detect cycles that starts with a battery(power) and ends with a battery(ground)
 * 
 * @param {object} graph - The graph to transverse
 * @param {object} currentNode - The current node
 * @param {object[]} visitedNodes - A list containing all the visited nodes
 * @param {object[]} ignoredNodes - A list containing all the ignored nodes
 * 
 * @returns {string[][]} List of lists containg all the cycles that have been found
 */
function getCycles(graph, currentNode, visitedNodes, ignoredNodes) {
    let outBoundNodes = [];

    // Checks if the current node is connected to ground. If connected, push all the visited nodes to the master list.
    if (checkGround(currentNode)) {
        if (!(visitedNodes.includes(currentNode.id) || ignoredNodes.includes(currentNode.id)))
            visitedNodes.push(currentNode.id);
        masterList.push(visitedNodes);
        return masterList;
    }

    // Filters all the linked nodes that have not been visited and not on the ignore list
    graph.forEachLinkedNode(currentNode.id, function (otherNode) {
        if (!(visitedNodes.includes(otherNode.id) || ignoredNodes.includes(otherNode.id))) {
            outBoundNodes.push(otherNode);
        }
    }, true);

    // Push the current node to the visited nodes
    if (!(visitedNodes.includes(currentNode.id) || ignoredNodes.includes(currentNode.id)))
        visitedNodes.push(currentNode.id);
    
    // If encounter multiple nodes, iterate all the nodes and ignore all nodes except the chosen one.
    // If encounter one node, continue through the path.
    // If encounter no nodes, check if connected to ground. If connected, push all the visited nodes to the master list.
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

