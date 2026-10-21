// Игра «камень, ножницы, бумага». Версия с интерфейсом.
// Требования в README.md. Переиспользуй логику из консольной версии.

let rockElement = document.getElementById("rock");
let scissorsElement = document.getElementById("scissors");
let paperElement = document.getElementById("paper");
let compNumber = document.getElementById("comp-number");
let playerNumber = document.getElementById("player-number");
let humanScore = 0;
let compScore = 0;

// по-хорошему эту переменную нужно удалить и задать ее локально в функции getHumanChoice,
// а в обработчике событий передавать название id выбранной картинки в функцию getHumanChoice
let humanResult = "";

// можно сделать по-другому - найти список картинок по классу image или более специфичному для элементов игры, а потом с помощью, например,
// forEach пройтись по списку и задать им обработчики событий. Это будет даже лучше
rockElement.addEventListener("click", () => {
  humanResult = "rock";
  getHumanChoice();
});

scissorsElement.addEventListener("click", () => {
  humanResult = "scissors";
  getHumanChoice();
});

paperElement.addEventListener("click", () => {
  humanResult = "paper";
  getHumanChoice();
});

function getComputerChoice() {
  let choices = ["rock", "paper", "scissors"];

  return choices[Math.floor(Math.random() * choices.length)];
}

function getHumanChoice() {
  let computerResult = getComputerChoice();
  playRound(humanResult, computerResult);
  console.log(humanResult);
}

function playRound(humanChoice, computerChoice) {
  console.log(humanChoice, computerChoice);
  if (humanChoice === computerChoice) {
    console.log("Ничья!");
  }
  if (humanChoice === "rock" && computerChoice === "scissors") {
    console.log("Вы выиграли! Камень бьёт ножницы");
    humanScore++;
    playerNumber.textContent = humanScore;
  }
  // далее нужно расписать все возможные варианты и поведение. Изменение humanScore/compScore можно обернуть в отдельные функции (изменение значения + изменение элемента)
}

function playGame() {}

playGame();
