"use strict";

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
            for (let i = 0; i < this.dom(".frame").childNodes.length; i++) {
                this.dom(".frame").childNodes[i].innerText = "";
            }
            //Dingsta pasirinkimų mygtukai ir atsiranda užrašas kieno eilė žaisti
            this.dom(".choose-player").style.display = "none";
            this.dom(".buttons").style.display = "none";
            this.dom(".whose-turn").style.display = "block";

            //Žaidėjo eilė
            if (event.target.getAttributeNode("class").value === "x") {
                console.log("paspaustas x");
                this.dom(".whose-turn__player").innerText = "Your turn!";
                this.dom(".whose-turn__player").className = "whose-turn__player";
            //Kompiuterio eilė
            } else if (event.target.getAttributeNode("class").value === "o") {
                console.log("paspaustas 0");
                this.dom(".whose-turn__computer").innerText = "Computer's turn!";
                this.dom(".whose-turn__computer").className = "whose-turn__computer";
            }
        });
        //Nustatau koks simbolis atsispausdins, spaudžiant ant kvadratėlių
        this.dom(".frame").addEventListener("click", (event) => {
            //Jeigu žaidėjo eilė, tada spaudžiasi "X"
            if (this.dom(".whose-turn__player")) {
                console.log("turetu buti x'ai");
                event.target.innerText = "X";
            //Jeigu kompiuterio eilė, tada spaudžiasi "0"
            } else if (this.dom(".whose-turn__computer")) {
                console.log("turetu buti 0'iai");
                event.target.innerText = "0";
            }
        });    
    },
    
    //
    // mainGame: function() {
    
    // }
};

game.init();
game.start();





