let currentMethod = 'orthogonal'

const svg = d3.select('#content').append('svg').attr('width', '100%').attr('height', '100%')
const node = svg.append('g')

const boxes = [
  { name: 'A', x: 100, y: 100, width: 100, height: 40 },
  { name: 'B', x: 300, y: 10, width: 100, height: 40 },
  { name: 'C', x: 300, y: 190, width: 100, height: 40 },
  { name: 'D', x: 500, y: 100, width: 100, height: 40 }
]

const routerMethod = {
  orthogonal: al.orthogonal,
  manhattan: al.manhattan,
  metro: al.metro
}

function genPoints (method) {
  const from = {
    x: boxes[0].x + 100,
    y: boxes[0].y + 20,
    direction: 'right'
  }
  const to = {
    x: boxes[1].x,
    y: boxes[1].y + 20,
    direction: 'left'
  }
  return routerMethod[method](from, to, boxes)
}

function genPath (points) {
  points = points.slice()
  const first = points.shift()
  const path = d3.path()
  path.moveTo(first.x, first.y)
  points.forEach(p => path.lineTo(p.x, p.y))
  return path.toString()
}

const rects = node.selectAll('g').data(boxes).enter().append('g').attr('transform', d => `translate(${d.x}, ${d.y})`)
rects.append('rect').attr('width', d => d.width).attr('height', d => d.height).attr('fill', '#FFF').attr('stroke', '#000')
rects.append('text')
  .attr('x', d => d.width / 2).attr('y', d => d.height / 2)
  .attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
  .text(d => d.name)

const links = [{ points: genPoints(currentMethod) }]
const link = svg.insert('g', ':first-child')
const paths = link.selectAll('path').data(links).enter().append('path')
  .attr('d', d => genPath(d.points)).attr('fill', '#FFF').attr('fill-opacity', 0).attr('stroke', '#000')

function updateLink () {
  const points = genPoints(currentMethod)
  if (points && points.length > 0) {
    paths.datum({ points }).attr('d', d => genPath(d.points))
  }
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

const btn = ['orthogonal', 'manhattan', 'metro']

d3.select('#tool').selectAll('button').data(btn).enter()
  .append('button').text(d => d).on('click', d => {
    currentMethod = d
    updateLink()
  })
