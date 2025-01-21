let levaPalka;
let pravaPalka;
let micek;
const sirka = 1000; 
const vyska = 500;
let hrac1 = 0; 
let hrac2 = 0; 

class Palka1 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.sirka = 20;
    this.vyska = 100;
    this.rychlost = 7;
  }
  vykresli() {
    fill(255, 0, 0);
    rect(this.x, this.y, this.sirka, this.vyska);
  }
  pohyb(move) {
    this.y = constrain(this.y + move * this.rychlost, 0, vyska - this.vyska);
  }
}
class Palka2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.sirka = 20;
    this.vyska = 100;
    this.rychlost = 7;
  }

  vykresli() {
    fill(0, 0, 255);
    rect(this.x, this.y, this.sirka, this.vyska);
  }

  pohyb(x) {
    this.y = constrain(this.y + x * this.rychlost, 0, vyska - this.vyska);
  }
}
class Micek {
  constructor() {
    this.rychlostMicek= 5;
    this.x = sirka / 2;
    this.y = vyska / 2;
    this.prumer = 20;
    this.rychlostX = this.rychlostMicek;
    this.rychlostY = this.rychlostMicek;
  }

  vykresli() {
    fill(255, 255, 255);
    ellipse(this.x, this.y, this.prumer);
  }
  aktualizuj() {
    this.x += this.rychlostX;
    this.y += this.rychlostY;
    if (this.y <= 0 || this.y >= vyska) {
      this.rychlostY *= -1;
    }
  }

  naraz(palka) {
    return (
      this.x - this.prumer / 2 <= palka.x + palka.sirka &&
      this.x + this.prumer / 2 >= palka.x &&
      this.y >= palka.y &&
      this.y <= palka.y + palka.vyska
    );
  }

  mimoHriste() {
    return this.x <= 0 || this.x >= sirka;
  }
}

function points() {
  textSize(32);
  fill(255);
  textAlign(CENTER, TOP);
  text(`${hrac1} : ${hrac2}`, sirka / 2, 10);
}

function updateScores() {
  document.getElementById('player1-score').textContent = hrac1;
  document.getElementById('player2-score').textContent = hrac2;
}

function setup() {
  let holder = document.getElementById("pole");
  let canvas = createCanvas(sirka, vyska);
  canvas.parent(holder);
  levaPalka = new Palka1(10, vyska / 2 - 50);
  pravaPalka = new Palka2(sirka - 30, vyska / 2 - 50);
  micek = new Micek();
}

function draw() {
  background(0);
  points();
  levaPalka.vykresli();
  pravaPalka.vykresli();
  micek.vykresli();
  micek.aktualizuj();

  if (micek.naraz(levaPalka) || micek.naraz(pravaPalka)) {
    micek.rychlostX *= -1;
  }
  if (micek.mimoHriste()) {
    if (micek.x <= 0) {
      hrac2++;
      micek.splice(1);
      micek.vykresli();
    } else {
      hrac1++;
      micek.splice(1);
      micek.vykresli();
    }
    micek = new Micek();
    updateScores();
  }
  if (keyIsDown(87)) {
    levaPalka.pohyb(-1);
  }
  if (keyIsDown(83)) {
    levaPalka.pohyb(1);
  }
  if (keyIsDown(UP_ARROW)) {
    pravaPalka.pohyb(-1);
  }
  if (keyIsDown(DOWN_ARROW)) {
    pravaPalka.pohyb(1);
  }
}
