import React from 'react'
import { axis_props } from '../App.js'
import { floor } from '../util.js'
let BlockDefault_styles = {
  padding: '7.5',
  backgroundColor: 'white',
  margin: '1px',
  border: 'solid white 1px',
  position: 'absolute',
  zIndex: '5',
  opacity: '1'
}
const BLOCK_INCREMENT = 15

class Block {
  constructor ({ key, location, parentId }) {
    this.style = undefined
    this.key = parseInt(key)
    this.parentId = parentId
    this.location = location
  }

  component () {
    return <div key={this.key} style={this.style}></div>
  }
}
const BlocksTemplate = () => [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]
]
class CreateBlockStructure extends React.Component {
  constructor (props) {
    super()

    this.style = { ...BlockDefault_styles, ...props.style }
    let Blocks = BlocksTemplate()
    props.positions.forEach(index => {
      Blocks[index[0]][index[1]] = new Block({
        key: `${index[0]}${index[1]}`,
        location: index,
        parentId: props.id
      })
    })

    this.props = props
    this.structure = Blocks

    this.positions = props.positions
    this.state = {
      x_axis: props.x_axis,
      y_axis: props.y_axis
    }
    this.run = props.run
  }
  componentDidMount () {
    if (this.run) {
      console.log('level speed', this.props.level_speed)
      this.timer = setInterval(this.stepDown, this.props.level_speed)
    }
  }
  deleteBlock = index => {
    this.structure[index[0]][index[1]] = 0

    const shiftUpperBlocks = (index, special) => {
      // Checking to see if there are blocks above this
      // looping inversely to get to the blocks "from bottom to top"
      if (special) {
        let useless = 0
      }
      for (let i = index[0]; i > 0; i--) {
        // Perform a switch for blocks above this block
        if (this.structure[i - 1][index[1]]) {
          let temp = this.structure[i][index[1]]

          this.structure[i][index[1]] = new Block({
            key: `${index[0]}${index[1]}`,
            location: index,
            parentId: this.props.id
          })

          this.structure[i - 1][index[1]] = temp
        } else {
          break
        }
      }
    }
    if (this.structure[index[0] - 1][index[1]]) {
      shiftUpperBlocks(index)
    }
    for (let i = index[1] + 1; i < 4; i++) {
      if (this.structure[index[0] - 1][i] && !this.structure[index[0]][i]) {
        shiftUpperBlocks([[index[0]], [i]], true)
      }
    }
    for (let i = index[1] - 1; i > 0; i--) {
      if (this.structure[index[0] - 1][i] && !this.structure[index[0]][i]) {
        shiftUpperBlocks([[index[0]], [i]], true)
      }
    }
    this.forceUpdate()
  }
  shouldComponentUpdate (nextProp, nextState) {
    if (
      nextState.x_axis === this.state.x_axis &&
      nextState.y_axis === this.state.y_axis
    ) {
      return false
    }
    return true
  }

  EnterNewLine = () => {
    if (
      this.state.y_axis + axis_props.Min_y_axis <
      axis_props.Max_y_axis + BLOCK_INCREMENT
    ) {
      this.setState(prevState => {
        return { y_axis: prevState.y_axis + BLOCK_INCREMENT }
      })
    }
  }
  stepDown = () => {
    if (!this.run) return
    if (
      this.state.y_axis + axis_props.Min_y_axis >=
        axis_props.Max_y_axis - BLOCK_INCREMENT ||
      this.props.shouldRun(this)
    ) {
      this.props.inActivate(this)
      this.props.checkIfLineFull(this)
      this.run = false
      clearInterval(this.timer)
      this.structure.forEach((row, index) => {
        if (
          row.some(block => {
            if (block) return true
            return false
          })
        ) {
          let y_axis = this.state.y_axis / BLOCK_INCREMENT - (4 - index)
          let line_element = document.querySelector('#lines')
          let multiple = floor(axis_props.Max_y_axis, BLOCK_INCREMENT)
          if (parseInt(line_element.textContent) < multiple - y_axis) {
            console.log(axis_props.Max_y_axis)

            line_element.textContent = multiple - y_axis
          }
          return
        }
      })
      return
    }
    this.EnterNewLine()
  }
  resetTimer = interval => {
    clearInterval(this.timer)
    if (this.run) {
      this.timer = setInterval(this.stepDown, interval)
    }
  }
  pause = () => {
    this.run = false
  }
  resume = () => {
    this.run = true
  }
  resetPosition (newPosition) {
    let Blocks = BlocksTemplate()
    newPosition.forEach(index => {
      Blocks[index[0]][index[1]] = new Block({
        key: `${index[0]}${index[1]}`,
        location: index,
        parentId: this.props.id
      })
    })

    this.structure = Blocks
    this.forceUpdate()
  }
  resetValues () {
    this.x_increment = 0
    this.y_increment = 0
  }
  newLine () {
    this.x_increment = 0
    this.y_increment += BLOCK_INCREMENT
  }
  moveBlockLeft (by) {
    if (this.state.x_axis > axis_props.Min_x_axis + BLOCK_INCREMENT) {
      this.setState(prevState => {
        return { x_axis: prevState.x_axis - by }
      })
    }
  }
  checkBlockAllBlocks = () => {
    for (let i = 3; i !== 0; i--) {
      for (let j = 0; j < 4; j++) {
        if (this.structure[j][i] && this.structure[j][i].style) {
          if (
            this.structure[j][i].style.left >=
            axis_props.Max_x_axis - BLOCK_INCREMENT * 2
          ) {
            return false
          }
        }
      }
    }
    return true
  }
  moveBlockRight (by) {
    if (
      this.state.x_axis < axis_props.Max_x_axis - BLOCK_INCREMENT * 2 &&
      this.checkBlockAllBlocks()
    ) {
      this.setState(prevState => {
        return { x_axis: prevState.x_axis + by }
      })
    }
  }
  applyBlock (block) {
    let block_component
    if (block) {
      let style = {
        ...this.style,
        top: this.state.y_axis + this.y_increment,
        left: this.state.x_axis + this.x_increment
      }
      block.style = style
      block_component = block.component()
    }
    this.x_increment += BLOCK_INCREMENT
    return block_component
  }

  render () {
    this.resetValues()
    return (
      <div>
        {this.structure[0].map(block => {
          return this.applyBlock(block)
        })}
        {this.newLine()}
        {this.structure[1].map(block => {
          return this.applyBlock(block)
        })}
        {this.newLine()}
        {this.structure[2].map(block => {
          return this.applyBlock(block)
        })}
        {this.newLine()}
        {this.structure[3].map(block => {
          return this.applyBlock(block)
        })}
        {this.props.addBlockStructure(this, this.props.id)}
      </div>
    )
  }
}
export default CreateBlockStructure

export { BlockDefault_styles, BLOCK_INCREMENT }
