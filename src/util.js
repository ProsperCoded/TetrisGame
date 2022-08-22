export function RecordTime () {
  let ensureTwoDigits = (digit) => {
    let string = digit.toString()
    return (string.length !== 1) ? (string): ("0"+string)
  }
  let time = {
    hours: '00',
    minutes: '00',
    seconds: '00'
  }
  let timeCounter = setInterval(() => {
    let time_element = document.querySelector('#time');
    [time.hours, time.minutes, time.seconds] = time_element.textContent.split(':')
    if (parseInt(time.seconds) !== 59) {
      time.seconds = ensureTwoDigits(parseInt(time.seconds) + 1)
    } else if(parseInt(time.minutes) !== 59) {
      time.seconds = '00'
      time.minutes = ensureTwoDigits(parseInt(time.minutes) + 1)
    }else{
      time.seconds = "00"
      time.minutes = "00"
      time.hours = ensureTwoDigits(parseInt(time.hours) + 1)
    }
    document.querySelector(
      '#time'
    ).textContent = `${time.hours}:${time.minutes}:${time.seconds}`
    // time_element.textContent = parseInt
  }, 1000)
  return timeCounter
}
export function floor (number, by) {
  let remainder = number % by
  let wholeNumber = number - remainder
  return wholeNumber / by
}
export function DirectionLeft (option1, option2) {
  return option1 < option2
}
export function DirectionRight (option1, option2) {
  return option1 > option2
}
export function filterEmpty (array) {
  let store = []
  for (let i = 0; i < array.length; i++) {
    if (array[i] !== undefined) {
      store.push(array[i])
    }
  }
  return store
}
