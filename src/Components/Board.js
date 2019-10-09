import React, { Component } from 'react'
import Square from './Square'

export default class Board extends Component {
    renderSquare = (row, col, value ) => {
      let classSquare = 'square';
      let listWin = this.props.listWin;
      listWin.forEach(location => {
        if (location.row === row && location.col === col) {
          classSquare += ' winner';
        }
      });
        return <Square value={value} classSquare={classSquare} onClick={() => this.props.onClick(row, col)}/>
    }
    renderGameBoard = (boards) => {
        let board;
        board = boards.map((row, i) => {
            let cols = row.map((col, j) => {
                return <span key = {j}>{this.renderSquare(i, j, boards[i][j])}</span>
            })
            return <div key={i} className="board-row">{cols} </div>;
        })
        return board;
    }
  render() {
    return (
      <div>
        {this.renderGameBoard(this.props.squares)}
      </div>
    )
  }
}
