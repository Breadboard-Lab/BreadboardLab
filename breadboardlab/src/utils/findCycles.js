function findCycles(graph, rootNode) {
    let visitedNodes = new Map();
    let array = [];

    let node = graph.getNode(rootNode)
    visitedNodes.set(node.id, 0);
    array.push(node.id);

    // Let's find what other nodes belong to this component
    dfs(graph, node.id, otherNode => {
        // If node has already been visited...
        if (visitedNodes.has(otherNode.id)) {
            return false;                           // Breaks path traversal
        } else {
            array.push(otherNode.id);               // Adds node to depth first search array
            visitedNodes.set(otherNode.id, 0);      // Sets node as visited.
            return true;                            // Continues path traversal
        }
    });

    return array;
};

function dfs(graph, startFromNodeId, visitor) {
    console.log("dfs called", startFromNodeId)

    graph.forEachLinkedNode(startFromNodeId, function (otherNode) {
        console.log("otherNode", otherNode)
        if (visitor(otherNode)) {
            dfs(graph, otherNode.id, visitor);
        }
    });
}

export {findCycles}