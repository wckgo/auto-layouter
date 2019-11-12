let currentMethod = 'orthogonal'

const svg = d3.select('#content').append('svg').attr('width', '100%').attr('height', '100%')
const node = svg.append('g')

const nodes = {
  nodes: [
    {id: 'A', width: 100, height: 40},
    {id: 'B', width: 100, height: 40},
    {id: 'C', width: 100, height: 40},
    {id: 'D', width: 100, height: 40}
  ],
  edges: [
    {v: 'A', w: 'B'},
    {v: 'A', w: 'C'},
    {v: 'B', w: 'D'},
    {v: 'C', w: 'D'},
  ]
}

const graph = al.layered(nodes)

const routerMethod = {
  orthogonal: al.orthogonal,
  manhattan: al.manhattan,
  chebyshev: al.chebyshev
}

function genPoints (method, link) {
  const vn = nodes.nodes.find(n => n.id === link.v)
  const wn = nodes.nodes.find(n => n.id === link.w)
  const from = {
    x: vn.x + vn.width,
    y: vn.y + vn.height / 2,
    direction: 'right'
  }
  const to = {
    x: wn.x,
    y: wn.y + wn.height / 2,
    direction: 'left'
  }
  return routerMethod[method](from, to, nodes.nodes)
}

function genPath (points) {
  points = points.slice()
  const first = points.shift()
  const path = d3.path()
  path.moveTo(first.x, first.y)
  points.forEach(p => path.lineTo(p.x, p.y))
  return path.toString()
}

const rects = node.selectAll('g').data(nodes.nodes).enter().append('g').attr('transform', d => `translate(${d.x}, ${d.y})`)
rects.append('rect').attr('width', d => d.width).attr('height', d => d.height).attr('fill', '#FFF').attr('stroke', '#000')
rects.append('text')
  .attr('x', d => d.width / 2).attr('y', d => d.height / 2)
  .attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
  .text(d => d.name)

const getPath = d => genPath(genPoints(currentMethod, d))
const link = svg.insert('g', ':first-child')
const paths = link.selectAll('path').data(nodes.edges).enter().append('path')
  .attr('d', getPath).attr('fill', '#FFF').attr('fill-opacity', 0).attr('stroke', '#000')

function updateLink () {
  paths.attr('d', getPath)
}

rects.call(
  d3.drag()
    .on('drag', (d, i, n) => {
      d.x = d3.event.x
      d.y = d3.event.y
    })
    .on('start.update drag.update', () => {
      rects.attr('transform', d => `translate(${d.x}, ${d.y})`)
      updateLink()
    })
)

const btn = ['orthogonal', 'manhattan', 'chebyshev']

d3.select('#tool').selectAll('button').data(btn).enter()
  .append('button').text(d => d).on('click', d => {
    currentMethod = d
    updateLink()
  })

