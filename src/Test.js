import React from "react"

class Test extends React.Component{
  constructor(){
    super()
    this.state = {
      keys_pressed:[]
    }
    document.addEventListener("keypress", this.StorKeyPressed)
  }
  StorKeyPressed = (e) =>{
    this.setState(prevState => {
      let new_state = [...prevState.keys_pressed,e.key]
      return {keys_pressed: new_state}
    })
  }
  render(){
    return (
      <div>You have pressed {this.state.keys_pressed.map((key)=>{
        return (key)
      })}</div>
    )
  }
}
export default Test