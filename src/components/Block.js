import React, { Component, useState } from 'react'
import { axis_props } from '../App.js'

let BlockDefault_styles = {
  padding: '5px',
  backgroundColor: 'black',
  margin: '1px',
  border: 'solid white 1px',
  position: 'absolute'
}
const BLOCK_INCREMENT = 10

class Block {
  constructor (index) {
    this.style = undefined
    this.index = parseInt(index)
    
  }

  component () {
    return <div key={this.index} style={this.style}></div>
  }
}

class CreateBlockStructure extends React.Component {
  constructor (props) {
    super()
    const Blocks = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]

    this.style = { ...BlockDefault_styles, ...props.style }

    props.positions.forEach(index => {
      Blocks[index[0]][index[1]] = new Block(`${index[0]}${index[1]}`)
    })
    this.props = props
    this.structure = Blocks

    this.positions = props.positions
    this.state = {
      x_axis: props.x_axis,
      y_axis: props.y_axis,
      
    }
    this.run = props.run
    if (this.run) {
      this.timer = setInterval(this.stepDown, 500)
    }

  }
  stepDown = () => {

    if ((this.state.y_axis >= axis_props.Max_y_axis)||(this.props.shouldRun(this))){
      clearInterval(this.timer)
      return
    }
    this.setState(prevState => {
      return { y_axis: prevState.y_axis + BLOCK_INCREMENT }
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
        {this.props.addBlockStructure(this,this.props.id)}
      </div>
    )
  }
}
export default CreateBlockStructure

export { BlockDefault_styles, BLOCK_INCREMENT }
