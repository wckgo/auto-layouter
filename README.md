# Auto Layouter

Auto Layouter 是一个提供图布局算法和自动布线算法的JavaScript库。

## 目录

- [特性](#特性)
- [安装](#安装)
- [使用](#使用)
- [API](#api)

## 特性

### 布局算法

- [x] 分层布局

### 布线算法

- [x] 正交路由
- [x] 曼哈顿路由
- [x] 切比雪夫路由

## 安装

```shell
npm install auto-layouter
```

- ES Module

  ```JavaScript
  import * as al from 'auto-layouter'
  ```

- CommonJS

  ```JavaScript
  const al = require('auto-layouter/dist/auto-layouter.cjs')
  ```

- Browser

  ```HTML
  <script src="auto-layouter/dist/auto-layouter.min.js" />
  ```

## 使用

示例：

```JavaScript
import { layered, chebyshev} from 'auto-layouter'

const graph = {
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
// 分层布局
layered(graph)


const from = {
  x: graph.nodes[0].x + graph.nodes[0].width,
  y: graph.nodes[0].y + graph.nodes[0].height / 2,
  direction: 'right'
}
const to = {
  x: graph.nodes[1].x,
  y: graph.nodes[1].y + graph.nodes[1].height / 2,
  direction: 'left'
}

// 布线算法
const points = chebyshev(from, to, graph.nodes)

```

## API

### 布局算法

- layered(graph, [option])

  分层布局算法。直接使用[dagrejs](https://github.com/dagrejs/dagre)实现。
  传入graph之后，将会把节点的位置信息(即`x`和`y`)直接赋给`graph.nodes`中的每个元素。

  参数:

  名称| 类型 | 描述
  --|--|--
  graph | Object | 图的数据，包含顶点和边
  option | Object | 与dagre中的graph配置信息一直

  graph的数据结构为:

  ```TypeScript
  type graph = {
    nodes: Array<{
      id: string, // 节点唯一id
      width: number,
      height: number
    }>,
    edges: Array<{
      v: string, // 起点
      w: string // 终点
    }>
  }
  ```  

### 自动布线算法

- orthogonal(from, to, [option])

  基于正交线的算法。根据起点和终点的方向求出一个或者两个正交线，此算法不会避开障碍。

  - 参数：

    名称| 类型 | 描述
    --|--|--
    from | Point | 起点
    to | Point | 终点
    option | Object| 配置信息

  - 点的数据结构：

    ```TypeScript
    type Point = {
      x: number,
      y: number,
      direction: enum // 点的方向，可选值为 up|right|down|left|mid, 其中起点方向不能为mid
    }
    ```

  - option可选值：

    名称| 类型 | 默认值 | 描述 |
    --|--|-- | --
    extensionCord | number | 10 | 点的延长线

  - 返回值：

    `Array<Point>`, 从起点到终点的所有控制点集合。

- manhattan(from, to, boxes, [option])

  基于曼哈顿距离的算法。采用A*搜索算法(A-star search algorithm)实现。其中启发式函数就是曼哈顿距离(Manhattan distance), 即，路径的搜索方向为上下左右四个方向。

  - 参数：
  
    名称| 类型 | 描述
    --|--|--
    from | Point | 起点
    to | Point | 终点
    boxes | Array | 网格地图上的障碍物
    option | Object| 配置信息

  - boxes中的元素的数据结构

    ```TypeScript
    type Box = {
      x: number,
      y: number,
      width: number,
      height: number
    }
    ```

  - option可选值：

    名称| 类型 | 默认值 | 描述 |
    --|--|-- | --
    step | number | 10 | 搜索的步进长度

  - 返回值：

    `Array<Point>`, 从起点到终点的所有控制点集合。

- chebyshev(from, to, boxes, [option])

  也是采用A*搜索算法(A-star search algorithm)实现。不过启发式函数为切比雪夫距离(Chebyshev distance),即，路径的搜索方向增长到了8个，增加了4个对角线方向。参数和返回值同上。

- euclidean(from, to, boxes, [option])

  也是采用A*搜索算法(A-star search algorithm)实现。不过启发式函数为欧几里得距离(Euclidean distance)。
  