import React from 'react'
import './App.css'
import './components/style.css'
import CreateBlockComponent, {
  BlockDefault_styles,
  BLOCK_INCREMENT
} from './components/Block'
const axis_props = {
  Min_x_axis: 100,
  Max_x_axis: 500,
  Min_y_axis: 20,
  Max_y_axis: 500
}
const Z_Blocks = [
  [
    [1, 1],
    [2, 1],
    [2, 2],
    [3, 2]
  ],
  [
    [3, 0],
    [3, 1],
    [2, 1],
    [2, 2]
  ]
]
const I_Blocks = [
  [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3]
  ],
  [
    [3, 0],
    [3, 1],
    [3, 2],
    [3, 3]
  ]
]
const T_Blocks = [
  [
    [2, 1],
    [3, 0],
    [3, 1],
    [3, 2]
  ],
  [
    [1, 0],
    [2, 0],
    [3, 0],
    [2, 1]
  ],
  [
    [2, 0],
    [2, 1],
    [2, 2],
    [3, 1]
  ],
  [
    [2, 0],
    [1, 1],
    [2, 1],
    [3, 1]
  ]
]
const O_Blocks = [
  [
    [2, 0],
    [2, 1],
    [3, 0],
    [3, 1]
  ]
]
const Bonus_Blocks = [[[3, 0]]]
function generateBlockPositions () {
  const Blocks = [Z_Blocks, I_Blocks, T_Blocks, [...O_Blocks, ...Bonus_Blocks]]
  let randomInt = length => Math.ceil(Math.random() * length)
  const randomChoice = Blocks[randomInt(Blocks.length - 1)]
  const randomBlock = randomChoice[randomInt(randomChoice.length - 1)]
  return randomBlock
}
class App extends React.Component {
  constructor () {
    super()
    this.state = {
      allBlocks: []
    }
    setTimeout(this.newBlock, 5000)
  }
  newBlock = () => {
    let positions = generateBlockPositions()
    // const blockComponent = { positions: positions, active: false }
    const blockComponent = { positions: positions, active: false }
    this.setState(prevState => {
      prevState.allBlocks.push(blockComponent)
      return { allBlocks: prevState.allBlocks }
    })
  }
  render () {
    return (
      <div className='myBody'>
        {this.state.allBlocks.map(blockComponent => {
          return (
            <CreateBlockComponent
              x_axis={axis_props.Min_x_axis + BLOCK_INCREMENT * 2}
              y_axis={axis_props.Min_x_axis + BLOCK_INCREMENT}
              positions={blockComponent.positions}
              run={true}
            />
          )
        })}
      </div>
    )
  }
}
export default App

export { axis_props }
