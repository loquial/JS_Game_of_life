function Game(x,y){
	this.state = 0;
	this.grid = 0;
	this.ctx;
	this.active = false;
	this.init = function(y,x){
		this.grid = new Grid();
		this.grid.init(y,x);
		this.ctx = document.getElementById('canvas').getContext('2d');
		this.ctx.fillStyle = 'white';
		this.ctx.lineWidth = 1;
		this.ctx.strokeStyle = 'white';
	}
	this.setCell = function(row,col,s){
		this.grid.cells[row][col].states[this.state] = s;
	}
	this.setGameState = function(arr){
		var cs = this.grid.cells;
		for(i=0;i<Math.min(arr.length,cs.length);i++){
			for(j=0;j<Math.min(arr[i].length,cs[i].length);j++){
				cs[i][j].states[this.state] = arr[i][j];
			}
		}
	}
	this.randomize = function(){
		var cs = this.grid.cells;
		if (this.state) this.state = 0;
		else this.state = 1;
		for(i=0;i<cs.length;i++){
			for(j=0;j<cs[i].length;j++){
				cs[i][j].states[this.state] = !! Math.round(Math.random() * 1);
			}
		}
		this.draw();
	}
	this.update = function(){
		f = this.updateCellFunction(this.state);
		this.grid.eachCell(f);
		if (this.state) this.state = 0;
		else this.state = 1;
		this.draw();
	}
	this.draw = function(){
		d = this.drawCellFunction(this.state);
		this.grid.eachCell(d);
	}
	this.drawCellFunction = function(s){
		var ctx = this.ctx;
		if (s) var p = 0;
		else var p = 1;
		var f = function(c){
			if (c.states[s]==c.states[p]){
				return;
			}
			if (c.states[s]){
				ctx.save();
				ctx.fillStyle = 'black';
				ctx.fillRect(c.colCoord*10,c.rowCoord*10,8,8);
				ctx.restore();
			}else{
				ctx.fillRect(c.colCoord*10,c.rowCoord*10,8,8);
			}
		}
		return f;
	}
	this.updateCellFunction = function(s){
		if (s) var n = 0;
		else var n = 1;
		var f = function(c){
			var l = c.getLivingNeighbors(s);
			if (c.states[s]){
				if((l==2)||(l==3)){
					c.states[n] = true;
				}else{
					c.states[n] = false;
				}
			}else{
				if(l==3){
					c.states[n] = true;
				}else{
					c.states[n] = false;
				}
			}
		};
		return f;
	}
}

function Grid(){
	this.cells;
	this.y;
	this.x;
	this.init = function(y,x){
		this.y=y;
		this.x=x;
		this.cells = Array(y);
		for (i = 0;i<y;i++){
			this.cells[i] = Array(x);
			for (j = 0;j<x;j++){
				this.cells[i][j] = new Cell(i,j);
			}
		}
		for (i = 0; i < y; i++){
			for (j = 0; j < x; j++){
				for(n = Math.max(0,i-1); n <= Math.min(i+1,y-1); n++){
					for(m = Math.max(0,j-1); m <= Math.min(j+1,x-1); m++){
						if ((n!=i)||(m!=j)){
							this.cells[i][j].neighbors.push(this.cells[n][m]);
						}
					}
				}

			}
		}
	}
	this.eachCell = function(f){
		for (i = 0; i < this.y; i++){
			for (j = 0; j < this.x; j++){
				f(this.cells[i][j]);
			}
		}
	}
}
function Cell(i,j){
	this.neighbors = []
	this.alive = false;
	this.states = [false,true];
	this.rowCoord = i;
	this.colCoord = j;
	this.getLivingNeighbors = function(s){
		var x = 0;
		this.neighbors.forEach(function(i){
			if(i.states[s]) x++;
		});
		return x;
	}
}

$("#randombtn").click(function(){
	game.randomize();
});
$("#playbtn").click(function(){
	if(game.active){
		window.clearInterval(gameTimer)
		game.active = false;
		$("#playbtn").html("Play");
	}else{
		gameTimer = setInterval(function(){game.update()},200);
		game.active = true;
		$("#playbtn").html("Pause");
	}
});
game = new Game();
game.init(50,100);
game.randomize();
gameTimer = setInterval(function(){game.update()},200);
game.active = true;