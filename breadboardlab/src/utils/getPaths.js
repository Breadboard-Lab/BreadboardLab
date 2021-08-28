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
    // console.log(getOutGoingLinksID)


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

function dfs(graph, currentNode, visitedNodes) {
    // console.log("dfs called at ID", currentNode.id)
    visitedNodes.push(currentNode.id)

    graph.forEachLinkedNode(currentNode.id, function (otherNode) {
        // console.log("otherNodeID", otherNode.id, "startNodeID", currentNode.id)
        if (!visitedNodes.includes(otherNode.id)) {
            dfs(graph, otherNode, visitedNodes);
        }
    }, true);
}

export {getPaths}

