import React, { Component } from 'react';
import Square from './Square';

export default class Board extends Component {
  renderSquare = (row, col, value) => {
    let classSquare = 'square';
    const { listWin, onClick } = this.props;
    listWin.forEach(location => {
      if (location.row === row && location.col === col) {
        classSquare += ' winner';
      }
    });
    return (
      <Square
        value={value}
        classSquare={classSquare}
        onClick={() => onClick(row, col)}
      />
    );
  };

  renderGameBoard = boards => {
    const board = boards.map((row, i) => {
      const cols = row.map((col, j) => {
        const colIndex = j;
        const renderSquare = (
          <span key={colIndex}>{this.renderSquare(i, j, boards[i][j])}</span>
        );
        return renderSquare;
      });
      const rowIndex = i;
      return (
        <div key={rowIndex} className="board-row">
          {cols}
        </div>
      );
    });
    return board;
  };

  render() {
    const { squares } = this.props;
    return <div>{this.renderGameBoard(squares)}</div>;
  }
}
