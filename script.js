"use strict";

let playerTurn;
let playerSymbol;

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

            //Žaidėjo eilė
            if (event.target.getAttributeNode("class").value === "x") {
                console.log("paspaustas x");
                playerTurn = true;
                playerSymbol = "x";
                //Žaidėjo stilius ir jo eilės užrašas
                this.whoseTurn();
            //Kompiuterio eilė
            } else if (event.target.getAttributeNode("class").value === "o") {
                console.log("paspaustas 0");
                playerTurn = false;
                playerSymbol = "0";
                //Kompiuterio stilius ir jo eilės užrašas
                this.whoseTurn();
                
                //Po 1 sekundės uždelsimo
                setTimeout(() => { 
                    //Kompiuteris atsitiktinai renkasi kur įrašyti savo pirmą "0", nes jis pradeda ir visi kvadratai dar tušti
                    let squares = [];
                    for (let i = 0; i < this.dom(".frame").children.length; i++) {
                        squares.push(this.dom(".frame").children[i]);
                    }
                    let randomNumber = parseInt(Math.random() * 9);
                    squares[randomNumber].innerText = "0";
                }, 1000);
                //Dabar turi būti žmogaus eilė
                setTimeout(this.whoseTurn, 1500);
            }
        });
    },
    
    //
    whoseTurn: function() {
        if (playerTurn) {
            game.dom(".whose-turn__who").innerText = "Your turn!";
            game.dom(".whose-turn__who").style.backgroundColor = "rgb(0,128,0)";
            //Žaidėjas gali rinktis kur spausti savo ženklą
            game.dom(".frame").addEventListener("click", (event) => {
                //Žaidėjas gali spausti tik ant tuščio langelio
                if (event.target.innerText === "") {
                    //Paspaudimas veikia tik ant ".frame" vaiko elemento
                    if (event.target !== event.currentTarget) {
                        console.log("žaidėjas paspaudė");
                        event.target.innerText = "X";
                    }
                    event.stopPropagation();
                }
            });
            playerTurn = false;
        } else if (!playerTurn) {
            game.dom(".whose-turn__who").innerText = "Computer's turn!";
            game.dom(".whose-turn__who").style.backgroundColor = "rgb(0, 149, 240)";
            playerTurn = true;
        }
    }
};

game.init();
game.start();
game.whoseTurn();











