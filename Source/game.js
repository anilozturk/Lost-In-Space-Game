$(document).ready(function(){
				
					var canvas = $('#game_canvas');
					var context = canvas.get(0).getContext('2d');
					
					var canvasWidth = canvas.width();
					var canvasHeight = canvas.height();
					
					var playGame;
					var numShapes;
					var shapesArray;
					var ship;
					var flame;
					var fire;
					var fireArray;
					var numFires = 0;
					var asteroids;
					var numAsteroids;
					var asteroidImg;
					var currentScore = 0;
					
					var clickDown;
					
					//references assigned for id representation
					var endGame = $('#gameOver');
					var restartButton = $('#restart');
					var menuButton = $('#menuButton');
					var startButton = $('#startButton');
					var menuScreen = $('#startScreen');
					var score = $('#score');
					var highScoreText = $('#highScore');
					var highS = $('#hS');
			
					var Shape = function(x,y,width,height,vX){// variable for ship firing and stars which are very close our canvas
						this.x = x;
						this.y = y;
						this.width = width;
						this.height = height;
						this.vX = vX;
					};
					
					var spaceShip = function(x,y,width,height,vX,vY){// variable which our ship made from
						this.x = x;
						this.y = y;
						this.width = width;
						this.height = height;
						this.vX = vX;
						this.vY = vY;
					};
					
					var asteroid = function(x,y,width,height,vX){// variable which we will use for creating asteroid material
						this.x = x;
						this.y = y;
						this.rotation = 0.1;
						this.width = width;
						this.height = height;
						this.halfWidth = width/2;
						this.halfHeight = height/2;
						this.vX = vX;
					};
					
					restartButton.click(function(){// triggered when we click restart button on menu screen
						startGame();
						restartButton.hide();
						menuButton.hide();
						currentScore = 0;
						scoreIt = setInterval(function(){//every 1000 ms we increment our current score by timer
							currentScore++;
							console.log(currentScore);
						},1000);
					});
					
					menuButton.click(function(){// triggered when we click menu button on menu screen
						playGame = false; // meaning is we wont play game after this click for a while
						menuScreen.show();
						startButton.show();
						restartButton.hide();
						menuButton.hide();
						currentScore = 0;
						highScoreText.show();
						highS.show();
					});
					
					startButton.click(function(){// triggered when we click start button on menu
						scoreIt = setInterval(function(){
							currentScore++;
						},1000);
						
						menuScreen.hide();
						restartButton.hide();
						menuButton.hide();
						startButton.hide();
						highScoreText.hide();
						highS.hide();
						playGame = false;
						startGame();
					});
					
					$(canvas).mousedown(function(e){// triggered when we press the mouse
						e.preventDefault();
						clickDown = true;	
					});
					
					$(canvas).mouseup(function(e){// triggered when we release the mouse
						e.preventDefault();
						clickDown = false;
					});	
					
					$(document).keydown(function(e){// keyboard event
						var key = e.which;
						if(key == 32){// if key is a space key (ASCII of space is '32')
							document.getElementById('fireSound').currentTime = 0;// if we press key repeatedly the audio will replay
							$('#fireSound').trigger("play");
							$('#numFires').html(++numFires);//we increment number of fire every time when we press space bar key
							fireArray.push(new Shape(myShip.x+50,myShip.y+10,25,25,3));//we add new fire to fire array in form of given shape size and velocity	
						}
					});
					
					function init(){
						restartButton.hide();
						menuButton.hide();
						highS.html(localStorage.getItem('lScore'));//we show high score that was taken from local storage in browser
					}
					
					function startGame(){
						playGame = true;//the game will be play
						numShapes = 40;
						shapesArray = new Array();//we allocate array for stars, its size is 40
						endGame.hide();
						
						numAsteroids = 5;
						asteroidsArray = new Array();// we allocate array for asteroids, its size is 5
						
						fireArray = new Array();// we allocate array for fires, but we do not know its size yet
						
						background = new Image();
						background.src = 'background2.png';
						
						ship = new Image();
						ship.src = 'ship.png';
						
						flame = new Image();
						flame.src = 'flame.png';
						
						fire = new Image();
						fire.src = 'fire.png';
						
						asteroidImg = new Image();
						asteroidImg.src = 'asteroid.png';
						
						myShip = new spaceShip(100,100,60,50,0,0);// we create our ship-it is main character-
						
						for (var i=0; i < numShapes; i++){// we assign values for stars' attributes and push them to array
							var x = Math.random()*canvasWidth;
							var y = Math.random()*canvasHeight;
							var width = 3;
							var height = 3;
							var vX = -4;
							
							shapesArray.push(new Shape(x,y,width,height,vX));
						};
						
						for (var i=0; i < numAsteroids; i++){// we assign values for asteroids' attributes and push them to array
							var x = canvasWidth+Math.random()*canvasWidth;
							var width = 60+Math.random()*40;
							var y = width+Math.random()*(canvasHeight-2*width);
							var height = 40+Math.random()*20;
							var vX = -3+Math.random()*(-3);
							
							asteroidsArray.push(new asteroid(x,y,width,height,vX));
						};
						
						animate();
					}
					
					function animate(){
					
						shapesLength = shapesArray.length;
						context.clearRect(0,0,canvasWidth,canvasHeight);// we clear canvas for redraw images with new coordinates
						context.drawImage(background,0,0,canvasWidth,canvasHeight);// we draw background again
						
						for (var i=0; i < shapesLength; i++){//for every stars we draw them on canvas with boundary controls
						
							tmpShape = shapesArray[i];
							
							context.fillStyle = 'rgb(255,255,255)';
							context.fillRect(tmpShape.x,tmpShape.y,tmpShape.width,tmpShape.height);
							
							tmpShape.x += tmpShape.vX;
						
							if (tmpShape.x+tmpShape.width < 0){
								tmpShape.x = canvasWidth+100;
								tmpShape.y = Math.random()*canvasHeight;
								tmpShape.vX = -4;
								
							};
						};
						
						myShip.y += myShip.vY;//our ship is falling !
						
						context.drawImage(ship,myShip.x,myShip.y,myShip.width,myShip.height);// we draw our ship
						
						if(clickDown){// if we pressing the mouse then our ship is raising to the air
							context.drawImage(flame,myShip.x-15,myShip.y+10,30,30);
						};
								
						asteroidsLength = asteroidsArray.length;
						for (var i=0; i < asteroidsLength; i++){// for every asteroids we draw them on canvas but we rotate them around at their central
																// we check for boundary controls and if our ship and any of asteroids collide then we stop the game
							tmpAsteroid = asteroidsArray[i];
							
							context.save();
							context.translate(tmpAsteroid.x+tmpAsteroid.halfWidth,tmpAsteroid.y+tmpAsteroid.halfHeight);
							context.rotate(tmpAsteroid.rotation);
							context.translate(0-tmpAsteroid.halfWidth,0-tmpAsteroid.halfHeight);
							context.drawImage(asteroidImg,0,0,tmpAsteroid.width,tmpAsteroid.height);
							context.restore();
							tmpAsteroid.rotation -= 0.1;
							tmpAsteroid.x += tmpAsteroid.vX;
							
							if(tmpAsteroid.x+tmpAsteroid.width < 0){
								tmpAsteroid.x = canvasWidth+Math.random()*canvasWidth;
								tmpAsteroid.y = Math.random()*canvasHeight;	
							}
							
							if(!(tmpAsteroid.x+tmpAsteroid.width-25 < myShip.x) && !(tmpAsteroid.y+tmpAsteroid.width-30 < myShip.y) &&
							   !(myShip.x+myShip.height-25 < tmpAsteroid.x) && !(myShip.y+myShip.height-30 < tmpAsteroid.y)){// collision detected
							   
									playGame = false;
									endGame.show();
									restartButton.show();
									menuButton.show();
									numFires = 0;
									clearInterval(scoreIt);
									
									if(currentScore > localStorage.getItem('lScore')){// is our new score higher than local score ??
										localStorage.setItem('lScore',currentScore);
										highS.html(localStorage.getItem('lScore'));
									};
							   }
						};
						
						firingLength = fireArray.length;
						for(var i=0; i < firingLength; i++){// for every fires we draw them on canvas
							tmpFire = fireArray[i];
							context.drawImage(fire,tmpFire.x,tmpFire.y,tmpFire.width,tmpFire.height);
							tmpFire.x += tmpFire.vX;
							
							if(tmpFire.x+tmpFire.width > canvasWidth){// if fire goes end of the screen then pop it
								fireArray = jQuery.grep(fireArray, function(value){
									return value != fireArray[i];
								});
								firingLength = fireArray.length;
							}
							
							asteroidsLength = asteroidsArray.length;
							for(var j=0; j <asteroidsLength; j++){
								tmpAsteroid = asteroidsArray[j];
								
								if (!(tmpFire.x+tmpFire.width < tmpAsteroid.x) && !(tmpFire.y+tmpFire.width < tmpAsteroid.y) &&
								    !(tmpAsteroid.x+tmpAsteroid.height < tmpFire.x) && !(tmpAsteroid.y+tmpAsteroid.height < tmpFire.y)){
										// if we hit an asteroid then this if will be triggered
										document.getElementById('destroySound').currentTime = 0;// if we press key repeatedly the audio will replay
										$('#destroySound').trigger("play");
										
										currentScore += 5;// we increment score 5 points
										
										asteroidsArray[j].x = canvasWidth+Math.random()*canvasWidth;
										asteroidsArray[j].y = asteroidsArray[j].width+Math.random()*(canvasHeight-2*asteroidsArray[j].width);// we do not destroy damaged asteroid just change its coordinates	
										
										fireArray = jQuery.grep(fireArray, function(value){// we pop fire from fire array which was hit the asteroid
											return value != fireArray[i];
										});
										
										firingLength = fireArray.length;// again we want to learn the length of the fire array because we remove one freshly
									};
							};
						};
						
						if(playGame){// run animate function every 33 milliseconds
							
							setTimeout(animate,33);
							score.html(currentScore);
						};
						
						// we set our ship's velocity relating to mouse press
						if(clickDown){
						
							myShip.vY = -3;
						}else{
						
							myShip.vY = 3;
						};
	
						if(myShip.y < 0){// our ship is not going out of bounds
						
							myShip.y = 0;
						};
						
						if(myShip.y+myShip.height > canvasHeight){// if our ship is touches the floor then we stop game
						
							playGame = false;
							endGame.show();
							restartButton.show();
							menuButton.show();
							numFires = 0;// we clear number of fires
							clearInterval(scoreIt);// clear timer because the game is not run any more
							
							if(currentScore > localStorage.getItem('lScore')){// is our new score higher than local score ??
								localStorage.setItem('lScore',currentScore);
								highS.html(localStorage.getItem('lScore'));
							};
						};
						
					};
					
					init();// go to init for make loop
					
				});