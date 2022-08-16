import React from 'react'
import './App.css'
import './components/style.css'
import CreateBlockStructure, {
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
let randomInt = range => Math.ceil(Math.random() * range)
function generateBlockPositions () {
  const Blocks = [Z_Blocks, I_Blocks, T_Blocks, [...O_Blocks, ...Bonus_Blocks]]
  const randomChoice = Blocks[randomInt(Blocks.length - 1)]
  const randomBlock = randomChoice[randomInt(randomChoice.length - 1)]
  return randomBlock
}

class App extends React.Component {
  constructor () {
    super()
    this.state = {
      allBlocks: [],
      allBlockClass: []
    }
    this.numberOfBlocks = 0
    setInterval(this.newBlock, 5000)
  }
  addBlockStructure = (blockStructure, key) => {
    this.setState(prevState => {
      prevState.allBlockClass[key] = blockStructure
      return { allBlockClass: prevState.allBlockClass }
    })
  }
  newBlock = () => {
    let positions = generateBlockPositions()
    // const blockStructure = { positions: positions, active: false }
    const blockStructure = (
      <CreateBlockStructure
        x_axis={axis_props.Min_x_axis + BLOCK_INCREMENT * randomInt(3)}
        y_axis={axis_props.Min_y_axis + BLOCK_INCREMENT}
        positions={positions}
        key={this.numberOfBlocks}
        id={this.numberOfBlocks}
        run={true}
        shouldRun={this.shouldRun}
        addBlockStructure={this.addBlockStructure}
      />
    )
    this.setState(prevState => {
      prevState.allBlocks.push(blockStructure)
      return { allBlocks: prevState.allBlocks }
    })
    this.numberOfBlocks++
  }
  shouldRun = check_blockStructure => {
    // Check if a particular block(check_blockStructure) is in contact with any other block
    const check_structure = check_blockStructure.structure
    // filter components with the close x_axis as the check_blockStructure for optimized performance
    const filtered_blocks = this.state.allBlockClass.filter(blockStructure => {
      return (
        blockStructure.props.id !== check_blockStructure.props.id &&
        // Check going backward
        ((check_blockStructure.state.x_axis >= blockStructure.state.x_axis &&
          check_blockStructure.state.x_axis <=
            blockStructure.state.x_axis + BLOCK_INCREMENT * 4) ||
            
          // Check going forward
          (blockStructure.state.x_axis >= check_blockStructure.state.x_axis &&
            blockStructure.state.x_axis <=
              check_blockStructure.state.x_axis + BLOCK_INCREMENT * 4))
      )
    })

    // map for only the structures
    const structures = filtered_blocks.map(
      blockStructure => blockStructure.structure
    )
    return structures.some(structure => {
      return structure.some(row => {
        return check_structure.some(check_row => {
          return row.some(block => {
            return check_row.some(check_block => {
              if (
                check_block &&
                block &&
                check_block.style.left === block.style.left
              ) {
                if (
                  block.style.top > check_block.style.top &&
                  block.style.top <= check_block.style.top + BLOCK_INCREMENT
                ) {
                  return true
                }
              }
              return false
            })
          })
        })
      })
    })
  }
  render () {
    return (
      <div className='myBody'>
        {this.state.allBlocks.map(blockStructure => {
          return blockStructure
        })}
      </div>
    )
  }
}
export default App

export { axis_props }
