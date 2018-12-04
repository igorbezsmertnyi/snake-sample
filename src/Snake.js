export default class Snake {
  constructor() {
    this.GRID_SIZE = 20
    this.FPS = 10
    this.INTERVAL = 1000 / this.FPS
    this.AREA_WIDTH
    this.AREA_HEIGHT

    this.area
    this.ctx
    this.now
    this.delta

    this.area
    this.ctx

    this.now
    this.delta

    this.then = Date.now()
    this.crashed = false
    this.started = false
    this.score = 0

    this.snake = {
      x: 100,
      y: 100,
      dx: 1,
      dy: 0,
      tail: [],
      startLength: 4
    }
  
    this.food = {
      x: 160,
      y: 100
    }

    this.loop = this.loop.bind(this)
  }

  init() {
    this.area = document.getElementById('area')
    this.ctx = this.area.getContext('2d')

    this.AREA_WIDTH = this.calcAreaSize
    this.AREA_HEIGHT = this.calcAreaSize

    this.area.width = this.AREA_WIDTH
    this.area.height = this.AREA_HEIGHT

    this.fillArea()
  }

  start() {
    this.started = true
    this.crashed = false

    this.initialValue()
    this.changeDirectionListener()
    this.createSnake(4)
    this.loop()
  }

  pause() {
    this.started = false
  }

  resume() {
    this.started = true
  }

  loop() {
    if (this.crashed) return
  
    requestAnimationFrame(this.loop)

    if (!this.started) return

    this.now = Date.now()
    this.delta = this.now - this.then

    if (this.delta > this.INTERVAL) {
      this.then = this.now - (this.delta % this.INTERVAL)

      this.fillArea()
      this.moveSnake()
      this.drawSnake()
      this.drawFood()
      this.checkSnakeLocation()
    }
  }

  moveSnake() {
    this.snake.x += this.GRID_SIZE * this.snake.dx
    this.snake.y += this.GRID_SIZE * this.snake.dy

    this.snake.tail.unshift({ x: this.snake.x, y: this.snake.y })

    if (this.snake.tail.length > this.snake.startLength) {
      this.snake.tail.pop()
    }
  }

  drawSnake() {
    this.snake.tail.forEach(item => {
      this.ctx.lineWidth = 3
      this.ctx.fillStyle = 'green'
      this.ctx.strokeStyle = '#39ff14'
      this.ctx.fillRect(item.x, item.y, this.GRID_SIZE, this.GRID_SIZE)
      this.ctx.strokeRect(item.x, item.y, this.GRID_SIZE, this.GRID_SIZE)
    })
  }

  drawFood() {
    this.ctx.lineWidth = 1
    this.ctx.fillStyle = 'red'
    this.ctx.strokeStyle = 'darkred'
    this.ctx.fillRect(this.food.x, this.food.y, this.GRID_SIZE, this.GRID_SIZE)
    this.ctx.strokeRect(this.food.x, this.food.y, this.GRID_SIZE, this.GRID_SIZE)
  }

  createSnake(size) {
    [ ...Array(size).keys() ].forEach((_, index) => {
      const coordinates = [ this.snake.x - (this.GRID_SIZE * index), this.snake.y, this.GRID_SIZE, this.GRID_SIZE ]

      this.ctx.lineWidth = 3
      this.ctx.fillStyle = 'green'
      this.ctx.strokeStyle = '#39ff14'
      this.ctx.fillRect( ...coordinates )
      this.ctx.strokeRect( ...coordinates )
      
      this.snake.tail.push({ x: this.snake.x - (this.GRID_SIZE * index), y: this.snake.y })
    })
  }

  checkSnakeLocation() {
    if (this.snake.x === 0 || this.snake.x === (this.AREA_WIDTH - this.GRID_SIZE) ||
        this.snake.y === 0 || this.snake.y === (this.AREA_HEIGHT - this.GRID_SIZE)) {
      this.crashed = true
    }

    this.snake.tail.slice(1, this.snake.tail.length).forEach(item => {
      if (this.snake.tail[0].x === item.x &&
          this.snake.tail[0].y === item.y) {
        this.crashed = true
      }
    })

    if (this.snake.x === this.food.x && this.snake.y === this.food.y) {
      this.snake.tail.push({ x: this.food.x, y: this.food.y })

      this.food.x = this.newFoodPosition('x')
      this.food.y = this.newFoodPosition('y')
    }
  }

  newFoodPosition(positionFor) {
    const coorList = this.snake.tail.map(t => t[positionFor])
    let pos = this.randomPosition(this.GRID_SIZE, this.AREA_WIDTH - 2 * this.GRID_SIZE)

    while (coorList.includes(pos)) {
      pos = this.randomPosition(this.GRID_SIZE, this.AREA_WIDTH - 2 * this.GRID_SIZE)
    }

    return pos
  }

  changeDirectionListener() {
    window.addEventListener('keydown', ({ keyCode }) => {
      if (keyCode === 37 && this.snake.dx !== 1) {
        this.snake.dx = -1
        this.snake.dy = 0
      }

      if (keyCode === 38 && this.snake.dy !== 1) {
        this.snake.dx = 0
        this.snake.dy = -1
      }

      if (keyCode === 39 && this.snake.dx !== -1) {
        this.snake.dx = 1
        this.snake.dy = 0
      }

      if (keyCode === 40 && this.snake.dy !== -1) {
        this.snake.dx = 0
        this.snake.dy = 1
      }
    })
  }

  initialValue() {
    this.snake = {
      x: 100,
      y: 100,
      dx: 1,
      dy: 0,
      tail: [],
      startLength: 4
    }
  
    this.food = {
      x: 160,
      y: 100
    }
  }

  fillArea() {
    this.ctx.lineWidth = 10
    this.ctx.strokeStyle = '#4666FF'
    this.ctx.fillStyle = '#000'
    this.ctx.fillRect(0, 0, this.AREA_WIDTH, this.AREA_HEIGHT)
    this.ctx.strokeRect(0, 0, this.AREA_WIDTH, this.AREA_HEIGHT)
  }

  randomPosition(min, max) {
    return Math.round((Math.random() * (max - min) + min) / this.GRID_SIZE) * this.GRID_SIZE
  }

  get calcAreaSize() {
    return Math.floor(window.innerHeight / this.GRID_SIZE) * this.GRID_SIZE
  }
}
