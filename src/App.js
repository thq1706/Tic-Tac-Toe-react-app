import { useState } from 'react';

function Square({ value, onSquareClick, isWinningSquare }) {
  return (
    <button className="square" onClick={onSquareClick} style={isWinningSquare ? {backgroundColor : 'cyan'} : null}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, currentMove }) {

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares, i);
  }


  let isWinningSquare = false;
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner[0];
  } else if (currentMove === 9) {
    status = 'Draw';
  } else {
      status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }
  const board = [];

  for (let i = 0; i < 3; i++) {
    const row = [];
    for (let j = 0; j < 3; j++) {
      // Create a unique key for each square
      isWinningSquare = winner ? winner[1].includes(i * 3 + j) : false;
      const squareKey = i * 3 + j;
      row.push(<Square key={squareKey} value={squares[squareKey]} className="square" onSquareClick={() => handleClick(squareKey)} isWinningSquare={isWinningSquare}></Square>);
    }
    // Create a row div with the squares
    board.push(
      <div key={i} className="board-row">
        {row}
      </div>
    );
  }
  return (
    <>
      <div className="status">{status}</div>
      <div className="board">{board}</div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [coordHistory, setCoordHistory] = useState([Array(2).fill(null)]);

  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares, index) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    const nextCoord = [...coordHistory.slice(0, currentMove + 1), index];
    setHistory(nextHistory);
    setCoordHistory(nextCoord);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      const row = Math.floor(coordHistory[move] / 3) + 1;
      const col = coordHistory[move] % 3 + 1;
      description = `Go to move #${move} (${row},  ${col})`;
    } else {
      description = 'Go to game start';
    }
    console.log("Squares: " + move );
    console.log(squares);
    return (
      <li key={move}>
        {move === currentMove ? <div>You are at move #{currentMove}</div> : 
        <button onClick={() => jumpTo(move)}>{description}</button>}
      </li>
    );
  });

  if(!isAscending){
    moves.reverse();
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} currentMove={currentMove}/>
      </div>
      <div className="game-info">
        <button className='sort-button' onClick={() => setIsAscending(!isAscending)}>{isAscending ? 'Sort descending' : 'Sort ascending'}</button>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  return null;
}
