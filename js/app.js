var level = 1;
var score = 0;
var brickClickCounter = 1;
var gameBricksColumns = 2;
var	gameBricksRows = 2;
var lives = 0;
/* Rendering of Gamebricks
*/

function renderGameBricks() {
	showLevel.innerHTML = level;
	var levelCounter = level;
	var gameBricks = gameBricksColumns * gameBricksRows;
	if (levelCounter > gameBricks) {
		var backgroundColor = Math.floor(Math.random() * 4) + 1;
		document.getElementsByTagName('body')[0].className = 'background-' + backgroundColor;
		updateLives(1);
		gameBricksColumns++;
		gameBricksRows++;
		gameBricks = gameBricksColumns * gameBricksRows;
	}
	var gameBoard = document.getElementById('gameboard');

	firstBrickCount = 0;
	var gameBricksArray = [];
	// Adding the bricks that doesnt contain a number to the array
	while(firstBrickCount <= gameBricks - levelCounter - 1){
	   gameBricksArray[firstBrickCount++] = 0;
	}
	// Adding the bricks that do contain a number to the array
	while(0 < levelCounter){
	   gameBricksArray[firstBrickCount++] = levelCounter--;
	}
	// Shuffling the array so the bricks with numbers comes in an randomized order
	gameBricksArray = gameBricksArray.shuffle();

	// Resetting the class attribute so no css problem arise
	gameBoard.removeAttribute("class");
	// Add the css class for correct display of the bricks
	gameBoard.className += "gameboard-col-" + gameBricksColumns;
	// Removing all of the childs before adding new bricks
	while (gameBoard.hasChildNodes()) {
  		gameBoard.removeChild(gameBoard.lastChild);
	}

	// Rendering the bricks
	while(gameBricks > 0) {
		var gameBrickDiv = document.createElement('div');
		var gameBrickNumber = gameBricksArray[gameBricks - 1];
		gameBrickDiv.className = "gamebrick";
		gameBrickDiv.dataset.number = gameBrickNumber;
		if(gameBrickNumber != 0) { 
			var gameBrickNumberDisplay = gameBrickNumber;
		} else {
			var gameBrickNumberDisplay = '';
		}
		gameBrickDiv.innerHTML = "<div>" + gameBrickNumberDisplay + "</div>";
		gameBoard.insertBefore( gameBrickDiv, gameBoard.firstChild );
		gameBricks--;
	}
	document.getElementById('timer').className += 'timerStart';
	setTimeout(gameStart, 3500);
}

function gameStart() {
	brickClickCounter = 1;
	detectClicks();
	document.getElementById('timer').removeAttribute("class");
	document.getElementById('gameboard').className += ' gameStarted';

	var classname = document.getElementsByClassName("gamebrick");
}

function detectClicks() {
	var classname = document.getElementsByClassName("gamebrick");

	for (var i = 0; i < classname.length; i++) {
	    classname[i].addEventListener('click', clickAction, false);
	}
}

function clickAction() {
	var countThis = this.getAttribute('data-number');
	if(this.getAttribute('data-number') == brickClickCounter) {
		this.className += ' correct';
		updateScore(100);
		if(brickClickCounter == level) {
			updateScore(500 + 50 * level);
			level++;
			renderGameBricks();
		}
		brickClickCounter++;
	} else if(this.getAttribute('data-number') == 0 || this.getAttribute('data-number') > brickClickCounter) {
		this.className += ' wrong';
		updateScore(-100);
		updateLives(-1);
	}
}

function updateLives(lifeChange) {
	lives += lifeChange;
	showLives.innerHTML = lives;
	if(lives <= 0) {
		alert('You Lost!');
		setHighScore();
		resetGame();
	}
}
function updateScore(addToSCore) {
	score += addToSCore;
	showScore.innerHTML = score;
}
Array.prototype.shuffle = function() {
    var input = this;
     
    for (var i = input.length-1; i >=0; i--) {
     
        var randomIndex = Math.floor(Math.random()*(i+1)); 
        var itemAtIndex = input[randomIndex]; 
         
        input[randomIndex] = input[i]; 
        input[i] = itemAtIndex;
    }
    return input;
}
function checkHighScore() {
	if (typeof(Storage) !== "undefined") {
    // Code for localStorage/sessionStorage.
    	if (localStorage.memoryHighscore) {
    		showHighScore.innerHTML = localStorage.memoryHighscore
    	} else {
    		showHighScore.innerHTML = 0;
    	}
	} else {
	    alert('Your browser dont support highscore');
	}
}
function setHighScore() {
	if (typeof(Storage) !== "undefined") {
		if (localStorage.memoryHighscore) {
			if (localStorage.memoryHighscore < score) {
				localStorage.memoryHighscore = score;
			}
		} else {
		    localStorage.memoryHighscore = score;
		}
	} else {
		alert('The highscore can not be saved');
	}
}
function resetGame() {
	level = 1;
	score = 0;
	brickClickCounter = 1;
	gameBricksColumns = 2;
	gameBricksRows = 2;
	lives = 0;
	checkHighScore();
	updateScore(0);
	updateLives(3);
	renderGameBricks();
}

window.onload = function() {
	var showLevel = document.getElementById('showLevel');
	var showScore = document.getElementById('showScore');
	var showLives = document.getElementById('showLives');
	var showHighScore = document.getElementById('showHighScore');
	checkHighScore();
	updateScore(0);
	updateLives(3);
	renderGameBricks();
}