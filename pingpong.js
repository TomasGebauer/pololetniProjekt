// Deklarace globálních proměnných pro herní objekty
let levaPalka;  // Proměnná pro levou pálku
let pravaPalka; // Proměnná pro pravou pálku
let micek;      // Proměnná pro míček

// Konstanty určující rozměry hrací plochy
const sirka = 1000;  // Šířka hrací plochy v pixelech
const vyska = 500;   // Výška hrací plochy v pixelech

// Proměnné pro skóre hráčů
let hrac1 = 0;  // Počáteční skóre hráče 1
let hrac2 = 0;  // Počáteční skóre hráče 2

// Definice třídy pro levou pálku
class Palka1 {
  constructor(x, y) {   // Konstruktor s parametry x a y (počáteční pozice pálky)
    this.x = x;         // Uložení vodorovné pozice pálky
    this.y = y;         // Uložení svislé pozice pálky
    this.sirka = 20;    // Šířka pálky
    this.vyska = 100;   // Výška pálky
    this.rychlost = 7;  // Rychlost pohybu pálky
  }
  vykresli() {          // Metoda pro vykreslení pálky
    fill(255, 0, 0);    // Nastavení červené barvy
    rect(this.x, this.y, this.sirka, this.vyska); // Vykreslení obdélníku (pálky)
  }
  pohyb(move) {         // Metoda pro pohyb pálky
    this.y = constrain(this.y + move * this.rychlost, 0, vyska - this.vyska);
    // Omezení pohybu v rámci hrací plochy
  }
}

// Definice třídy pro pravou pálku (stejná logika jako u levé)
class Palka2 {
  constructor(x, y) {   
    this.x = x;         
    this.y = y;         
    this.sirka = 20;    
    this.vyska = 100;   
    this.rychlost = 7;  
  }

  vykresli() {          
    fill(0, 0, 255);    // Nastavení modré barvy
    rect(this.x, this.y, this.sirka, this.vyska); 
  }

  pohyb(x) {            
    this.y = constrain(this.y + x * this.rychlost, 0, vyska - this.vyska);
  }
}

// Definice třídy pro míček
class Micek {
  constructor() {
    this.rychlostMicek = 5;     // Počáteční rychlost míčku
    this.x = sirka / 2;         // Počáteční pozice (střed plochy na šířku)
    this.y = vyska / 2;         // Počáteční pozice (střed plochy na výšku)
    this.prumer = 20;           // Průměr míčku
    this.rychlostX = this.rychlostMicek; // Rychlost ve směru osy X
    this.rychlostY = this.rychlostMicek; // Rychlost ve směru osy Y
  }

  vykresli() {                  
    fill(255, 255, 255);         // Nastavení bílé barvy míčku
    ellipse(this.x, this.y, this.prumer); // Vykreslení kruhu (míčku)
  }

  aktualizuj() {                 
    this.x += this.rychlostX;    // Posun míčku ve směru X
    this.y += this.rychlostY;    // Posun míčku ve směru Y
    if (this.y <= 0 || this.y >= vyska) {
      this.rychlostY *= -1;      // Odrážení od horní a dolní stěny
    }
  }

  naraz(palka) {                 
    return (
      this.x - this.prumer / 2 <= palka.x + palka.sirka &&  // Detekce kolize zprava
      this.x + this.prumer / 2 >= palka.x &&                // Detekce kolize zleva
      this.y >= palka.y &&                                  // Detekce horního okraje pálky
      this.y <= palka.y + palka.vyska                       // Detekce dolního okraje pálky
    );
  }

  mimoHriste() {                 
    return this.x <= 0 || this.x >= sirka;  // Kontrola, zda míček opustil hřiště
  }
}

// Funkce pro vykreslení skóre na plátno
function points() {
  textSize(32);                      // Nastavení velikosti textu
  fill(255);                          // Nastavení bílé barvy textu
  textAlign(CENTER, TOP);              // Zarovnání textu na střed
  text(`${hrac1} : ${hrac2}`, sirka / 2, 10);  // Zobrazení skóre
}

// Funkce pro aktualizaci skóre v HTML
function updateScores() {
  let player1Element = document.getElementById('player1-score'); // Získání prvku hráče 1
  let player2Element = document.getElementById('player2-score'); // Získání prvku hráče 2

  if (player1Element && player2Element) {  // Kontrola existence prvků
    player1Element.textContent = hrac1;    // Aktualizace skóre hráče 1
    player2Element.textContent = hrac2;    // Aktualizace skóre hráče 2
  } else {
    console.error('Elementy pro skóre nebyly nalezeny!'); // Chybová zpráva při nenalezení prvků
  }
}

// Funkce pro inicializaci hry
function setup() {
  let holder = document.getElementById("pole");  // Získání HTML kontejneru
  let canvas = createCanvas(sirka, vyska);       // Vytvoření hracího plátna
  canvas.parent(holder);                         // Připojení plátna do kontejneru
  levaPalka = new Palka1(10, vyska / 2 - 50);     // Vytvoření levé pálky
  pravaPalka = new Palka2(sirka - 30, vyska / 2 - 50); // Vytvoření pravé pálky
  micek = new Micek();                           // Vytvoření míčku
}

// Funkce pro kreslení a logiku hry
function draw() {
  background(0);          // Vymazání obrazovky (černé pozadí)
  points();               // Zobrazení skóre

  levaPalka.vykresli();    // Vykreslení levé pálky
  pravaPalka.vykresli();   // Vykreslení pravé pálky
  micek.vykresli();        // Vykreslení míčku
  micek.aktualizuj();      // Aktualizace pozice míčku

  if (micek.naraz(levaPalka) || micek.naraz(pravaPalka)) {
    micek.rychlostX *= -1;  // Odrážení míčku od pálky
  }

  if (micek.mimoHriste()) { 
    if (micek.x <= 0) {
      hrac2++;             // Bod pro hráče 2, pokud míček opustil levý okraj
    } else {
      hrac1++;             // Bod pro hráče 1, pokud míček opustil pravý okraj
    }
    micek = new Micek();   // Reset míčku na střed
    updateScores();        // Aktualizace skóre v HTML
  }

  if (keyIsDown(87)) {     // Pohyb levé pálky nahoru (W)
    levaPalka.pohyb(-1);
  }
  if (keyIsDown(83)) {     // Pohyb levé pálky dolů (S)
    levaPalka.pohyb(1);
  }
  if (keyIsDown(UP_ARROW)) {  // Pohyb pravé pálky nahoru (šipka nahoru)
    pravaPalka.pohyb(-1);
  }
  if (keyIsDown(DOWN_ARROW)) {  // Pohyb pravé pálky dolů (šipka dolů)
    pravaPalka.pohyb(1);
  }
}
