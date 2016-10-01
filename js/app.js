// Model

var model = {
	level: 1,
	score: 0,
	brickClickCounter: 1,
	lives: 3
};

// Controller

var controller = {
	init: function() {
		view.render();
	},
	startGame: function() {
		document.getElementById('timer').className += 'timerStart';
		window.setTimeout(function() {
			model.brickClickCounter = 1;
			document.getElementById('timer').removeAttribute("class");
			document.getElementById('gameboard').className += ' gameStarted';
			var classname = document.getElementsByClassName("gamebrick");
		}, 3500);
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
	    		return localStorage.memoryHighscore;
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
				if (localStorage.memoryHighscore < model.score) {
					localStorage.memoryHighscore = model.score;
				}
			} else {
			    localStorage.memoryHighscore = model.score;
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
		if (this.readHighscore() < model.score) {
			this.updateHighscore(model.score);
		}
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
	createBricks: function() {
		var rows = Math.ceil(Math.sqrt(model.level));
		if (rows < 2) {
			rows = 2;
		}
		var bricks = rows * rows;
		var bricksArray = [];
		for (i = 0; i < bricks - model.level; i++) {
		    bricksArray.push(0);
		}
		for (i = 0; i < model.level; i++) {
			bricksArray.push(i + 1);
		}
	    for (var i = bricksArray.length-1; i >=0; i--) {

	        var randomIndex = Math.floor(Math.random()*(i+1));
	        var itemAtIndex = bricksArray[randomIndex];

	        bricksArray[randomIndex] = bricksArray[i];
	        bricksArray[i] = itemAtIndex;
	    }
		view.renderBricks(bricksArray);
	},
	brickClick: function() {
		if (document.getElementById('gameboard').classList.contains('gameStarted')) {
			if(this.getAttribute('data-number') == model.brickClickCounter) {
				this.className += ' correct';
				controller.updateScore(100);
				if(model.brickClickCounter == controller.readLevel()) {
					controller.updateScore(500 + 50 * controller.readLevel());
					controller.updateLevel();
				}
				model.brickClickCounter++;
			} else if(this.getAttribute('data-number') == 0 || this.getAttribute('data-number') > model.brickClickCounter) {
				this.className += ' wrong';
				controller.updateScore(-100);
				controller.updateLives(-1);
			}
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
	renderBricks: function(bricksArray) {
		var gameBoard = document.getElementById('gameboard');
		gameBoard.removeAttribute("class");
		while (gameBoard.hasChildNodes()) {
  			gameBoard.removeChild(gameBoard.lastChild);
		}
		if (controller.readLevel() > bricksArray.length) {
			controller.updateLives(1);
		}
		gameBoard.className += "gameboard-col-" + Math.sqrt(bricksArray.length);
		bricksArray.forEach( function(brick) {
		    var gameBrickDiv = document.createElement('div');
		    gameBrickDiv.className = "gamebrick";
		    gameBrickDiv.dataset.number = brick;
			if(brick !== 0) {
				var gameBrickNumberDisplay = brick;
			} else {
				var gameBrickNumberDisplay = '';
			}
			gameBrickDiv.innerHTML = "<div>" + gameBrickNumberDisplay + "</div>";
			gameBrickDiv.addEventListener('click', controller.brickClick, false);
			gameBoard.insertBefore( gameBrickDiv, gameBoard.firstChild );

		});
		controller.startGame();
	},
	renderLevel: function() {
		var backgroundColor = Math.floor(Math.random() * 4) + 1;
		document.getElementsByTagName('body')[0].className = 'background-' + backgroundColor;
		this.renderInfo();
		controller.createBricks();
	}
};

window.onload = function() {
	controller.init();
};