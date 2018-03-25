"use strict";

let playerTurn;
let playerSymbol;
let computerSymbol;
let disabled;

let game = {
    
    //Funkcija, su kuria surandame norimus elementus
    dom: function (selectorClass) {
        return document.querySelector(selectorClass);
    },

    //Pradinį vaizdą paledžianti funkcija
    init: function() {
        this.dom(".square1").innerText = "T";
        this.dom(".square2").innerText = "I";
        this.dom(".square3").innerText = "C";
        this.dom(".square4").innerText = "T";
        this.dom(".square5").innerText = "A";
        this.dom(".square6").innerText = "C";
        this.dom(".square7").innerText = "T";
        this.dom(".square8").innerText = "O";
        this.dom(".square9").innerText = "E";
    },
    
    //Po "X" ar "0" pasirinkimo, žaidimo pavadinimas išsivalo ir prasideda žaidimas
    start: function() {
        this.dom(".buttons").addEventListener("click", () => {
            for (let i = 0; i < this.dom(".frame").children.length; i++) {
                this.dom(".frame").children[i].innerText = "";
            }
            //Dingsta pasirinkimų mygtukai ir atsiranda užrašas kieno eilė žaisti
            this.dom(".choose-player").style.display = "none";
            this.dom(".buttons").style.display = "none";
            this.dom(".whose-turn").style.display = "block";

            //Žaidėjas pasirinko būti "X"
            if (event.target.getAttributeNode("class").value === "x") {
                console.log("Žaidėjas pasirinko būti X");
                playerSymbol = "X";
                computerSymbol = "0";
                //Žaidėjo stilius ir jo eilės užrašas
                this.whoStarts();
            //Žaidėjas pasirinko būti "0"
            } else if (event.target.getAttributeNode("class").value === "o") {
                console.log("Žaidėjas pasirinko būti 0");
                playerSymbol = "0";
                computerSymbol = "X";
                //Kompiuterio stilius ir jo eilės užrašas
                this.whoStarts();
            }
        });
    },

    //Atsitiktiniu būdu parenkama kas pradeda žaidimą 
    whoStarts: function() {
        let players = ["player", "computer"];
        let randomNumber = parseInt(Math.random() * 2);
        let whoStarts = players[randomNumber];
        //Jeigu pradeda žmogus
        if (whoStarts === "player") {
            playerTurn = true;
            this.whoseTurn(); //pritaikomas žmogaus stilius ir užrašas
        //Jeigu pradeda kompiuteris
        } else {
            playerTurn = false;
            //Po 1 sekundės uždelsimo
            setTimeout(() => { 
                //Kompiuteris atsitiktinai renkasi kur įrašyti savo pirmą simbolį, nes jis pradeda ir visi kvadratai dar tušti
                let squares = [];
                for (let i = 0; i < this.dom(".frame").children.length; i++) {
                    squares.push(this.dom(".frame").children[i]);
                }
                let randomNumber = parseInt(Math.random() * 9);
                squares[randomNumber].innerText = computerSymbol;
                playerTurn = true;
            }, 1000);
            //Dabar žmogaus eilė
            setTimeout(this.whoseTurn, 1500); //po 1,5 sekundės uždelsimo pritaikomas žmogaus stilius ir užrašas
        }
    },
    
    //Parašo kieno eilė ir pagal tai pakeičia stilių 
    whoseTurn: function() {
        //Žmogaus stilius ir jo paspaudimo nustatymai
        if (playerTurn) {
            game.dom(".whose-turn__who").innerText = "Your turn!";
            game.dom(".whose-turn__who").style.backgroundColor = "rgb(0,128,0)";
            //Žmogus gali rinktis kur spausti savo ženklą
                game.dom(".frame").addEventListener("click", (event) => {
                    //Žmogus gali paspausti tik vieną kartą, paskui renkasi kompiuteris
                    if (!disabled) {
                        //Žmogus gali spausti tik ant tuščio langelio
                        if (event.target.innerText === "") {
                            //Paspaudimas veikia tik ant ".frame" vaiko elemento
                            if (event.target !== event.currentTarget) {
                                console.log("žaidėjas paspaudė");
                                event.target.innerText = playerSymbol;
                                disabled = true;
                            }
                            event.stopPropagation();
                            playerTurn = false;
                            game.computerPlays(); //Kompiuterio eilė
                        } 
                    }
                });
        //Kompiuterio stilius
        } else {
            game.dom(".whose-turn__who").innerText = "Computer's turn!";
            game.dom(".whose-turn__who").style.backgroundColor = "rgb(0, 149, 240)";
            playerTurn = true;
        }
    },

    //Žaidžia kompiuteris
    computerPlays: function() {
        setTimeout(this.whoseTurn, 1000); //Po 1 sekundės atsiranda kompiuterio stilius
        setTimeout(() => { 
            //Po 1,5 sekundės kompiuteris atsitiktinai renkasi ir įrašo į kažkurį tuščią langelį savo simbolį
            let squares = [];
            for (let i = 0; i < this.dom(".frame").children.length; i++) {
                if (this.dom(".frame").children[i].innerText === "") {
                    squares.push(this.dom(".frame").children[i]);
                }
            }
            if (squares.length !== 0) {
                let randomNumber = parseInt(Math.random() * squares.length);
                squares[randomNumber].innerText = computerSymbol;
            } else {
                console.log("End of the game!");
            }
            playerTurn = true;
            disabled = false;
        }, 1500);
        //Po 1,5 sekundžių atsiranda žmogaus stilius ir jis gali paspausti ant langelio
        setTimeout(this.whoseTurn, 1500);
    }
};

game.init();
game.start();
game.whoseTurn();













