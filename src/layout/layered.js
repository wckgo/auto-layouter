import { graphlib, layout } from 'dagre'

export default function layered(data, option = {
  rankdir: 'LR'
}) {
  const graph = new graphlib.Graph()
  graph.setGraph(option)
  graph.setDefaultEdgeLabel(() => ({}))
  data.nodes && data.nodes.forEach(node => {
    graph.setNode(node.id, node)
  })
  data.edges && data.edges.forEach(edge => {
    graph.setEdge(edge.v, edge.w)
  })
  layout(graph)
}
