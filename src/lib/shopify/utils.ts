export function extractNodesFromEdges<T>(
  connection: { edges: Array<{ node: T }> } | undefined | null,
): T[] {
  if (!connection?.edges) {
    return []
  }
  return connection.edges.map((edge) => edge.node)
}
