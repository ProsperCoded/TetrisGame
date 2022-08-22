document.addEventListener('DOMContentLoaded', () => {
  const buttons = ['easy', 'medium', 'hard']
  let GameTemplate = document.querySelector('#root').cloneNode(true)
  let backgroundImage = 'components/200w.gif'

  function StartGame (level) {
    let root_node = document.querySelector('#body_container').firstChild()
    let start_button = root_node.querySelector(`#startApp-button-${level}`)
    console.log('Starting app....')
    let start_message = root_node.querySelector('#start-message')
    start_message.style.display = 'block'
    start_message.style.animationPlayState = 'running'
    start_button.click()
    root_node.setAttribute('class', 'd-flex')
    document.querySelector('#body_container').style.backgroundImage = 'none'
    document.querySelector('#startGame').style.display = 'none'
    let status_table = document.querySelector('#Status-table')
    status_table.style.display = 'block'
    status_table.style.animationPlayState = 'running'
    document.querySelector('#level').textContent = level.toUpperCase()
    setTimeout(() => {
      start_message.style.display = 'none'
    }, 3000)
  }
  buttons.forEach(button_label => {
    let button = document.querySelector(`#${button_label}-button`)
    button.addEventListener('click', () => {
      StartGame(button_label)
    })
  })
})
