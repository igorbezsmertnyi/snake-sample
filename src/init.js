import Snake from './Snake'

const init = () => {
  const startBtn = document.getElementById('startButton')
  const pauseBtn = document.getElementById('pauseButton')
  const resumeBtn = document.getElementById('resumeButton')

  const snake = new Snake()

  snake.init()

  startBtn.addEventListener('click', () => { snake.start() })
  pauseBtn.addEventListener('click', () => { snake.pause() })
  resumeBtn.addEventListener('click', () => { snake.resume() })
}

export default init