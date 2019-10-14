import React, { Component } from 'react';
import Board from './Board';

export default class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      historys: [
        {
          squares: Array(20)
            .fill(null)
            .map(() => {
              return new Array(20).fill(null);
            }),
          row: null,
          col: null
        }
      ], // Lịch sử chơi cờ
      xIsNext: true, // Kiểm tra ai là người chơi tiếp theo
      isFinish: false, // Kiểm tra xem đã có người win chưa
      stepNumber: 0, // Nước đi hiện tại
      isReverse: false, // Biến kiểm tra đảo ngược danh sách nước đi
      listWin: [
        {
          row: null,
          col: null
        }
      ] // Danh sách vị trí những quân cờ tạo chiến thắng
    };
  }

  /**
   * Function: Xử lý sự kiện click vào square
   * @param row: Dòng được click
   * @param col: Cột được click
   */
  handleClickSquare = (row, col) => {
    const { historys, xIsNext, isFinish, stepNumber } = this.state;
    const newHistorys = historys.slice(0, stepNumber + 1);
    const currentHistory = historys[stepNumber];
    const squares = [];
    for (let i = 0; i < currentHistory.squares.length; i += 1) {
      squares.push(currentHistory.squares[i].slice());
    }
    if (squares[row][col] === null && isFinish === false) {
      squares[row][col] = xIsNext ? 'X' : 'O';
      // Khi người chơi đánh 1 quân cờ thì list win sẽ bị reset
      this.setState(
        {
          // ...this.state,
          historys: newHistorys.concat([
            {
              squares,
              row,
              col
            }
          ]),
          xIsNext: !xIsNext,
          stepNumber: historys.length,
          listWin: [
            {
              row: null,
              col: null
            }
          ]
        },
        () => this.checkWinner(row, col)
      );
    }
  };

  handleClickNewGame = () => {
    this.setState({
      historys: [
        {
          squares: Array(20)
            .fill(null)
            .map(() => {
              return new Array(20).fill(null);
            }),
          row: null,
          col: null
        }
      ],
      xIsNext: true,
      isFinish: false,
      stepNumber: 0,
      listWin: [
        {
          row: null,
          col: null
        }
      ] // Danh sách vị trí những quân cờ tạo chiến thắng
    });
  };

  jumpTo = step => {
    const checkFinish = false;

    this.setState(
      {
        // ...this.state,
        stepNumber: step,
        xIsNext: step % 2 === 0,
        isFinish: checkFinish,
        listWin: [
          {
            row: null,
            col: null
          }
        ]
      },
      () => {
        const { historys } = this.state;
        const historyLength = historys.length;
        if (historyLength - 1 === step && step !== 0) {
          const { row } = historys[historyLength - 1];
          const { col } = historys[historyLength - 1];
          this.checkWinner(row, col);
        }
      }
    );
  };

  /**
   * Kiểm tra người chơi vừa đánh đã thắng hay chưa
   */
  checkWinner = (row, col) => {
    const { historys } = this.state;
    const historyLength = historys.length;
    const { squares } = historys[historyLength - 1];
    const valCheck = squares[row][col];
    let temp = 1;
    let chanDau = 0;
    let curRow = row;
    let curCol = col + 1;
    let listWin = [];

    listWin.push({ row, col });
    // Duyệt hàng ngang sang phải
    while (curCol < 20) {
      // Kiểm tra xem ô hiện tại đã được đánh chưa
      if (squares[curRow][curCol] !== null) {
        // Nếu đã được đánh thì có bằng quân cờ hiện tại đang check không
        if (squares[curRow][curCol] === valCheck) {
          temp += 1;
          // Thêm vị trí quân cờ vào danh sách các quân cờ tạo nên chiến thắng
          const location = {
            row: curRow,
            col: curCol
          };
          listWin.push(location);
          curCol += 1;
        } else {
          // Quân cờ khác, nghĩa là bị chặn
          chanDau += 1;
          break;
        }
      } else {
        // Chưa được đánh. Thoát vòng lặp
        break;
      }
    }

    curRow = row;
    curCol = col - 1;
    // Duyệt hàng ngang sang trái
    while (curCol >= 0) {
      // Kiểm tra xem ô hiện tại đã được đánh chưa
      if (squares[curRow][curCol] !== null) {
        // Nếu đã được đánh thì có bằng quân cờ hiện tại đang check không
        if (squares[curRow][curCol] === valCheck) {
          temp += 1;
          // Thêm vị trí quân cờ vào danh sách các quân cờ tạo nên chiến thắng
          const location = {
            row: curRow,
            col: curCol
          };
          listWin.push(location);
          curCol -= 1;
        } else {
          // Quân cờ khác, nghĩa là bị chặn
          chanDau += 1;
          break;
        }
      } else {
        // Chưa được đánh. Thoát vòng lặp
        break;
      }
    }

    if (temp >= 5 && chanDau < 2) {
      this.setState({
        // ...this.state,
        isFinish: true,
        listWin
      });
      return;
    }

    // Duyệt xong hàng ngang reset lại value
    temp = 1;
    chanDau = 0;
    curRow = row + 1;
    curCol = col;
    listWin = listWin.slice(0, 1);
    // Duyệt hàng dọc xuống dưới
    while (curRow < 20) {
      // Kiểm tra xem ô hiện tại đã được đánh chưa
      if (squares[curRow][curCol] !== null) {
        // Nếu đã được đánh thì có bằng quân cờ hiện tại đang check không
        if (squares[curRow][curCol] === valCheck) {
          temp += 1;
          // Thêm vị trí quân cờ vào danh sách các quân cờ tạo nên chiến thắng
          const location = {
            row: curRow,
            col: curCol
          };
          listWin.push(location);
          curRow += 1;
        } else {
          // Quân cờ khác, nghĩa là bị chặn
          chanDau += 1;
          break;
        }
      } else {
        // Chưa được đánh. Thoát vòng lặp
        break;
      }
    }

    curRow = row - 1;
    curCol = col;
    // Duyệt hàng dọc lên trên
    while (curRow >= 0) {
      // Kiểm tra xem ô tiếp theo bên phải đã được đánh chưa
      if (squares[curRow][curCol] !== null) {
        // Nếu đã được đánh thì có bằng quân cờ hiện tại đang check không
        if (squares[curRow][curCol] === valCheck) {
          temp += 1;
          // Thêm vị trí quân cờ vào danh sách các quân cờ tạo nên chiến thắng
          const location = {
            row: curRow,
            col: curCol
          };
          listWin.push(location);
          curRow -= 1;
        } else {
          // Quân cờ khác, nghĩa là bị chặn
          chanDau += 1;
          break;
        }
      } else {
        // Chưa được đánh. Thoát vòng lặp
        break;
      }
    }

    if (temp >= 5 && chanDau < 2) {
      this.setState({
        // ...this.state,
        isFinish: true,
        listWin
      });
      return;
    }

    // Duyệt xong hàng dọc reset lại value để duyệt hàng chéo xuôi
    temp = 1;
    chanDau = 0;
    curRow = row + 1;
    curCol = col + 1;
    listWin = listWin.slice(0, 1);
    // Duyệt hàng chéo xuôi xuống dưới
    while (curRow < 20 && curCol < 20) {
      // Kiểm tra xem ô tiếp theo bên phải đã được đánh chưa
      if (squares[curRow][curCol] !== null) {
        // Nếu đã được đánh thì có bằng quân cờ hiện tại đang check không
        if (squares[curRow][curCol] === valCheck) {
          temp += 1;
          // Thêm vị trí quân cờ vào danh sách các quân cờ tạo nên chiến thắng
          const location = {
            row: curRow,
            col: curCol
          };
          listWin.push(location);
          curRow += 1;
          curCol += 1;
        } else {
          // Quân cờ khác, nghĩa là bị chặn
          chanDau += 1;
          break;
        }
      } else {
        // Chưa được đánh. Thoát vòng lặp
        break;
      }
    }

    curRow = row - 1;
    curCol = col - 1;
    // Duyệt hàng chéo xuôi lên trên
    while (curRow >= 0 && curCol >= 0) {
      // Kiểm tra xem ô tiếp theo bên phải đã được đánh chưa
      if (squares[curRow][curCol] !== null) {
        // Nếu đã được đánh thì có bằng quân cờ hiện tại đang check không
        if (squares[curRow][curCol] === valCheck) {
          temp += 1;
          // Thêm vị trí quân cờ vào danh sách các quân cờ tạo nên chiến thắng
          const location = {
            row: curRow,
            col: curCol
          };
          listWin.push(location);
          curRow -= 1;
          curCol -= 1;
        } else {
          // Quân cờ khác, nghĩa là bị chặn
          chanDau += 1;
          break;
        }
      } else {
        // Chưa được đánh. Thoát vòng lặp
        break;
      }
    }

    if (temp >= 5 && chanDau < 2) {
      this.setState({
        // ...this.state,
        isFinish: true,
        listWin
      });
      return;
    }

    // Duyệt xong hàng chéo xuôi reset lại value để duyệt hàng chéo ngược
    temp = 1;
    chanDau = 0;
    curRow = row - 1;
    curCol = col + 1;
    listWin = listWin.slice(0, 1);
    // Duyệt hàng chéo ngược lên trên
    while (curRow >= 0 && curCol < 20) {
      // Kiểm tra xem ô tiếp theo bên phải đã được đánh chưa
      if (squares[curRow][curCol] !== null) {
        // Nếu đã được đánh thì có bằng quân cờ hiện tại đang check không
        if (squares[curRow][curCol] === valCheck) {
          temp += 1;
          // Thêm vị trí quân cờ vào danh sách các quân cờ tạo nên chiến thắng
          const location = {
            row: curRow,
            col: curCol
          };
          listWin.push(location);
          curRow -= 1;
          curCol += 1;
        } else {
          // Quân cờ khác, nghĩa là bị chặn
          chanDau += 1;
          break;
        }
      } else {
        // Chưa được đánh. Thoát vòng lặp
        break;
      }
    }

    curRow = row + 1;
    curCol = col - 1;
    // Duyệt hàng chéo ngược xuống dưới
    while (curRow < 20 && curCol >= 0) {
      // Kiểm tra xem ô tiếp theo bên phải đã được đánh chưa
      if (squares[curRow][curCol] !== null) {
        // Nếu đã được đánh thì có bằng quân cờ hiện tại đang check không
        if (squares[curRow][curCol] === valCheck) {
          temp += 1;
          // Thêm vị trí quân cờ vào danh sách các quân cờ tạo nên chiến thắng
          const location = {
            row: curRow,
            col: curCol
          };
          listWin.push(location);
          curRow += 1;
          curCol -= 1;
        } else {
          // Quân cờ khác, nghĩa là bị chặn
          chanDau += 1;
          break;
        }
      } else {
        // Chưa được đánh. Thoát vòng lặp
        break;
      }
    }

    if (temp >= 5 && chanDau < 2) {
      this.setState({
        // ...this.state,
        isFinish: true,
        listWin
      });
    }
  };

  renderStatus = () => {
    const { isFinish, xIsNext } = this.state;
    if (isFinish === false) {
      return <p>Next player: {xIsNext ? 'X' : 'O'}</p>;
    }
    // Người chiến thắng là người vừa đi xong.
    return <p>Winner player: {xIsNext ? 'O' : 'X'}</p>;
  };

  renderHistory = isReverse => {
    const { historys, stepNumber } = this.state;
    // const current = history[this.state.stepNumber];
    // const winner = calculateWinner(current.squares);

    const moves = historys.map((step, move) => {
      const desc = move
        ? `Go to move #${move}(${step.row},${step.col})`
        : 'Go to game start';
      const indexHistory = move;
      if (stepNumber === move) {
        return (
          <li key={indexHistory}>
            <input
              type="button"
              className="btn btn-danger btn-margin"
              onClick={() => this.jumpTo(move)}
              value={desc}
            />
          </li>
        );
      }
      return (
        <li key={indexHistory}>
          <button
            type="button"
            className="btn btn-info btn-margin"
            onClick={() => this.jumpTo(move)}
          >
            {desc}
          </button>
        </li>
      );
    });
    if (isReverse === true) {
      return moves.reverse();
    }
    return moves;
  };

  handleClickReverse = () => {
    const { isReverse } = this.state;
    this.setState({
      // ...this.state,
      isReverse: !isReverse
    });
  };

  render() {
    const { historys, stepNumber, listWin } = this.state;
    const current = historys[stepNumber];
    const { isReverse } = this.state;
    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-9">
            <Board
              squares={current.squares}
              listWin={listWin}
              onClick={(row, col) => {
                this.handleClickSquare(row, col);
              }}
            />
          </div>
          <div className="col-lg-3">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                this.handleClickNewGame();
              }}
            >
              New Game
            </button>
            {this.renderStatus()}
            <ol reversed={isReverse ? 'reverse' : ''}>
              {this.renderHistory(isReverse)}
            </ol>
            <button
              type="button"
              className="btn btn-warning btn-margin"
              onClick={() => {
                this.handleClickReverse();
              }}
            >
              Reverse
            </button>
          </div>
        </div>
      </div>
    );
  }
}
