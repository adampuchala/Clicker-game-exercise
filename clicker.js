"use strict";

//Selectors
const container = document.querySelector(".container");
const startBtn = document.querySelector(".start__btn");
const resetBtn = document.querySelector(".reset__btn");
const countTimer = document.querySelector(".time");
const lifeDisplay = document.querySelector(".lifes");
const fieldDisplay = document.querySelector(".field");
const pointsDisplay = document.querySelector(".points");

class App {
  randomSquare;

  //interval IDs
  timeCounter;
  squareCounter_removeSquare;
  squareCounter_displaySquares;
  squareCounter_loseLife;

  constructor(squaresNum) {
    this.squaresNum = squaresNum;
    this._init();
    this.displaySquares(this.squaresNum);

    //Event listeners
    this.clickButtons = this._startGame.bind(this);
    this.clickSquares = this._fieldInteraction.bind(this);
    startBtn.addEventListener("click", this.clickButtons);
    resetBtn.addEventListener("click", this._resetButton.bind(this));
  }

  //Methods

  //Public

  displaySquares(squaresNum) {
    for (let i = 0; i < this.squaresNum; i++) {
      const square = document.createElement(`div`);
      square.classList.add("square");
      square.setAttribute("id", i + 1);
      fieldDisplay.appendChild(square);
    }
  }

  //Private

  _init() {
    this.time = 60;
    this.lifes = 3;
    this.points = 0;
    countTimer.textContent = this.time;
    lifeDisplay.textContent = this.lifes;
    pointsDisplay.textContent = this.points;
  }

  //Timer

  _countDownTimer() {
    const countDown = () => {
      --this.time;
      countTimer.textContent = this.time;
    };
    countDown();
    if (this.time === 0) {
      alert(`Gratulacje, Twój wynik to ${this.points}`);
      this._stopGame();
    }
  }

  _resetCountDownTimer() {
    clearInterval(this.timeCounter);
    this.timeCounter = setInterval(() => this._countDownTimer(), 1000);
    this._countDownTimer();
  }

  //Life

  _lifeCounter() {
    --this.lifes;
    if (this.lifes === 0) {
      alert("Straciłeś wszystkie życia!");
      this._stopGame();
    }
    lifeDisplay.textContent = this.lifes;
  }

  //Squares display

  _activeRandomSquare() {
    const randomNumber = Math.trunc(Math.random() * this.squaresNum + 1);
    this.randomSquare = document.getElementById(`${randomNumber}`);
    this.randomSquare.classList.add("active");
  }

  _removeActiveSquare() {
    this.squareCounter_loseLife = setTimeout(() => {
      if (this.randomSquare.classList.contains("active")) {
        this._lifeCounter();
      }
    }, 1200);
    this.squareCounter_removeSquare = setTimeout(() => {
      this.randomSquare.classList.remove("active");
    }, 1200);
  }

  _startDisplaySquares() {
    this.squareCounter_displaySquares = setInterval(() => {
      this._activeRandomSquare();
      this._removeActiveSquare();
    }, 1300);
  }

  // Game functions

  _stopGame() {
    clearInterval(this.timeCounter);
    clearInterval(this._countDownTimer);
    clearInterval(this.squareCounter_displaySquares);
    startBtn.addEventListener("click", this.clickButtons);
    fieldDisplay.removeEventListener("click", this.clickSquares);
    document.querySelectorAll(".square").forEach((square) => {
      square.classList.remove("active");
    });
  }

  _startGame() {
    this._init();
    this._stopGame();
    this._activeRandomSquare();
    this._startDisplaySquares();
    this._removeActiveSquare();
    this._resetCountDownTimer();
    startBtn.removeEventListener("click", this.clickButtons);
    startBtn.classList.add("inactive_button");
    fieldDisplay.addEventListener("click", this.clickSquares);
  }

  _fieldInteraction(e) {
    if (e.target.classList.contains("active")) {
      e.target.classList.remove("active");
      this.points++;
    } else if (
      !e.target.classList.contains("active") &&
      e.target.classList.contains("square")
    ) {
      this._lifeCounter();
    }
    pointsDisplay.textContent = this.points;
  }

  _resetButton() {
    this._init();
    this._stopGame();
  }
}

const app = new App(25);
