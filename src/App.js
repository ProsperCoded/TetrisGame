import React from 'react'
import './components/bootstrap.min.css'
import './style.css'
import * as utils from './util.js'
import CreateBlockStructure, {
  BlockDefault_styles,
  BLOCK_INCREMENT
} from './components/Block'

let container = document.querySelector('#body_container')
let container_info = container.getClientRects()[0]
console.log(container)
const axis_props = {
  Min_x_axis: 0,
  Max_x_axis: Math.ceil(container_info.width),
  Min_y_axis: 0,
  Max_y_axis: Math.ceil(container_info.height)
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
    [1, 0],
    [2, 0],
    [3, 0]
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
const allBlocksCategories = [
  Z_Blocks,
  I_Blocks,
  T_Blocks,
  [...O_Blocks, ...Bonus_Blocks]
]

const COLORS = ['red', 'blue', 'yellow', 'silver', 'purple', 'greenyellow']
const randomInt = range => Math.ceil(Math.random() * range)
function generateBlockPositions () {
  const randomChoice =
    allBlocksCategories[randomInt(allBlocksCategories.length - 1)]
  const randomBlock = randomChoice[randomInt(randomChoice.length - 1)]
  return randomBlock
}

function generateStyle () {
  return {
    backgroundColor: COLORS[randomInt(COLORS.length - 1)]
  }
}

class App extends React.Component {
  constructor () {
    super()
    this.state = {
      allBlocks: [],
      allBlockClass: []
    }
  }
  startApp = level => {
    this.level_speed = level
    setTimeout(()=>{
      this.timeCounter = utils.RecordTime()
      this.newBlock()}, 3000)
    console.log('App started Successfully')
  }
  pauseApp = () => {
    this.state.allBlocks.forEach((block, index) => {
      if (block.active) {
        let activeBlockClass = this.state.allBlockClass.find(blockClass => {
          return blockClass.props.id === index
        })
        if (activeBlockClass.run) {
          activeBlockClass.pause()
          clearInterval(this.timeCounter)
        }
        else {
          activeBlockClass.resume()
          this.timeCounter = utils.RecordTime()
        }
      }
    })
  }
  componentDidMount () {
    this.keyEvent = document.addEventListener('keydown', this.userInputKeyDown)
  }
  componentWillUnmount () {
    document.removeEventListener(this.keyEvent)
    this.setState(() => {
      return { allBlocks: [], allBlockClass: [] }
    })
  }
  setMyState = func => {
    // Prevent repeating setState function
    let stop = false
    this.setState(
      prevState => {
        if (!stop) {
          return func(prevState)
        }
      },
      () => {
        stop = true
      }
    )
  }
  moveRight = () => {
    this.setMyState(prevState => {
      const old_state = Object.assign([], prevState.allBlocks)
      let newBlocksClass = prevState.allBlockClass
      const new_state = old_state.map((blockData, index) => {
        if (blockData.active) {
          if (!this.isItemAt(newBlocksClass[index], utils.DirectionRight)) {
            blockData.x_axis += BLOCK_INCREMENT
            if (!(index > this.state.allBlockClass.length - 1)) {
              newBlocksClass[index].moveBlockRight(BLOCK_INCREMENT)
            }
          }
        }
        return blockData
      })

      return { allBlocks: new_state, allBlockClass: newBlocksClass }
    })
  }

  moveLeft = () => {
    this.setMyState(prevState => {
      const old_state = prevState.allBlocks
      let newBlocksClass = prevState.allBlockClass
      const newBlockState = old_state.map((blockData, index) => {
        if (blockData.active) {
          if (!this.isItemAt(newBlocksClass[index], utils.DirectionLeft)) {
            blockData.x_axis -= BLOCK_INCREMENT
            if (!(index > this.state.allBlockClass.length - 1)) {
              newBlocksClass[index].moveBlockLeft(BLOCK_INCREMENT)
            }
          }
        }
        return blockData
      })

      return { allBlocks: newBlockState, allBlockClass: newBlocksClass }
    })
  }

  changeStructure = direction => {
    this.setMyState(prevState => {
      let newBlocksClass = prevState.allBlockClass
      const newBlockState = prevState.allBlocks.map((blockData, index) => {
        if (blockData.active) {
          let positionCategory = allBlocksCategories.find(blockPositions => {
            return blockPositions.find(
              position => position === blockData.positions
            )
          })
          let positionIndex = positionCategory.indexOf(blockData.positions)
          let new_positions
          if (direction === 'right') {
            new_positions =
              positionIndex + 1 === positionCategory.length
                ? positionCategory[0]
                : positionCategory[positionIndex + 1]
          } else if (direction === 'left') {
            new_positions =
              positionIndex === 0
                ? positionCategory[positionCategory.length - 1]
                : positionCategory[positionIndex - 1]
          }
          prevState.allBlockClass[index].resetPosition(new_positions)
          blockData.positions = new_positions
        }
        return blockData
      })
      return { allBlocks: newBlockState, allBlockClass: newBlocksClass }
    })
  }
  fall = () => {
    this.state.allBlocks.forEach((blockData, index) => {
      if (blockData.active) {
        let blockClass = this.state.allBlockClass.find(element => {
          return element.props.id === index
        })
        blockClass.resetTimer(10)
      }
    })
  }

  userInputKeyDown = e => {
    switch (e.key) {
      case 'ArrowLeft': {
        this.moveLeft()
        break
      }
      case 'ArrowRight': {
        this.moveRight()
        break
      }
      case 'ArrowUp': {
        this.changeStructure('right')
        break
      }
      case 'ArrowDown': {
        this.fall()
        break
      }
      default: {
        console.log('Move only with the arrow keys')
      }
    }
    e.Handled = true
  }
  addBlockStructure = (blockStructure, id) => {
    this.setState(prevState => {
      prevState.allBlockClass[id] = blockStructure
      return { allBlockClass: prevState.allBlockClass }
    })
  }
  newBlock = () => {
    let positions = generateBlockPositions()
    let multiple = utils.floor(
      (axis_props.Min_x_axis + axis_props.Max_x_axis) / 2,
      BLOCK_INCREMENT
    )
    const blockData = {
      positions: positions,
      active: true,
      x_axis: multiple * BLOCK_INCREMENT,
      y_axis: BLOCK_INCREMENT
    }
    this.setState(prevState => {
      let new_state = [...prevState.allBlocks]
      new_state.push(blockData)
      return { allBlocks: new_state }
    })
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
                check_block.style &&
                block &&
                block.style &&
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
  isItemAt = (check_blockStructure, direction) => {
    const check_structure = check_blockStructure.structure
    const filtered_structures = this.state.allBlockClass.filter(
      blockStructure => {
        return (
          blockStructure.props.id !== check_blockStructure.props.id &&
          direction(
            blockStructure.state.x_axis,
            check_blockStructure.state.x_axis
          ) &&
          ((blockStructure.state.y_axis >= check_blockStructure.state.y_axis &&
            blockStructure.state.y_axis <=
              check_blockStructure.state.y_axis + BLOCK_INCREMENT * 4) ||
            (check_blockStructure.state.y_axis >= blockStructure.state.y_axis &&
              check_blockStructure.state.y_axis <=
                blockStructure.state.y_axis + BLOCK_INCREMENT * 4))
        )
      }
    )
    if (!filtered_structures.length) return
    const structures = filtered_structures.map(
      blockStructure => blockStructure.structure
    )
    return structures.some(structure => {
      return structure.some(row => {
        return check_structure.some(check_row => {
          return row.some(block => {
            return check_row.some(check_block => {
              if (
                check_block &&
                check_block.style &&
                block &&
                block.style &&
                check_block.style.top === block.style.top
              ) {
                if (
                  direction(block.style.left, check_block.style.left) &&(
                  block.style.left === check_block.style.left + BLOCK_INCREMENT||
                  block.style.left + BLOCK_INCREMENT === check_block.style.left)
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

  checkIfLineFull = check_blockStructure => {
    // Check if particular line is field with blocks
    const check_structure = check_blockStructure.structure
    // filter components with a close y_axis as the check_blockStructure for better performance

    const filtered_structures = this.state.allBlockClass.filter(
      blockStructure => {
        return (
          blockStructure.props.id !== check_blockStructure.props.id &&
          ((blockStructure.state.y_axis >= check_blockStructure.state.y_axis &&
            blockStructure.state.y_axis <=
              check_blockStructure.state.y_axis + BLOCK_INCREMENT * 4) ||
            (check_blockStructure.state.y_axis >= blockStructure.state.y_axis &&
              check_blockStructure.state.y_axis <=
                blockStructure.state.y_axis + BLOCK_INCREMENT * 4))
        )
      }
    )
    if (!filtered_structures.length) return
    // map for only the structures
    const structures = filtered_structures.map(
      blockStructure => blockStructure.structure
    )
    const structuresOnLines = [check_structure, ...structures]
    // Array of columns and rows based on their axis
    const arrayLines = []
    structuresOnLines.forEach(structure => {
      structure.forEach(row => {
        row.forEach(block => {
          if (block.style) {
            // To calc position of blocks on the screen in relation to others
            // The reverse of -> axis_props.Min_x_axis + BLOCK_INCREMENT *
            let column_index =
              (block.style.left - axis_props.Min_x_axis) / BLOCK_INCREMENT - 1
            let row_index =
              (block.style.top - axis_props.Min_y_axis) / BLOCK_INCREMENT - 1
            if (arrayLines[row_index] === undefined) {
              // Create new row(line) and make this column_index the first element
              arrayLines[row_index] = []
            }
            // Add to an existing row(line)
            arrayLines[row_index][column_index] = {
              columns: column_index,
              block: block
            }
          }
        })
      })
    })
    arrayLines.forEach(line => {
      let deleteRow = false
      if (
        utils.filterEmpty(line).length >= 
        (axis_props.Max_x_axis - axis_props.Min_x_axis) / BLOCK_INCREMENT - 4
      ) {
        deleteRow = false
        for (let i = 0; i < line.length; i++) {
          let element = line[i]
          if (
            element &&
            axis_props.Min_x_axis + BLOCK_INCREMENT * (i + 1) ===
              element.block.style.left
          ) {
            deleteRow = true
            continue
          }
          deleteRow = false
          break
        }
      }
      if (deleteRow) {
        const line_axis = this.state.allBlockClass[line[0].block.parentId].state
          .y_axis
        line.forEach(element => {
          let structure = this.state.allBlockClass[element.block.parentId]
          structure.deleteBlock(element.block.location)
        })
        console.log('the line height is ', line_axis, line[0])
        this.state.allBlockClass.forEach(blockClass => {
          if (blockClass.state.y_axis < line_axis) {
            blockClass.EnterNewLine()
          }
        })
        let score_element = document.querySelector('#score')
        score_element.textContent = parseInt(score_element.textContent) + 1
        let line_element = document.querySelector('#lines')
        line_element.textContent = parseInt(line_element.textContent) - 1
      }
    })
  }

  inActivate = blockStructure => {
    const index = blockStructure.props.id
    this.setState(
      prevState => {
        let new_state = prevState.allBlocks
        new_state[index].active = false
        return { allBlocks: new_state }
      },
      () => {
        this.newBlock()
      }
    )
  }

  render () {
    return (
      <div
        className='myBody'
        style={{
          width: axis_props.Max_x_axis + BLOCK_INCREMENT,
          height: axis_props.Max_y_axis + BLOCK_INCREMENT * 4,
          padding: BLOCK_INCREMENT
        }}
      >
        <h4 className='font-monospace' id='start-message'>
          Welcome to Tetris Game
        </h4>
        {this.state.allBlocks.map((blockData, index) => {
          this.numberOfBlock++
          return (
            <CreateBlockStructure
              style={generateStyle()}
              x_axis={blockData.x_axis}
              y_axis={blockData.y_axis}
              positions={blockData.positions}
              level_speed={this.level_speed}
              key={index}
              id={index}
              run={blockData.active}
              shouldRun={this.shouldRun}
              inActivate={this.inActivate}
              addBlockStructure={this.addBlockStructure}
              checkIfLineFull={this.checkIfLineFull}
            />
          )
        })}
        <div style={{ display: 'none' }}>
          <button
            id='startApp-button-easy'
            onClick={() => {
              this.startApp(120)
            }}
          ></button>
          <button
            id='startApp-button-medium'
            onClick={() => {
              this.startApp(90)
            }}
          ></button>
          <button
            id='startApp-button-hard'
            onClick={() => {
              this.startApp(60)
            }}
          ></button>
          <button
            id='pause-app'
            onClick={() => {
              this.pauseApp()
            }}
          ></button>
        </div>
      </div>
    )
  }
}
export default App

export { axis_props }
