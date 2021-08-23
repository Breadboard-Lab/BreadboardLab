import * as PathFinder from "ngraph.path"

/** getPaths
 *
 * @param graph     The graph to traverse.
 * @param rootNodeID
 * @returns {*[]}   The matrix of paths/cycles.
 */
function getPaths(graph, rootNodeID) {
    let pathFinder = PathFinder.aStar(graph, {
        oriented: true
    });

    let rootNode = graph.getNode(rootNodeID)
    const getOutgoingLinks = (node) => node.links.filter(link => node.id === link.fromId)
    const getOutGoingLinksID = getOutgoingLinks(rootNode).map(link => link.toId)
    // console.log(getOutGoingLinksID)

    /*let visitedNodes = new Map();
    let array = [];
    console.log(rootNode)
    visitedNodes.set(rootNode.id, 0);
    array.push(rootNode.id);

    dfs(graph, rootNode.id, otherNode => {
        /!** visitor
         *      Checks if node has been visited before.
         * @returns {boolean} Whether to continue traversal.
         *!/
        if (visitedNodes.has(otherNode.id)) {
            return false;
        } else {
            array.push(otherNode.id);
            visitedNodes.set(otherNode.id, 0);
            return true;
        }
    });*/

    let array = []
    for (const id of getOutGoingLinksID){
        let cycle = pathFinder.find(id, rootNodeID)
        if (cycle.length !== 0) {
            array.push(cycle)
        }
    }

    return array;
}

function dfs(graph, startNodeID, visitor) {
    console.log("dfs called at ID", startNodeID)

    graph.forEachLinkedNode(startNodeID, function (otherNode) {
        console.log("otherNodeID", otherNode.id, "startNodeID", startNodeID)
        if (visitor(otherNode)) {
            dfs(graph, otherNode.id, visitor);
        }
    });
}

export {getPaths}

