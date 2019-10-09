import React, { Component } from 'react'
import Board from './Board'

export default class Game extends Component {
    constructor(props){
        super(props);
        this.state= {
            historys: [
                {
                    squares: Array(20).fill(null).map(() => {return new Array(20).fill(null)}),
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
        }
    }

    /**
     * Function: Xử lý sự kiện click vào square
     * @param row: Dòng được click
     * @param col: Cột được click
     */
    handleClickSquare = (row, col) => {
        const historys = this.state.historys.slice(0, this.state.stepNumber + 1);
        const currentHistory = historys[this.state.stepNumber];
        let squares = [];
        for (let i = 0; i< currentHistory.squares.length; i++) {
            squares.push(currentHistory.squares[i].slice());
        }
        if (squares[row][col] === null && this.state.isFinish === false) {
            squares[row][col] = this.state.xIsNext ? 'X' : 'O';
            // Khi người chơi đánh 1 quân cờ thì list win sẽ bị reset
            this.setState({
                ...this.state,
                historys: historys.concat([
                    {
                      squares: squares,
                      row: row,
                      col: col
                    }
                ]),
                xIsNext: !this.state.xIsNext,
                stepNumber: historys.length,
                listWin: [
                    {
                        row: null,
                        col: null
                    }
                ]

            }, ()=>this.checkWinner(row, col));
            
        }
    }

    handleClickNewGame = () => {
        this.setState({
            historys: [
                {
                    squares: Array(20).fill(null).map(() => {return new Array(20).fill(null)}),
                    row: null,
                    col: null
                }
            ],
            xIsNext: true,
            isFinish: false,
            stepNumber: 0
        });
    }

    jumpTo = (step) => {
        let checkFinish = false;
        
        this.setState({
            ...this.state,
          stepNumber: step,
          xIsNext: (step % 2) === 0,
          isFinish: checkFinish,
          listWin: [{
              row: null,
              col: null
          }]
        }, ()=> {
            const historyLength = this.state.historys.length;
            if (historyLength - 1 === step && step !== 0) {
                const row = this.state.historys[historyLength - 1].row;
                const col = this.state.historys[historyLength-1].col;
                this.checkWinner(row, col);
            }
        });

        
    }

    /**
     * Kiểm tra người chơi vừa đánh đã thắng hay chưa
     */
    checkWinner = (row, col) => {
        const historyLength = this.state.historys.length;
        const squares = this.state.historys[historyLength - 1].squares;
        const valCheck = squares[row][col];
        let temp = 1;
        let chanDau = 0;
        let curRow = row;
        let curCol = col + 1;
        let listWin = [];
        
        listWin.push({row: row, col: col});
        // Duyệt hàng ngang sang phải
        while(curCol < 20) {
            // Kiểm tra xem ô hiện tại đã được đánh chưa
            if (squares[curRow][curCol] !== null) {
                // Nếu đã được đánh thì có bằng quân cờ hiện tại đang check không
                if (squares[curRow][curCol] === valCheck) {
                    temp++;
                    // Thêm vị trí quân cờ vào danh sách các quân cờ tạo nên chiến thắng
                    const location = {
                        row: curRow,
                        col: curCol
                    };
                    listWin.push(location);
                    curCol++;
                    
                } else { // Quân cờ khác, nghĩa là bị chặn
                    chanDau++;
                    break;
                }
            } else { // Chưa được đánh. Thoát vòng lặp
                break;
            }
        }

        curRow = row;
        curCol = col-1;
        // Duyệt hàng ngang sang trái
        while (curCol >= 0) {
            // Kiểm tra xem ô hiện tại đã được đánh chưa
            if (squares[curRow][curCol] !== null) {
                // Nếu đã được đánh thì có bằng quân cờ hiện tại đang check không
                if (squares[curRow][curCol] === valCheck) {
                    temp++;
                    // Thêm vị trí quân cờ vào danh sách các quân cờ tạo nên chiến thắng
                    const location = {
                        row: curRow,
                        col: curCol
                    };
                    listWin.push(location);
                    curCol--;
                    
                } else { // Quân cờ khác, nghĩa là bị chặn
                    chanDau++;
                    break;
                }
            } else { // Chưa được đánh. Thoát vòng lặp
                break;
            }
        }

        if (temp >= 5 && chanDau < 2) {
            this.setState({
                ...this.state,
                isFinish: true,
                listWin: listWin
            });
            return;
        }

        // Duyệt xong hàng ngang reset lại value
        temp = 1;
        chanDau = 0;
        curRow = row + 1;
        curCol = col;
        listWin = listWin.slice(0,1);
        // Duyệt hàng dọc xuống dưới
        while(curRow < 20) {
            // Kiểm tra xem ô hiện tại đã được đánh chưa
            if (squares[curRow][curCol] !== null) {
                // Nếu đã được đánh thì có bằng quân cờ hiện tại đang check không
                if (squares[curRow][curCol] === valCheck) {
                    temp++;
                    // Thêm vị trí quân cờ vào danh sách các quân cờ tạo nên chiến thắng
                    const location = {
                        row: curRow,
                        col: curCol
                    };
                    listWin.push(location);
                    curRow++;
                } else { // Quân cờ khác, nghĩa là bị chặn
                    chanDau++;
                    break;
                }
            } else { // Chưa được đánh. Thoát vòng lặp
                break;
            }
        }

        curRow = row - 1;
        curCol = col;
        // Duyệt hàng dọc lên trên
        while(curRow >= 0) {
            // Kiểm tra xem ô tiếp theo bên phải đã được đánh chưa
            if (squares[curRow][curCol] !== null) {
                // Nếu đã được đánh thì có bằng quân cờ hiện tại đang check không
                if (squares[curRow][curCol] === valCheck) {
                    temp++;
                    // Thêm vị trí quân cờ vào danh sách các quân cờ tạo nên chiến thắng
                    const location = {
                        row: curRow,
                        col: curCol
                    };
                    listWin.push(location);
                    curRow--;
                } else { // Quân cờ khác, nghĩa là bị chặn
                    chanDau++;
                    break;
                }
            } else { // Chưa được đánh. Thoát vòng lặp
                break;
            }
        }

        if (temp >= 5 && chanDau < 2) {
            this.setState({
                ...this.state,
                isFinish: true,
                listWin: listWin
            });
            return;
        }

        // Duyệt xong hàng dọc reset lại value để duyệt hàng chéo xuôi
        temp = 1;
        chanDau = 0;
        curRow = row + 1;
        curCol = col + 1;
        listWin = listWin.slice(0,1);
        // Duyệt hàng chéo xuôi xuống dưới
        while(curRow < 20 && curCol < 20) {
            // Kiểm tra xem ô tiếp theo bên phải đã được đánh chưa
            if (squares[curRow][curCol] !== null) {
                // Nếu đã được đánh thì có bằng quân cờ hiện tại đang check không
                if (squares[curRow][curCol] === valCheck) {
                    temp++;
                    // Thêm vị trí quân cờ vào danh sách các quân cờ tạo nên chiến thắng
                    const location = {
                        row: curRow,
                        col: curCol
                    };
                    listWin.push(location);
                    curRow++;
                    curCol++;
                } else { // Quân cờ khác, nghĩa là bị chặn
                    chanDau++;
                    break;
                }
            } else { // Chưa được đánh. Thoát vòng lặp
                break;
            }
        }

        curRow = row - 1;
        curCol = col - 1;
        // Duyệt hàng chéo xuôi lên trên
        while(curRow >= 0 && curCol >= 0) {
            // Kiểm tra xem ô tiếp theo bên phải đã được đánh chưa
            if (squares[curRow][curCol] !== null) {
                // Nếu đã được đánh thì có bằng quân cờ hiện tại đang check không
                if (squares[curRow][curCol] === valCheck) {
                    temp++;
                    // Thêm vị trí quân cờ vào danh sách các quân cờ tạo nên chiến thắng
                    const location = {
                        row: curRow,
                        col: curCol
                    };
                    listWin.push(location);
                    curRow--;
                    curCol--;
                } else { // Quân cờ khác, nghĩa là bị chặn
                    chanDau++;
                    break;
                }
            } else { // Chưa được đánh. Thoát vòng lặp
                break;
            }
        }

        if (temp >= 5 && chanDau < 2) {
            this.setState({
                ...this.state,
                isFinish: true,
                listWin: listWin
            });
            return;
        }

        // Duyệt xong hàng chéo xuôi reset lại value để duyệt hàng chéo ngược
        temp = 1;
        chanDau = 0;
        curRow = row - 1;
        curCol = col + 1;
        listWin = listWin.slice(0,1);
        // Duyệt hàng chéo ngược lên trên
        while(curRow >= 0 && curCol < 20) {
            // Kiểm tra xem ô tiếp theo bên phải đã được đánh chưa
            if (squares[curRow][curCol] !== null) {
                // Nếu đã được đánh thì có bằng quân cờ hiện tại đang check không
                if (squares[curRow][curCol] === valCheck) {
                    temp++;
                    // Thêm vị trí quân cờ vào danh sách các quân cờ tạo nên chiến thắng
                    const location = {
                        row: curRow,
                        col: curCol
                    };
                    listWin.push(location);
                    curRow--;
                    curCol++;
                } else { // Quân cờ khác, nghĩa là bị chặn
                    chanDau++;
                    break;
                }
            } else { // Chưa được đánh. Thoát vòng lặp
                break;
            }
        }

        curRow = row + 1;
        curCol = col - 1;
        // Duyệt hàng chéo ngược xuống dưới
        while(curRow < 20 && curCol >= 0) {
            // Kiểm tra xem ô tiếp theo bên phải đã được đánh chưa
            if (squares[curRow][curCol] !== null) {
                // Nếu đã được đánh thì có bằng quân cờ hiện tại đang check không
                if (squares[curRow][curCol] === valCheck) {
                    temp++;
                    // Thêm vị trí quân cờ vào danh sách các quân cờ tạo nên chiến thắng
                    const location = {
                        row: curRow,
                        col: curCol
                    };
                    listWin.push(location);
                    curRow++;
                    curCol--;
                } else { // Quân cờ khác, nghĩa là bị chặn
                    chanDau++;
                    break;
                }
            } else { // Chưa được đánh. Thoát vòng lặp
                break;
            }
        }

        if (temp >= 5 && chanDau < 2) {
            this.setState({
                ...this.state,
                isFinish: true,
                listWin: listWin
            });
            return;
        }
    }

    renderStatus = ()=> {
        if (this.state.isFinish === false) {
            return <p>Next player: {this.state.xIsNext ? 'X' : 'O'}</p>
        } else {
            // Người chiến thắng là người vừa đi xong.
            return <p>Winner player: {this.state.xIsNext ? 'O' : 'X'}</p>
        }
    }

    renderHistory = (isReverse) => {
        const historys = this.state.historys;
        // const current = history[this.state.stepNumber];
        // const winner = calculateWinner(current.squares);

        const moves = historys.map((step, move) => {
        const desc = move ?
            'Go to move #' + move + '(' + step.row + ',' + step.col + ')':
            'Go to game start';

            if (this.state.stepNumber === move) {
                return (
                    <li key={move}>
                        <button className = "btn btn-danger btn-margin" onClick={() => this.jumpTo(move)}>{desc}</button>
                    </li>
                )
            } else {
                return (
                    <li key={move}>
                        <button className = "btn btn-info btn-margin" onClick={() => this.jumpTo(move)}>{desc}</button>
                    </li>
                );
            }
           
        });
        if (isReverse === true) {
            return moves.reverse();
        }
        return moves;
    }

    handleClickReverse = () => {
        this.setState({
            ...this.state,
            isReverse: !this.state.isReverse
        })
    }

    render() {
        const historys = this.state.historys;
        const current = historys[this.state.stepNumber];
        const isReverse = this.state.isReverse;
        return ( 
            <div className="container">
                <div className="row">
                    <div className="col-lg-9">
                        <Board squares = {current.squares} listWin = {this.state.listWin} onClick= {(row, col) => {this.handleClickSquare(row, col)}}/>
                    </div>
                    <div className="col-lg-3">
                        <button type="button" className="btn btn-primary" onClick={()=>{this.handleClickNewGame()}}>New Game</button>
                        {this.renderStatus()}
                        <ol reversed={isReverse ? 'reverse' :''}>
                            {this.renderHistory(isReverse)}
                        </ol>
                        <button type="button" className="btn btn-warning btn-margin" onClick={()=>{this.handleClickReverse()}}>Reverse</button>
                    </div>
                </div>
                
            </div>
        )
    }
}