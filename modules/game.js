import { tetrominoes } from "./tetrominoes.js"
import { ROWS, COLUMNS } from "../index.js"

export class Game {
    area = [
        ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o',],
        ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o',],
        ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o',],
        ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o',],
        ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o',],
        ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o',],
        ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o',],
        ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o',],
        ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o',],
        ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o',],
        ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o',],
        ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o',],
        ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o',],
        ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o',],
        ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o',],
        ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o',],
        ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o',],
        ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o',],
        ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o',],
        ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o',],
    ];

    activeTetromine = this.createTetromino();
    nextTetromino = this.createTetromino();

    createTetromino() {
        const keys = Object.keys(tetrominoes)
        const letterTetromino = keys[Math.floor(Math.random() * keys.length)]
        const rotation = tetrominoes[letterTetromino]
        const rotationIndex = Math.floor(Math.random() * rotation.length)
        const block = rotation[rotationIndex]

        return {
            block,
            rotationIndex,
            rotation,
            x: 3,
            y: 0,
        }
    }

    changeTetromino() {
        this.activeTetromine = this.nextTetromino
        this.nextTetromino = this.createTetromino()
    }

    moveLeft() {
        if (this.checkOutPosition(this.activeTetromine.x - 1, this.activeTetromine.y)) {
            this.activeTetromine.x -= 1
        }
    }

    moveRight() {
        if (this.checkOutPosition(this.activeTetromine.x + 1, this.activeTetromine.y)) {
            this.activeTetromine.x += 1
        }
    }

    moveDown() {
        if (this.checkOutPosition(this.activeTetromine.x, this.activeTetromine.y + 1)) {
            this.activeTetromine.y += 1
        } else {
            this.stopMove()
        }
    }

    rotateTetromino() {
        this.activeTetromine.rotationIndex = 
            this.activeTetromine.rotationIndex < 3 ? 
            this.activeTetromine.rotationIndex + 1 : 0

        this.activeTetromine.block = 
            this.activeTetromine.rotation[this.activeTetromine.rotationIndex]    
        
        if (!this.checkOutPosition(this.activeTetromine.x, this.activeTetromine.y)) {
            this.activeTetromine.rotationIndex = 
                this.activeTetromine.rotationIndex > 0 ? 
                    this.activeTetromine.rotationIndex - 1 : 3

            this.activeTetromine.block = 
                this.activeTetromine.rotation[this.activeTetromine.rotationIndex]
        }
    }

    get viewArea() {
        const area = JSON.parse(JSON.stringify(this.area))
        const {x, y, block: tetromino} = this.activeTetromine

        for (let i = 0; i < tetromino.length; i++) {
            const row = tetromino[i]

            for (let j = 0; j < row.length; j++) {
                if (row[j] !== 'o') {
                    area[y + i][x + j] = tetromino[i][j]
                }
            }
        }
        return area
    }

    checkOutPosition(x, y) {
        const tetromino = this.activeTetromine.block
        for (let i = 0; i < tetromino.length; i++) {
            for (let j = 0; j < tetromino[i].length; j++) {
                if (tetromino[i][j] === 'o') {
                    continue
                }
                if (!this.area[y + i] ||
                    !this.area[y + i][x + j] ||
                    this.area[y + i][x + j] !== 'o') {
                    return false
                }
            }
        }
        return true
    }

    stopMove() {
        const {x, y, block: tetromino} = this.activeTetromine

        for (let i = 0; i < tetromino.length; i++) {
            const row = tetromino[i]
            for (let j = 0; j < row.length; j++) {
                if (row[j] !== 'o') {
                    this.area[y + i][x + j] = tetromino[i][j]
                }
            }
        }

        this.changeTetromino()
        this.clearRow()
    }

    clearRow() {
        const rows = []

        for (let i = ROWS - 1; i >= 0; i--) {
            let countBlock = 0

            for (let j = 0; j < COLUMNS; j++) {
                if (this.area[i][j] !== 'o') {
                    countBlock += 1
                }
            }

            if (!countBlock) break

            if (countBlock === COLUMNS) {
                rows.unshift(i)
            }
        }

        rows.forEach(i => {
            this.area.splice(i, 1)
            this.area.unshift(Array(COLUMNS).fill('o'))
        })
    }
}