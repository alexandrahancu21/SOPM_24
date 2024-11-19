import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, isDraw }) { // Functionalitate de egalitate
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else if (isDraw) { // Egalitate
    status = 'It\'s a draw!';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [scoreX, setScoreX] = useState(0); // Portiunea de scor
  const [scoreO, setScoreO] = useState(0);
  const [isDraw, setIsDraw] = useState(false);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  // Functia care genereaza artificii
  function createFirework() {
    const fireworkContainer = document.querySelector('.fireworks'); //Documentul CSS
    fireworkContainer.style.display = 'block'; // Arata artificiile

    for (let i = 0; i < 100; i++) { // Vor fi create 100 de artificii de culori diferite
      const firework = document.createElement('div'); // La fiecare iteratie a buclei, se creeaza un element div care va reprezenta un artificiu
      firework.classList.add('firework'); // Adauga CSS ul pentru artificii
      firework.style.left = `${Math.random() * 100}%`; // Aceasta linie seteaza pozitia (de la stanga la dreapta) pe axa X (orizontala) a artificiului, in procente
      firework.style.top = `${Math.random() * 100}%`; // Aceasta linie seteaza pozitia (de sus in jos) pe axa Y (verticala) a artificiului, tot în procente
      firework.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`; // HSL (Hue, Saturation, Lightness), Math.random() * 360 genereaza un numar aleator intre 0 si 360 care reprezinta nuanta de culoare, 100% este saturarea maxima, 50% este luminozitatea medie
      fireworkContainer.appendChild(firework); // Adaugarea artificiului la containerul de artificii

      // Eliminăm artificiile după 3s
      setTimeout(() => {
        firework.remove();
        fireworkContainer.style.display = 'none'; // Ascundem artificiile
      }, 3000);
    }
  }

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);

    const winner = calculateWinner(nextSquares);
    const isDraw = !winner && nextSquares.every(square => square !== null);

    if (winner) { // Scor
      if (winner === 'X') {
        setScoreX(scoreX + 1);
      } else if (winner === 'O') {
        setScoreO(scoreO + 1);
      }
      createFirework(); // Activăm artificiile când câștigă cineva
      resetBoard();
    } else if (isDraw) {
      setIsDraw(true);
    }
  }

  function resetBoard() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    setIsDraw(false);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setIsDraw(false);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="fireworks"></div> {/* Container pentru artificii */}
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} isDraw={isDraw} />
      </div>
      <div className="game-info">
        <div>Score X: {scoreX} - Score O: {scoreO}</div>
        <ol>{moves}</ol>
      </div>
      {isDraw && <button onClick={resetBoard}>Restart Game</button>}
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
      return squares[a];
    }
  }
  return null;
}
