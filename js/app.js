// Model

var model = {
	level: 1,
	score: 0,
	brickClickCounter: 1,
	gameBricksColumns: 2,
	gameBricksRows: 2,
	lives: 3
};

// Controller

var controller = {

	init: function() {
		view.render();
	},
	readLevel: function() {
		return model.level;
	},
	updateLevel: function() {
		model.level += 1;
		view.renderLevel();
	},
	readHighscore: function() {
		// Check for localStorage support
		if (typeof(Storage) !== "undefined") {
	    	if (localStorage.memoryHighscore) {
	    		return localStorage.memoryHighscore
	    	} else {
	    		return 0;
	    	}
	    }
	    alert('Your browser dont support highscore');
	},
	updateHighscore: function() {
		// Check for localStorage support
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
	},
	readScore: function() {
		return model.score;
	},
	updateScore: function(newScore) {
		model.score += newScore;
		view.renderInfo();
	},
	readLives: function() {
		return model.lives;
	},
	updateLives: function(lifeChange) {
		model.lives += lifeChange;
		if (model.lives <= 0) {
			alert("You lost the game");
			this.reset();
		} else {
			view.renderInfo();
		}
	},
	reset: function() {
		model.level = 1;
		model.score = 0;
		model.brickClickCounter = 1;
		model.gameBricksColumns = 2;
		model.gameBricksRows = 2;
		model.lives = 3;
		this.init();
	},
};

var view = {
	render: function() {
		this.renderLevel();
	},
	renderInfo: function() {
		this.showHighScore = document.getElementById('showHighScore');
		this.showLevel = document.getElementById('showLevel');
		this.showScore = document.getElementById('showScore');
		this.showLives = document.getElementById('showLives');

		this.showHighScore.innerHTML = controller.readHighscore();
		this.showLevel.innerHTML = controller.readLevel();
		this.showScore.innerHTML = controller.readScore();
		this.showLives.innerHTML = controller.readLives();
	},
	renderLevel: function() {
		this.renderInfo();
		renderGameBricks();
	}
};


function renderGameBricks() {
	var levelCounter = controller.readLevel();
	var gameBricks = model.gameBricksColumns * model.gameBricksRows;
	if (levelCounter > gameBricks) {
		var backgroundColor = Math.floor(Math.random() * 4) + 1;
		document.getElementsByTagName('body')[0].className = 'background-' + backgroundColor;
		controller.updateLives(1);
		model.gameBricksColumns++;
		model.gameBricksRows++;
		gameBricks = model.gameBricksColumns * model.gameBricksRows;
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
	gameBoard.className += "gameboard-col-" + model.gameBricksColumns;
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
		controller.updateScore(100);
		if(brickClickCounter == controller.readLevel()) {
			controller.updateScore(500 + 50 * controller.readLevel());
			controller.updateLevel();
			renderGameBricks();
		}
		brickClickCounter++;
	} else if(this.getAttribute('data-number') == 0 || this.getAttribute('data-number') > brickClickCounter) {
		this.className += ' wrong';
		controller.updateScore(-100);
		controller.updateLives(-1);
	}
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

window.onload = function() {
	controller.init();
}