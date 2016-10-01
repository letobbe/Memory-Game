// Model

var model = {
	// Setting up the parameters
	level: 1, // Level always start at 1
	score: 0,
	brickClickCounter: 1, // Used to count what Brick that is the correct to click
	lives: 3
};

// Controller

var controller = {
	init: function() {
		// Start the rendering
		view.render();
	},
	startGame: function() {
		// Fire up the visual timer
		document.getElementById('timer').className += 'timerStart';
		// Add corresponding Timeout (3500ms)
		window.setTimeout(function() {
			// REset brickClickCounter to 1 so that only the brick with #1 is accpetable to click
			model.brickClickCounter = 1;
			// Remove the timer
			document.getElementById('timer').removeAttribute("class");
			// Add class to gameboard to start the game /hiding all the bricks
			document.getElementById('gameboard').className += ' gameStarted';
		}, 3500);
	},
	readLevel: function() {
		// Function to return the current level
		return model.level;
	},
	updateLevel: function() {
		// Function to update the level. As levels never increase and always increase by 1
		// it is not necesseary to provide input
		model.level += 1;
		// After updaing the level render the next level
		view.renderLevel();
	},
	readHighscore: function() {
		// Function to get the Highscore which is stored in localstorage
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
		// Function to update Highscore which is stored in localstorage
		// Check for localStorage support
		if (typeof(Storage) !== "undefined") {
			if (localStorage.memoryHighscore) {
				// Doubel check so that the current score is higher than the Highscore
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
		// Function to return the current score.
		return model.score;
	},
	updateScore: function(newScore) {
		model.score += newScore;
		// Update the current Highscore if score is higher than the highscore
		if (this.readHighscore() < model.score) {
			this.updateHighscore();
		}
		view.renderInfo();
	},
	readLives: function() {
		// Function to return current lives
		return model.lives;
	},
	updateLives: function(lifeChange) {
		// Function to uodate current lives. Takes an input for change
		model.lives += lifeChange;
		if (model.lives <= 0) {
			// If lives is less than or equal to zero you loose.
			alert("You lost the game");
			// Reset game and start over
			this.reset();
		} else {
			// Else just update the info.
			view.renderInfo();
		}
	},
	createBricks: function() {
		// Function to create an array of bricks
		// Calculate the rows
		var rows = Math.ceil(Math.sqrt(model.level));
		// The gameboard must be atleast 2x2
		if (rows < 2) {
			rows = 2;
		}
		// The gameboard is always square so if there are 2 rows there are 2 columns
		// Thus there are 4 bricks
		var bricks = rows * rows;
		var bricksArray = [];
		// Add as many zeros as there are bricks on the board
		// Remove the the level from that amount as the level indicates
		// how many bricks with numbers above 0 there should be.
		for (i = 0; i < bricks - model.level; i++) {
		    bricksArray.push(0);
		}

		// Append the bricks with numbers above zero to the array.
		for (i = 0; i < model.level; i++) {
			bricksArray.push(i + 1);
		}

		// Shuffle and randomize the order of the bricksArray.
	    for (var i = bricksArray.length-1; i >=0; i--) {

	        var randomIndex = Math.floor(Math.random()*(i+1));
	        var itemAtIndex = bricksArray[randomIndex];

	        bricksArray[randomIndex] = bricksArray[i];
	        bricksArray[i] = itemAtIndex;
	    }
	    // Send the bricksArray to the render function
		view.renderBricks(bricksArray);
	},
	brickClick: function() {
		// Function to detect clicks on bricks
		if (document.getElementById('gameboard').classList.contains('gameStarted')) {
			// Check first if the game has started, if not do nothing.
			if(this.getAttribute('data-number') == model.brickClickCounter) {
				// Check the bricks data-number attr and see if it is the correct brick to click
				this.className += ' correct';
				// Add a class correct to visualize that it is correct.
				controller.updateScore(100);
				// Update score
				if(model.brickClickCounter == controller.readLevel()) {
					// If it is the last brick in this level reward the player with more score
					controller.updateScore(500 + 50 * controller.readLevel());
					// This also means you passed the level so we run updateLevel.
					controller.updateLevel();
				}
				// Update the brickClickCounter with 1.
				model.brickClickCounter++;
			} else {
				// IF wrong add class to visualize it is the wrong brick
				this.className += ' wrong';
				// Update score
				controller.updateScore(-100);
				// Update lives
				controller.updateLives(-1);
			}
		}
	},
	reset: function() {
		// If the game is lost reset the model and rerun init().
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
	renderLevel: function() {
		// Render the level
		var backgroundColor = Math.floor(Math.random() * 4) + 1;
		// change background color
		document.getElementsByTagName('body')[0].className = 'background-' + backgroundColor;
		this.renderInfo();
		controller.createBricks();
	},
	renderInfo: function() {
		// Get the basic info
		this.showHighScore = document.getElementById('showHighScore');
		this.showLevel = document.getElementById('showLevel');
		this.showScore = document.getElementById('showScore');
		this.showLives = document.getElementById('showLives');
		// Render the basic info
		this.showHighScore.innerHTML = controller.readHighscore();
		this.showLevel.innerHTML = controller.readLevel();
		this.showScore.innerHTML = controller.readScore();
		this.showLives.innerHTML = controller.readLives();
	},
	renderBricks: function(bricksArray) {
		var gameBoard = document.getElementById('gameboard');
		// Remove all classes from the gameboard to reset it to starting position
		gameBoard.removeAttribute("class");
		while (gameBoard.hasChildNodes()) {
			// Check if gameBoard has any childnodes, if so remove them
  			gameBoard.removeChild(gameBoard.lastChild);
		}
		// Add class to gameboard in order to render the layout correctly depending on how many bricks there are.
		// This game doesn't take into account if you reach a layout that require a bigger gameboard than 6x6
		gameBoard.className += "gameboard-col-" + Math.sqrt(bricksArray.length);

		bricksArray.forEach( function(brick) {
			// For each brick create a new element
		    var gameBrickDiv = document.createElement('div');
		    gameBrickDiv.className = "gamebrick";
		    gameBrickDiv.dataset.number = brick;
			if(brick !== 0) {
				// If this brick has a number above 0 give it a visible number
				var gameBrickNumberDisplay = brick;
			} else {
				var gameBrickNumberDisplay = '';
			}
			// Append the number inside the div if it was bigger than zero
			gameBrickDiv.innerHTML = "<div>" + gameBrickNumberDisplay + "</div>";
			// Add click event to the brick
			gameBrickDiv.addEventListener('click', controller.brickClick, false);
			// Add the brick to the gameboard
			gameBoard.insertBefore( gameBrickDiv, gameBoard.firstChild );

		});
		// When done start the game
		controller.startGame();
	}
};

window.onload = function() {
	controller.init();
};