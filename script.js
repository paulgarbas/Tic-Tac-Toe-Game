"use strict";

let playerTurn;
let playerSymbol;
let computerSymbol;
let disabled;
let endOfGame;
let cornerSquareFilled;

let game = {
    
    //Funkcija, su kuria surandame norimus elementus
    dom: function (selectorClass) {
        return document.querySelector(selectorClass);
    },

    //Pradinį vaizdą paledžianti funkcija
    init: function() {
        endOfGame = false;
        cornerSquareFilled = false;
        game.dom(".whose-turn").style.display = "none";
        game.dom(".whose-turn__who").classList.remove("player");
        game.dom(".whose-turn__who").classList.remove("computer");
        game.dom(".whose-turn__who").classList.remove("lost");
        game.dom(".whose-turn__who").classList.remove("won");
        game.dom(".whose-turn__who").classList.remove("draw");
        for (let i = 0; i < game.dom(".frame").children.length; i++) {
            game.dom(".frame").children[i].classList.remove("end-result");
        };
        game.dom(".choose-player").style.display = "block";
        game.dom(".choose-player").innerHTML = "Choose X or 0?";
        game.dom(".buttons").style.display = "grid";
        game.dom(".square1").innerHTML = "T";
        game.dom(".square2").innerHTML = "I";
        game.dom(".square3").innerHTML = "C";
        game.dom(".square4").innerHTML = "T";
        game.dom(".square5").innerHTML = "A";
        game.dom(".square6").innerHTML = "C";
        game.dom(".square7").innerHTML = "T";
        game.dom(".square8").innerHTML = "O";
        game.dom(".square9").innerHTML = "E";
    },
    
    //Po "X" ar "0" pasirinkimo, žaidimo pavadinimas išsivalo ir prasideda žaidimas
    start: function() {
        game.dom(".buttons").addEventListener("click", () => {
            for (let i = 0; i < game.dom(".frame").children.length; i++) {
                game.dom(".frame").children[i].innerHTML = "";
            }
            //Dingsta pasirinkimų mygtukai ir atsiranda užrašas kieno eilė žaisti
            game.dom(".choose-player").style.display = "none";
            game.dom(".buttons").style.display = "none";
            game.dom(".whose-turn").style.display = "block";
            
            //Žaidėjas pasirinko būti "X"
            if (event.target.getAttributeNode("class").value === "x") {
                playerSymbol = "X";
                computerSymbol = "0";
            //Žaidėjas pasirinko būti "0"
            } else if (event.target.getAttributeNode("class").value === "o") {
                playerSymbol = "0";
                computerSymbol = "X";
            }
            
            //Parenkama kas pradės žaidimą
            game.whoStarts();
        });
    },

    //Atsitiktiniu būdu parenkama kas pradeda žaidimą 
    whoStarts: function() {
        let randomNumber, whoStarts;
        let players = ["player", "computer"];
        randomNumber = parseInt(Math.random() * 2);
        whoStarts = players[randomNumber];
        //Jeigu pradeda žmogus
        if (whoStarts === "player") {
            playerTurn = true;
            game.whoseTurn(); //pritaikomas žmogaus stilius ir užrašas
        //Jeigu pradeda kompiuteris
        } else {
            playerTurn = false;
            game.whoseTurn(); //pritaikomas kompiuterio stilius ir užrašas
        }
    },
    
    //Parašo kieno eilė ir pagal tai pakeičia stilių 
    whoseTurn: function() {
        //Tikrina ar nėra laimėtojo
        game.youWon();
        //Tikrina ar nėra lygiųjų
        game.draw();
        //Jei ne žaidimo pabaiga
        if (!endOfGame) {
            //Žmogaus stilius ir jo paspaudimo nustatymai
            if (playerTurn) {
                game.dom(".whose-turn__who").innerHTML = "Your turn!";
                game.dom(".whose-turn__who").classList.remove("computer");
                game.dom(".whose-turn__who").classList.add("player");
                disabled = false; //Kad negalėtų paspausti antrą kartą per savo eilę
                game.playerPlays(); //Žaidėjas eilė žaisti
            //Kompiuterio stilius
            } else {
                game.dom(".whose-turn__who").innerHTML = "Computer's turn!";
                game.dom(".whose-turn__who").classList.remove("player");
                game.dom(".whose-turn__who").classList.add("computer");
                disabled = true;
                setTimeout(game.computerPlays, 500); //Kompiuterio eilė žaisti
            }
        }
    },

    //Žaidžia žaidėjas
    playerPlays: function() {
        //Žmogus gali rinktis kur spausti savo ženklą
        game.dom(".frame").addEventListener("click", (event) => {
            //Žmogus gali paspausti tik vieną kartą, paskui renkasi kompiuteris
            if (!disabled && !endOfGame) {
                //Žmogus gali spausti tik ant tuščio langelio
                if (event.target.innerHTML === "") {
                    //Paspaudimas veikia tik ant ".frame" vaiko elemento
                    if (event.target !== event.currentTarget) {
                        event.target.innerHTML = playerSymbol;
                        disabled = true;
                        playerTurn = false;  
                    }
                    event.stopPropagation();
                    setTimeout(game.whoseTurn, 500); //Kompiuterio eilė žaisti
                } 
            }
        });
    },

    //Žaidžia kompiuteris
    computerPlays: function() {
        //Jeigu vidurinis langelis yra tuščias - kompiuteris įrašo į jį savo ženklą
        if (game.dom(".square5").innerHTML === "") {
            game.dom(".square5").innerHTML = computerSymbol;
        //Jeigu žmogus įrašo savo simbolį į vidurinį langelį, kompiuteris įrašo savo simbolį į vieną iš keturių kampinių langelių (taip daro tik vieną kartą)
        } else if (!cornerSquareFilled && game.dom(".square5").innerHTML === playerSymbol) {
            let fourSquares = [game.dom(".square1"), game.dom(".square3"), game.dom(".square7"), game.dom(".square9")];
            let randomNumber = parseInt(Math.random() * 4);
            while (fourSquares[randomNumber].innerHTML !== "") {
                randomNumber = parseInt(Math.random() * 4);
            }
            fourSquares[randomNumber].innerHTML = computerSymbol;
            cornerSquareFilled = true; //Į kampinį langelį leidžia įrašyti tik 1 kartą
        } else {
            //Deda savo ženklą ten, kur yra 2 kompiuterio ženklai vienas šalia kito (tikslas - laimėti)
            if (game.dom(".square1").innerHTML === computerSymbol && game.dom(".square2").innerHTML === computerSymbol && game.dom(".square3").innerHTML === "") {
                game.dom(".square3").innerHTML = computerSymbol;
                game.youLost(game.dom(".square1"), game.dom(".square2"), game.dom(".square3"));
            } else if (game.dom(".square1").innerHTML === computerSymbol && game.dom(".square3").innerHTML === computerSymbol  && game.dom(".square2").innerHTML === "") {
                game.dom(".square2").innerHTML = computerSymbol;
                game.youLost(game.dom(".square1"), game.dom(".square3"), game.dom(".square2"));
            } else if (game.dom(".square2").innerHTML === computerSymbol && game.dom(".square3").innerHTML === computerSymbol  && game.dom(".square1").innerHTML === "") {
                game.dom(".square1").innerHTML = computerSymbol;
                game.youLost(game.dom(".square2"), game.dom(".square3"), game.dom(".square1"));
            } else if (game.dom(".square4").innerHTML === computerSymbol && game.dom(".square5").innerHTML === computerSymbol  && game.dom(".square6").innerHTML === "") {
                game.dom(".square6").innerHTML = computerSymbol;
                game.youLost(game.dom(".square4"), game.dom(".square5"), game.dom(".square6"));
            } else if (game.dom(".square4").innerHTML === computerSymbol && game.dom(".square6").innerHTML === computerSymbol  && game.dom(".square5").innerHTML === "") {
                game.dom(".square5").innerHTML = computerSymbol;
                game.youLost(game.dom(".square4"), game.dom(".square6"), game.dom(".square5"));
            } else if (game.dom(".square5").innerHTML === computerSymbol && game.dom(".square6").innerHTML === computerSymbol  && game.dom(".square4").innerHTML === "") {
                game.dom(".square4").innerHTML = computerSymbol;
                game.youLost(game.dom(".square5"), game.dom(".square6"), game.dom(".square4"));
            } else if (game.dom(".square7").innerHTML === computerSymbol && game.dom(".square8").innerHTML === computerSymbol  && game.dom(".square9").innerHTML === "") {
                game.dom(".square9").innerHTML = computerSymbol;
                game.youLost(game.dom(".square7"), game.dom(".square8"), game.dom(".square9"));
            } else if (game.dom(".square7").innerHTML === computerSymbol && game.dom(".square9").innerHTML === computerSymbol  && game.dom(".square8").innerHTML === "") {
                game.dom(".square8").innerHTML = computerSymbol;
                game.youLost(game.dom(".square7"), game.dom(".square9"), game.dom(".square8"));
            } else if (game.dom(".square8").innerHTML === computerSymbol && game.dom(".square9").innerHTML === computerSymbol  && game.dom(".square7").innerHTML === "") {
                game.dom(".square7").innerHTML = computerSymbol;
                game.youLost(game.dom(".square8"), game.dom(".square9"), game.dom(".square7"));
            } else if (game.dom(".square1").innerHTML === computerSymbol && game.dom(".square4").innerHTML === computerSymbol  && game.dom(".square7").innerHTML === "") {
                game.dom(".square7").innerHTML = computerSymbol;
                game.youLost(game.dom(".square1"), game.dom(".square4"), game.dom(".square7"));
            } else if (game.dom(".square1").innerHTML === computerSymbol && game.dom(".square7").innerHTML === computerSymbol  && game.dom(".square4").innerHTML === "") {
                game.dom(".square4").innerHTML = computerSymbol;
                game.youLost(game.dom(".square1"), game.dom(".square7"), game.dom(".square4"));
            } else if (game.dom(".square4").innerHTML === computerSymbol && game.dom(".square7").innerHTML === computerSymbol  && game.dom(".square1").innerHTML === "") {
                game.dom(".square1").innerHTML = computerSymbol;
                game.youLost(game.dom(".square4"), game.dom(".square7"), game.dom(".square1"));
            } else if (game.dom(".square2").innerHTML === computerSymbol && game.dom(".square5").innerHTML === computerSymbol  && game.dom(".square8").innerHTML === "") {
                game.dom(".square8").innerHTML = computerSymbol;
                game.youLost(game.dom(".square2"), game.dom(".square5"), game.dom(".square8"));
            } else if (game.dom(".square2").innerHTML === computerSymbol && game.dom(".square8").innerHTML === computerSymbol  && game.dom(".square5").innerHTML === "") {
                game.dom(".square5").innerHTML = computerSymbol;
                game.youLost(game.dom(".square2"), game.dom(".square8"), game.dom(".square5"));
            } else if (game.dom(".square5").innerHTML === computerSymbol && game.dom(".square8").innerHTML === computerSymbol  && game.dom(".square2").innerHTML === "") {
                game.dom(".square2").innerHTML = computerSymbol;
                game.youLost(game.dom(".square5"), game.dom(".square8"), game.dom(".square2"));
            } else if (game.dom(".square3").innerHTML === computerSymbol && game.dom(".square6").innerHTML === computerSymbol  && game.dom(".square9").innerHTML === "") {
                game.dom(".square9").innerHTML = computerSymbol;
                game.youLost(game.dom(".square3"), game.dom(".square6"), game.dom(".square9"));
            } else if (game.dom(".square3").innerHTML === computerSymbol && game.dom(".square9").innerHTML === computerSymbol  && game.dom(".square6").innerHTML === "") {
                game.dom(".square6").innerHTML = computerSymbol;
                game.youLost(game.dom(".square3"), game.dom(".square9"), game.dom(".square6"));
            } else if (game.dom(".square6").innerHTML === computerSymbol && game.dom(".square9").innerHTML === computerSymbol  && game.dom(".square3").innerHTML === "") {
                game.dom(".square3").innerHTML = computerSymbol;
                game.youLost(game.dom(".square6"), game.dom(".square9"), game.dom(".square3"));
            } else if (game.dom(".square1").innerHTML === computerSymbol && game.dom(".square5").innerHTML === computerSymbol  && game.dom(".square9").innerHTML === "") {
                game.dom(".square9").innerHTML = computerSymbol;
                game.youLost(game.dom(".square1"), game.dom(".square5"), game.dom(".square9"));
            } else if (game.dom(".square1").innerHTML === computerSymbol && game.dom(".square9").innerHTML === computerSymbol  && game.dom(".square5").innerHTML === "") {
                game.dom(".square5").innerHTML = computerSymbol;
                game.youLost(game.dom(".square1"), game.dom(".square9"), game.dom(".square5"));
            } else if (game.dom(".square5").innerHTML === computerSymbol && game.dom(".square9").innerHTML === computerSymbol  && game.dom(".square1").innerHTML === "") {
                game.dom(".square1").innerHTML = computerSymbol;
                game.youLost(game.dom(".square5"), game.dom(".square9"), game.dom(".square1"));
            } else if (game.dom(".square3").innerHTML === computerSymbol && game.dom(".square5").innerHTML === computerSymbol  && game.dom(".square7").innerHTML === "") {
                game.dom(".square7").innerHTML = computerSymbol;
                game.youLost(game.dom(".square3"), game.dom(".square5"), game.dom(".square7"));
            } else if (game.dom(".square3").innerHTML === computerSymbol && game.dom(".square7").innerHTML === computerSymbol  && game.dom(".square5").innerHTML === "") {
                game.dom(".square5").innerHTML = computerSymbol;
                game.youLost(game.dom(".square3"), game.dom(".square7"), game.dom(".square5"));
            } else if (game.dom(".square5").innerHTML === computerSymbol && game.dom(".square7").innerHTML === computerSymbol  && game.dom(".square3").innerHTML === "") {
                game.dom(".square3").innerHTML = computerSymbol;
                game.youLost(game.dom(".square5"), game.dom(".square7"), game.dom(".square3"));
            }
            //Deda savo ženklą ten, kur yra 2 žaidėjo ženklai vienas šalia kito (tikslas - apsiginti)
            else if (game.dom(".square1").innerHTML === playerSymbol && game.dom(".square2").innerHTML === playerSymbol && game.dom(".square3").innerHTML === "") {
                game.dom(".square3").innerHTML = computerSymbol;
            } else if (game.dom(".square1").innerHTML === playerSymbol && game.dom(".square3").innerHTML === playerSymbol  && game.dom(".square2").innerHTML === "") {
                game.dom(".square2").innerHTML = computerSymbol;
            } else if (game.dom(".square2").innerHTML === playerSymbol && game.dom(".square3").innerHTML === playerSymbol  && game.dom(".square1").innerHTML === "") {
                game.dom(".square1").innerHTML = computerSymbol;
            } else if (game.dom(".square4").innerHTML === playerSymbol && game.dom(".square5").innerHTML === playerSymbol  && game.dom(".square6").innerHTML === "") {
                game.dom(".square6").innerHTML = computerSymbol;
            } else if (game.dom(".square4").innerHTML === playerSymbol && game.dom(".square6").innerHTML === playerSymbol  && game.dom(".square5").innerHTML === "") {
                game.dom(".square5").innerHTML = computerSymbol;
            } else if (game.dom(".square5").innerHTML === playerSymbol && game.dom(".square6").innerHTML === playerSymbol  && game.dom(".square4").innerHTML === "") {
                game.dom(".square4").innerHTML = computerSymbol;
            } else if (game.dom(".square7").innerHTML === playerSymbol && game.dom(".square8").innerHTML === playerSymbol  && game.dom(".square9").innerHTML === "") {
                game.dom(".square9").innerHTML = computerSymbol;
            } else if (game.dom(".square7").innerHTML === playerSymbol && game.dom(".square9").innerHTML === playerSymbol  && game.dom(".square8").innerHTML === "") {
                game.dom(".square8").innerHTML = computerSymbol;
            } else if (game.dom(".square8").innerHTML === playerSymbol && game.dom(".square9").innerHTML === playerSymbol  && game.dom(".square7").innerHTML === "") {
                game.dom(".square7").innerHTML = computerSymbol;
            } else if (game.dom(".square1").innerHTML === playerSymbol && game.dom(".square4").innerHTML === playerSymbol  && game.dom(".square7").innerHTML === "") {
                game.dom(".square7").innerHTML = computerSymbol;
            } else if (game.dom(".square1").innerHTML === playerSymbol && game.dom(".square7").innerHTML === playerSymbol  && game.dom(".square4").innerHTML === "") {
                game.dom(".square4").innerHTML = computerSymbol;
            } else if (game.dom(".square4").innerHTML === playerSymbol && game.dom(".square7").innerHTML === playerSymbol  && game.dom(".square1").innerHTML === "") {
                game.dom(".square1").innerHTML = computerSymbol;
            } else if (game.dom(".square2").innerHTML === playerSymbol && game.dom(".square5").innerHTML === playerSymbol  && game.dom(".square8").innerHTML === "") {
                game.dom(".square8").innerHTML = computerSymbol;
            } else if (game.dom(".square2").innerHTML === playerSymbol && game.dom(".square8").innerHTML === playerSymbol  && game.dom(".square5").innerHTML === "") {
                game.dom(".square5").innerHTML = computerSymbol;
            } else if (game.dom(".square5").innerHTML === playerSymbol && game.dom(".square8").innerHTML === playerSymbol  && game.dom(".square2").innerHTML === "") {
                game.dom(".square2").innerHTML = computerSymbol;
            } else if (game.dom(".square3").innerHTML === playerSymbol && game.dom(".square6").innerHTML === playerSymbol  && game.dom(".square9").innerHTML === "") {
                game.dom(".square9").innerHTML = computerSymbol;
            } else if (game.dom(".square3").innerHTML === playerSymbol && game.dom(".square9").innerHTML === playerSymbol  && game.dom(".square6").innerHTML === "") {
                game.dom(".square6").innerHTML = computerSymbol;
            } else if (game.dom(".square6").innerHTML === playerSymbol && game.dom(".square9").innerHTML === playerSymbol  && game.dom(".square3").innerHTML === "") {
                game.dom(".square3").innerHTML = computerSymbol;
            } else if (game.dom(".square1").innerHTML === playerSymbol && game.dom(".square5").innerHTML === playerSymbol  && game.dom(".square9").innerHTML === "") {
                game.dom(".square9").innerHTML = computerSymbol;
            } else if (game.dom(".square1").innerHTML === playerSymbol && game.dom(".square9").innerHTML === playerSymbol  && game.dom(".square5").innerHTML === "") {
                game.dom(".square5").innerHTML = computerSymbol;
            } else if (game.dom(".square5").innerHTML === playerSymbol && game.dom(".square9").innerHTML === playerSymbol  && game.dom(".square1").innerHTML === "") {
                game.dom(".square1").innerHTML = computerSymbol;
            } else if (game.dom(".square3").innerHTML === playerSymbol && game.dom(".square5").innerHTML === playerSymbol  && game.dom(".square7").innerHTML === "") {
                game.dom(".square7").innerHTML = computerSymbol;
            } else if (game.dom(".square3").innerHTML === playerSymbol && game.dom(".square7").innerHTML === playerSymbol  && game.dom(".square5").innerHTML === "") {
                game.dom(".square5").innerHTML = computerSymbol;
            } else if (game.dom(".square5").innerHTML === playerSymbol && game.dom(".square7").innerHTML === playerSymbol  && game.dom(".square3").innerHTML === "") {
                game.dom(".square3").innerHTML = computerSymbol;
            } else {
                game.computerRandomPlay(); //Jei aukštesnės sąlygos neatitinka, tada langelį renkasi atsitiktinai
            }      
        }
        disabled = false;
        playerTurn = true;
        setTimeout(game.whoseTurn, 500);
    },
    
    //Kompiuteris atsitiktinai renkasi ir įrašo į kažkurį tuščią langelį savo simbolį
    computerRandomPlay: function() {
        let squares = [];
        let randomNumber;
        for (let i = 0; i < game.dom(".frame").children.length; i++) {
            if (game.dom(".frame").children[i].innerHTML === "") {
                squares.push(game.dom(".frame").children[i]);
            }
        }
        if (squares.length !== 0) {
            randomNumber = parseInt(Math.random() * squares.length);
            squares[randomNumber].innerHTML = computerSymbol;
        } 
    },

    //Žaidėjas pralošė
    youLost: function(first, second, third) {
        endOfGame = true;
        first.classList.add("end-result");
        second.classList.add("end-result");
        third.classList.add("end-result");
        game.dom(".whose-turn__who").innerHTML = "You lost!";
        game.dom(".whose-turn__who").classList.add("lost");
        setTimeout(game.init, 2000);
    }, 

    //Žaidėjas laimėjo
    youWon: function() {
        if (!endOfGame) {
            if (game.dom(".square1").innerHTML === playerSymbol && game.dom(".square2").innerHTML === playerSymbol && game.dom(".square3").innerHTML === playerSymbol) {
                endOfGame = true;
                game.dom(".square1").classList.add("end-result");
                game.dom(".square2").classList.add("end-result");
                game.dom(".square3").classList.add("end-result"); 
                game.dom(".whose-turn__who").innerHTML = "You won!";
                game.dom(".whose-turn__who").classList.add("won");
                setTimeout(game.init, 2000);  
            } else if (game.dom(".square4").innerHTML === playerSymbol && game.dom(".square5").innerHTML === playerSymbol && game.dom(".square6").innerHTML === playerSymbol) {
                endOfGame = true;
                game.dom(".square4").classList.add("end-result");
                game.dom(".square5").classList.add("end-result");
                game.dom(".square6").classList.add("end-result"); 
                game.dom(".whose-turn__who").innerHTML = "You won!";
                game.dom(".whose-turn__who").classList.add("won");
                setTimeout(game.init, 2000);  
            } else if (game.dom(".square7").innerHTML === playerSymbol && game.dom(".square8").innerHTML === playerSymbol && game.dom(".square9").innerHTML === playerSymbol) {
                endOfGame = true;
                game.dom(".square7").classList.add("end-result");
                game.dom(".square8").classList.add("end-result");
                game.dom(".square9").classList.add("end-result"); 
                game.dom(".whose-turn__who").innerHTML = "You won!";
                game.dom(".whose-turn__who").classList.add("won");
                setTimeout(game.init, 2000);  
            } else if (game.dom(".square1").innerHTML === playerSymbol && game.dom(".square4").innerHTML === playerSymbol && game.dom(".square7").innerHTML === playerSymbol) {
                endOfGame = true;
                game.dom(".square1").classList.add("end-result");
                game.dom(".square4").classList.add("end-result");
                game.dom(".square7").classList.add("end-result"); 
                game.dom(".whose-turn__who").innerHTML = "You won!";
                game.dom(".whose-turn__who").classList.add("won");
                setTimeout(game.init, 2000);  
            } else if (game.dom(".square2").innerHTML === playerSymbol && game.dom(".square5").innerHTML === playerSymbol && game.dom(".square8").innerHTML === playerSymbol) {
                endOfGame = true;
                game.dom(".square2").classList.add("end-result");
                game.dom(".square5").classList.add("end-result");
                game.dom(".square8").classList.add("end-result"); 
                game.dom(".whose-turn__who").innerHTML = "You won!";
                game.dom(".whose-turn__who").classList.add("won");
                setTimeout(game.init, 2000);  
            } else if (game.dom(".square3").innerHTML === playerSymbol && game.dom(".square6").innerHTML === playerSymbol && game.dom(".square9").innerHTML === playerSymbol) {
                endOfGame = true;
                game.dom(".square3").classList.add("end-result");
                game.dom(".square6").classList.add("end-result");
                game.dom(".square9").classList.add("end-result"); 
                game.dom(".whose-turn__who").innerHTML = "You won!";
                game.dom(".whose-turn__who").classList.add("won");
                setTimeout(game.init, 2000);  
            } else if (game.dom(".square1").innerHTML === playerSymbol && game.dom(".square5").innerHTML === playerSymbol && game.dom(".square9").innerHTML === playerSymbol) {
                endOfGame = true;
                game.dom(".square1").classList.add("end-result");
                game.dom(".square5").classList.add("end-result");
                game.dom(".square9").classList.add("end-result"); 
                game.dom(".whose-turn__who").innerHTML = "You won!";
                game.dom(".whose-turn__who").classList.add("won");
                setTimeout(game.init, 2000);  
            } else if (game.dom(".square3").innerHTML === playerSymbol && game.dom(".square5").innerHTML === playerSymbol && game.dom(".square7").innerHTML === playerSymbol) {
                endOfGame = true;
                game.dom(".square3").classList.add("end-result");
                game.dom(".square5").classList.add("end-result");
                game.dom(".square7").classList.add("end-result"); 
                game.dom(".whose-turn__who").innerHTML = "You won!";
                game.dom(".whose-turn__who").classList.add("won");
                setTimeout(game.init, 2000);  
            } 
        }
    },

    //Lygiosios
    draw: function() {
        if (!endOfGame) {
            let frameChildren = [];
            let full = true;
            for (let i = 0; i < game.dom(".frame").children.length; i++) {
                frameChildren.push(game.dom(".frame").children[i].innerHTML);
            }
            frameChildren.forEach(item => {
                if (item !== "X" && item !== "0") {
                    full = false;
                } 
            });
            if (full) {
                endOfGame = true;
                game.dom(".whose-turn__who").innerHTML = "Draw!";
                game.dom(".whose-turn__who").classList.add("draw");
                for(let i = 0; i < game.dom(".frame").children.length; i++) {
                    game.dom(".frame").children[i].classList.add("end-result");
                };
                setTimeout(game.init, 2000);
            }
        }
    }
};

game.init();
game.start();









