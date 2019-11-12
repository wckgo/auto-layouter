import { graphlib, layout } from 'dagre'

export default function layered(graph, option = {
  rankdir: 'LR'
}) {
  const g = new graphlib.Graph()
  g.setGraph(option)
  g.setDefaultEdgeLabel(() => ({}))
  graph.nodes && graph.nodes.forEach(node => {
    g.setNode(node.id, node)
  })
  graph.edges && graph.edges.forEach(edge => {
    g.setEdge(edge.v, edge.w)
  })
  layout(g)
}
