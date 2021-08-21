/** getPaths
 *
 * @param graph     The graph to traverse.
 * @param rootNodeID
 * @returns {*[]}   The matrix of paths/cycles.
 */
function getPaths(graph, rootNodeID) {
    let visitedNodes = new Map();
    let array = [];

    let rootNode = graph.getNode(rootNodeID)
    visitedNodes.set(rootNode.id, 0);
    array.push(rootNode.id);

    dfs(graph, rootNode.id, otherNode => {
        /** visitor
         *      Checks if node has been visited before.
         * @returns {boolean} Whether to continue traversal.
         */
        if (visitedNodes.has(otherNode.id)) {
            return false;
        } else {
            array.push(otherNode.id);
            visitedNodes.set(otherNode.id, 0);
            return true;
        }
    });

    return array;   // (Currently only returns DFS array) TODO return matrix of paths.
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

