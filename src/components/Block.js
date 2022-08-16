import React from 'react'
import {axis_props} from "../App.js"

let BlockDefault_styles = {
  padding: '5px',
  backgroundColor: 'black',
  margin: '1px',
  border: 'solid white 1px',
  position: 'absolute'
}
const BLOCK_INCREMENT = 10

function Block (style) {
  return <div key={Math.random()} style={style}></div>
}
class CreateBlockComponent extends React.Component {
  constructor ({ x_axis, y_axis, style, positions,run }) {
    super()
    const Blocks = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]

    this.style = { ...BlockDefault_styles, ...style }

    positions.forEach(index => {
      Blocks[index[0]][index[1]] = Block
    })
    this.structure = Blocks

    this.positions = positions
    this.state = {
      x_axis: x_axis,
      y_axis: y_axis
    }
    console.log("this is run", run)
    if (run){
      this.timer = setInterval(this.stepDown,500)
    }
  }
  stepDown = () => {
    if (this.state.y_axis >= axis_props.Max_y_axis){
      clearInterval(this.timer)
      return
    }
    this.setState((prevState) => {
      return {y_axis: prevState.y_axis + BLOCK_INCREMENT}
    })
  }
  resetValues () {
    this.x_increment = 0
    this.y_increment = 0
  }
  newLine () {
    this.x_increment = 0
    this.y_increment += BLOCK_INCREMENT
  }
  applyBlock (block) {
    let block_component
    if (block) {
      let style = {
        ...this.style,
        top: this.state.y_axis + this.y_increment,
        left: this.state.x_axis + this.x_increment
      }
      block_component = block(style)
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
      </div>
    )
  }
}
export default CreateBlockComponent

export { BlockDefault_styles, BLOCK_INCREMENT }
