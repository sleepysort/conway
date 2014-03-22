/**
 * Conway's Game of Life Simulator
 *
 * Author: Shawn Lee
 * GitHub & Twitter: @sleepysort
 */

// Global variables; weird naming conventions...but whatever.
// TODO: Implement the BUFFER
var _GLOBALS = {
	BUFFER: 20,
	PAD_SIZE: 1,
	BOX_SIZE: 10,
	RUN: null,
	GRID_X: null,
	GRID_Y: null,
	GRID: null,
	INTERVAL: 50
};

// Given the current state of _GLOBAL.GRID, draw to the canvas with the
// given context object.
function drawGrid(ctx) {
	ctx.fillStyle = "#bbbbbb";
	ctx.fillRect(0,0,800,300);
	for (var i = 0; i < _GLOBALS.GRID_X + 2 * _GLOBALS.BUFFER; i++) {
		for (var j = 0; j < _GLOBALS.GRID_Y + 2 * _GLOBALS.BUFFER; j++) {
			if (_GLOBALS.GRID[i][j]) {
				ctx.fillStyle = "#111111";
			} else {
				ctx.fillStyle = "#eeeeee";
			}
			ctx.fillRect((i - _GLOBALS.BUFFER) * _GLOBALS.BOX_SIZE + _GLOBALS.PAD_SIZE, 
				(j - _GLOBALS.BUFFER) * _GLOBALS.BOX_SIZE + _GLOBALS.PAD_SIZE, 
				_GLOBALS.BOX_SIZE - 2 * _GLOBALS.PAD_SIZE, 
				_GLOBALS.BOX_SIZE - 2 * _GLOBALS.PAD_SIZE);
		}
	}
}


// Update the grid on mouse click.
function updateGrid(click) {
	var cX = Math.floor(click.x / _GLOBALS.BOX_SIZE) + _GLOBALS.BUFFER;
	var cY = Math.floor(click.y / _GLOBALS.BOX_SIZE) + _GLOBALS.BUFFER;
	_GLOBALS.GRID[cX][cY] = !_GLOBALS.GRID[cX][cY];
}

// Clears the grid
function clearGrid(canvas) {
	var maxX = canvas.width / _GLOBALS.BOX_SIZE;
	var maxY = canvas.height / _GLOBALS.BOX_SIZE;
	_GLOBALS.GRID_X = maxX;
	_GLOBALS.GRID_Y = maxY;
	_GLOBALS.GRID = new Array();
	for (var i = 0; i < maxX + 2 * _GLOBALS.BUFFER; i++) {
		_GLOBALS.GRID[i] = new Array();
		for (var j = 0; j< maxY + 2 * _GLOBALS.BUFFER; j++) {
			_GLOBALS.GRID[i][j] = false;
		}
	}
}

// Gets the grid coordinates on mouse click
function getClickXY(c, evt) {
	var bound = c.getBoundingClientRect();
	return {
		x: evt.clientX - bound.left,
		y: evt.clientY - bound.top
	};
}

// One step in the simulation
function step() {
	var grid = new Array();
	for (var i = 0; i < _GLOBALS.GRID_X + 2 * _GLOBALS.BUFFER; i++) {
		grid[i] = new Array();
		for (var j = 0; j < _GLOBALS.GRID_Y + 2 * _GLOBALS.BUFFER; j++) {
			var curr = getNeighborCount({x: i, y: j});
			if (curr < 2) {
				grid[i][j] = false;
			} else if (curr == 3) {
				grid[i][j] = true;
			} else if (curr > 3) {
				grid[i][j] = false;
			} else {
				grid[i][j] = _GLOBALS.GRID[i][j];
			}
		}
	}
	_GLOBALS.GRID = grid;
}

// Gets the number of neighbors at a given cell
function getNeighborCount(click) {
	var counts = 0;
	for (var i = click.x - 1; i <= click.x + 1; i++) {
		for (var j = click.y - 1; j <= click.y + 1; j++) {
			counts += ((i != click.x || j != click.y)
				&& (typeof _GLOBALS.GRID[i] != "undefined") 
				&& (typeof _GLOBALS.GRID[i][j] != "undefined") 
				&& _GLOBALS.GRID[i][j]) ? 1: 0;
		}
	}
	return counts;
}

// Anonymous setup function
(function() {
	var c = document.getElementById("grid");
	var ctx = c.getContext("2d");
	c.addEventListener('mousedown', function (e) {
		var click = getClickXY(c, e);
		updateGrid(click);
		drawGrid(ctx)
	});

	var startBtn = document.getElementById("start");
	var stopBtn = document.getElementById("stop");
	var stepBtn = document.getElementById("step");
	var clearBtn = document.getElementById("clear");

	startBtn.addEventListener('click', function(e) {
		console.log("start");
		startBtn.disabled = true;
		stopBtn.disabled = false;
		stepBtn.disabled = true;
		_GLOBALS.RUN = setInterval(function() {
			step();
			drawGrid(ctx);
		}, _GLOBALS.INTERVAL);
	});

	stopBtn.addEventListener('click', function(e) {
		console.log("stop");
		startBtn.disabled = false;
		stopBtn.disabled = true;
		stepBtn.disabled = false;
		window.clearInterval(_GLOBALS.RUN);
	});

	stepBtn.addEventListener('click', function(e) {
		console.log("step");
		step();
		drawGrid(ctx);
	});

	clearBtn.addEventListener('click', function(e) {
		console.log("clear");
		startBtn.disabled = false;
		stopBtn.disabled = true;
		stepBtn.disabled = false;
		window.clearInterval(_GLOBALS.RUN);
		clearGrid(c);
		drawGrid(ctx);
	});

	clearGrid(c);
	drawGrid(ctx);
})();