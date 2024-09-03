const prompt = require("prompt-sync")({ sigint: true });

// Game elements/assets constants
const GRASS = "░";
const HOLE = "O";
const CARROT = "^";
const PLAYER = "*";

// WIN / LOSE / OUT / QUIT messages constants
const WIN = "Congratulations, You Win!";                                                             
const LOST = "You dropped into the hole, You Lose!";                                                               
const OUT = "You went out of bounds, You Lose!";                                                               
const QUIT = "You quit the game";                                                              

// MAP ROWS, COLUMNS AND PERCENTAGE
const ROWS = 8;                                                                 // the game map will have 8 rows
const COLS = 5;                                                                 // the game map will have 5 cols
const PERCENT = .2;                                                          // % of holes for the map

class Field{

    // create the constructor
    constructor(field = [[]]){
        this.field = field;                                                    //this.field is a property of the class field
        this.gamePlay = false;                                                 //when the game starts, gameplay is false
        this.playerPosition = { x: 0, y: 0};
    }

    static welcomeMsg(msg){                                                     // static Method to show game's welcome message
        console.log(msg);
    }

    static generateField(ROWS, COLS, PERCENT) {                              // static method that generates and return a 2d map
        const map = [[]];

        for (let i = 0; i < ROWS; i++) {
            map[i] = [];                                                        //each row will have 5 columns
            for (let j = 0; j < COLS; j++) {
                map[i][j] = Math.random() > PERCENT ? GRASS : HOLE;            // per column in each row, generate grass (80%) or holes (20%)
                
            }
        }

        return map;
    }

    printField(){                                                               // print the game field (used to update during gameplay)       
        this.field.forEach(element => {
            console.log(element.join(""));
        });
    }

    updateGame(input){                                                          

      const userInput = String(input).toLowerCase();

      let { x, y } = this.playerPosition;                                       //sets player position on map depending on x and y
      let playerX = x;
      let playerY = y;

      if (userInput === "u"){                                                   //input commands for player movement
        playerY -= 1;
    } else if (userInput === "d"){
        playerY += 1;
    } else if (userInput === "l"){
        playerX -= 1;
    } else if (userInput === "r"){
        playerX += 1;
    };
    /*  
        end the game - set the gamePlay = false;
        inform the user that he step OUT of the game
        */
        if (playerX < 0 || playerY < 0 || playerX >= this.field[0].length || playerY >= this.field.length){
            console.log(OUT);
            this.endGame();
           };
    
    /*   
        end the game - set gamePlay = false;
        inform the user that he WIN the game 
        */
       const currentPos = this.field[playerY][playerX];

       if (currentPos === CARROT){
        console.log(WIN);
        this.endGame();
       };

        /* 
        end the game - set the gamePlay = false;
        inform the user that he LOST the game
        */
       if (currentPos === HOLE){
        console.log(LOST);
        this.endGame();
       };

        /*  
        end the game - set the gamePlay = false;
        inform the user that he QUIT the game
        */
       if (userInput === "q"){
            this.quitGame();
       };


        /* 
        update the display to show the user had moved to the new area on map
        ask for player's next move as well 
        */
       this.field[playerY][playerX] = PLAYER;
       this.field[y][x] = GRASS;                                               //replaces the previous position the player was on to grass
       this.playerPosition = {
        x: playerX,
        y: playerY
       };

    }

    plantCarrot(){                                                              //sets carrot to a random position within the field
        const x = Math.floor(Math.random() * (ROWS - 1)) + 1;
        const y = Math.floor(Math.random() * (COLS - 1)) + 1;
        this.field[x][y] = CARROT;
    };

    startGame(){                                                                
        this.gamePlay = true;                                                   //sets gameplay to true to keep the game running

        this.field[0][0] = PLAYER;

        this.plantCarrot();

        while (this.gamePlay) {

            this.printField();                                                  //shows the map each time user input

            let flagInvalid = false;
            console.log("(u)p, (d)own, (l)eft, (r)ight, (q)uit");
            const input = prompt('Which Way?');                                 //  await for user input for up down left right or quit
            switch (input.toLowerCase()) {                                      // acknowledging user input 
                case "u":
                    console.log('up');
                    break;
                case "d":
                    console.log('down');
                    break;
                case "l":
                    console.log('left');
                    break;
                case "r":
                    console.log('right');
                    break;
                case "q":
                    console.log('quit');
                    break;
                default:
                    console.log('Invalid input');
                    flagInvalid = !flagInvalid;
                    break;
            }

            if (!flagInvalid){                                                             // only if flaginvalid is false then update game
                this.updateGame(input);
            }

        }
    }

    endGame(){                                                                  
        this.gamePlay = false; // set property gamePlay to false
        const playAgain = prompt("Would you like to play again? (y/n): ").toLowerCase();
        if (playAgain === 'y') {
            const newField = Field.generateField(ROWS, COLS, PERCENT);
            const newGame = new Field(newField);
            newGame.startGame();
        } else {
            console.log("Thanks for playing!");
            process.exit();
        }
    }

    quitGame(){
        console.log(QUIT);
        this.endGame();
    }

}



// Instantiate a new instance of Field Class
const createField = Field.generateField(ROWS, COLS, PERCENT);                //calls Field's class static method to generate 2d field
//console.log(createField);                                                     //to test field
const gameField = new Field(createField);

Field.welcomeMsg("Welcome to Find Your Hat!\n**************************************************\n");

gameField.startGame();
