// deklarace promennych 
let levaPalka;  
let pravaPalka; 
let micek;      

// konstanta urcujici sirku a vysku hraci plochy
const sirka = 1000;  // sirka
const vyska = 500;   // vysja

// promenne (skore hracu)
let hrac1 = 0;  
let hrac2 = 0;  

// trida pro pravou palku
class Palka1 {
  constructor(x, y) {   // konstruktor s parametry x a y (pocatecni pozice pro palku)
    this.x = x;         // horizontalni pozice palky
    this.y = y;         // vvertikalni pozice palky
    this.sirka = 20;    // sirka palky
    this.vyska = 100;   // vyska palky
    this.rychlost = 7;  // rychlost palky
  }
  vykresli() {          // vykresli palky
    fill(255, 0, 0);    // cervena barva
    rect(this.x, this.y, this.sirka, this.vyska); // rect-obdelnik (palka)
  }
  pohyb(move) {         // pohyb palky
    this.y = constrain(this.y + move * this.rychlost, 0, vyska - this.vyska); // omezeni pohybu na hraci plose
  }
}

// prava palka
class Palka2 {
  constructor(x, y) {   
    this.x = x;         
    this.y = y;         
    this.sirka = 20;    
    this.vyska = 100;   
    this.rychlost = 7;  
  }

  vykresli() {          
    fill(0, 0, 255);    // modra barva
    rect(this.x, this.y, this.sirka, this.vyska); 
  }

  pohyb(x) {            
    this.y = constrain(this.y + x * this.rychlost, 0, vyska - this.vyska);
  }
}

// trida pro micek
class Micek {
  constructor() {
    this.rychlostMicek = 5;     // rychlost micku
    this.x = sirka / 2;         // zacatecni pozice (stred plochy na sirku)
    this.y = vyska / 2;         // zacatecni pozice (stred plochy na vysku)
    this.prumer = 20;           // prumer micku
    this.rychlostX = this.rychlostMicek; // rychlost ve smeru X
    this.rychlostY = this.rychlostMicek; // rychlost ve smeru Y
  }

  vykresli() {                  
    fill(255, 255, 255);         // bila barva micku
    ellipse(this.x, this.y, this.prumer); // vykresleni kruhu-ellipse
  }

  aktualizuj() {                 
    this.x += this.rychlostX;    // posun micku ve smeru X
    this.y += this.rychlostY;    // posun micku ve smeru Y
    if (this.y <= 0 || this.y >= vyska) {
      this.rychlostY *= -1;      // odraz od horni a dolni steny
    }
  }

  naraz(palka) {                 
    return (
      this.x - this.prumer / 2 <= palka.x + palka.sirka &&  // detekce narazu z prava
      this.x + this.prumer / 2 >= palka.x &&                // detekce narazu z leva
      this.y >= palka.y &&                                  // detekce horniho okraje palky
      this.y <= palka.y + palka.vyska                       // detekce dolniho okraje palky
    );
  }

  mimoHriste() {                 
    return this.x <= 0 || this.x >= sirka;  // kontrola zda micek opustil hriste
  }
}

// funkce na vykresleni skore 
function points() {
  textSize(32);                      // velikost textu
  fill(255);                          // bila (text)
  textAlign(CENTER, TOP);              // zarovnani na stred
  text(`${hrac1} : ${hrac2}`, sirka / 2, 10);  // zobrazeni skore
}

// funkce pro aktualizaci skore v HTML
function updateScores() {
  let player1Element = document.getElementById('player1-score'); // ziskani prvku hrace 1 (leva palka)
  let player2Element = document.getElementById('player2-score'); // ziskani prvku hrace 2 (prava palka)

  if (player1Element && player2Element) {  // kontrola zda prvek existuje
    player1Element.textContent = hrac1;    // aktualizace skore pro hrace 1
    player2Element.textContent = hrac2;    // aktualizace skore pro hrace 2
  } else {
    console.error("Elementy pro skóre nebyly nalezeny."); // pojistka kdyby se neco zkazilo pri nacitani elementu 
}
}

// Funkce pro inicializaci hry
function setup() {
  let holder = document.getElementById("pole");  // ziskani HTML elementu                     
  let canvas = createCanvas(sirka, vyska);       // vytvoreni hraciho platna
  canvas.parent(holder);                         // pripojeni platna
  levaPalka = new Palka1(10, vyska / 2 - 50);     // vytvoreni leve palky
  pravaPalka = new Palka2(sirka - 30, vyska / 2 - 50); // vytvoreni prave palky
  micek = new Micek();                           // vytvoreni micku
}

// funkce pro vykreslení a logiku hry
function draw() {
  background(0);          // cerne pozadi
  points();               // zobrazeni skore

  levaPalka.vykresli();    // vykresli levou palku
  pravaPalka.vykresli();   // vykresli pravou palku
  micek.vykresli();        // vykresli micek
  micek.aktualizuj();      // aktualizace pozice micku

  if (micek.naraz(levaPalka) || micek.naraz(pravaPalka)) {
    micek.rychlostX *= -1;  // odrazeni micku od palky
  }

  if (micek.mimoHriste()) { 
    if (micek.x <= 0) {
      hrac2++;             // pricte se bod hracovi 2 pokud micek opusti levy okraj 
    } else if (micek.x >= sirka) {
      hrac1++;             // pricte se bod hracovi 1 pokud micek opusti levy okraj 
    }
    micek = new Micek();   // reset micku na stredd
    updateScores();        // aktualizace skore v html 
  }

  if (keyIsDown(87)) {     // pohyb leve palky nahoru (W)
    levaPalka.pohyb(-1);
  }
  if (keyIsDown(83)) {     // pohyb leve palky dolu (S)  
    levaPalka.pohyb(1);
  }
  if (keyIsDown(UP_ARROW)) {  // pohyb prave palky nahoru (sipka nahoru)
    pravaPalka.pohyb(-1);
  }
  if (keyIsDown(DOWN_ARROW)) {  // pohyb prave palkky dolu (sipka dolu)
    pravaPalka.pohyb(1);
  }
}
