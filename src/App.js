import React from 'react';
import './App.css';
import Game from './Components/Game';

function App() {
  return (
    <div className="App">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <h1 className="text-center"> Game Caro</h1>
          </div>
          <div className="col-lg-12">
            <Game />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
