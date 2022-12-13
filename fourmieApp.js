const container = document.getElementById("container");
// afficher pheromone
const gridSize = 7;
let center = parseInt(gridSize / 2);
const maxEnergy = 30//0.2*gridSize*gridSize;
const DureeDeVieGeneration1 = 49; // a revoir
const nbFourmis = 30;
const alpha = 5 /*(Math.random() * 10) +1*/; 
const beta = 5 /*(Math.random() * 10) +1*/; 
let y = 0;
let compteur = 0;
let TabFourmis;
let id = 0;
let ant; 

function StartGame() {
  // nb d'itérations total
  game = setInterval(function () {
    fourmies.forEach((elem) => {
      let index //= Math.floor(Math.random() * directions.length);

      // plutot récuperer x et y ?
      if (InfoExploration(elem) == -1) {
        index = Math.floor(Math.random() * directions.length); // random direction 
      }
      else {
        index = InfoExploration(elem);
      }
      direction = directions[index];
      moveAnt(elem);

      if (compteur > DureeDeVieGeneration1) {
        clearInterval(game);
        fourmies.splice(0, fourmies.length+1);
        fourmiesMorte[morte] = ant;
        morte++;
        ant.remove();
        crossMutation(selectAnts());
        compteur = 0;
      }
    })
    compteur++;
    //fourmies = document.querySelectorAll("div[class='child']");
  }, 100);//--Vitesse de "tron"  
}
//////////////////////////////////////////////////// MAKE GRID TABLE /////////////////////////////////////////////////////////////////////////////////////////   
function createAndFillTwoDArray({rows, columns, defaultValue}){
  return Array.from({ length:rows }, () => (
      Array.from({ length:columns }, ()=> defaultValue)
      ))
}

let pheromone_f_matrice = createAndFillTwoDArray({rows:gridSize, columns:gridSize, defaultValue: 0})
let pheromone_h_matrice = createAndFillTwoDArray({rows:gridSize, columns:gridSize, defaultValue: 0})

//////////////////////////////////////////////////// MAKEROWS /////////////////////////////////////////////////////////////////////////////////////////   
function makeRows(rows, cols) {
  container.style.setProperty('--grid-rows', rows);
  container.style.setProperty('--grid-cols', cols);
  for (c = 0; c < (rows * cols); c++) {
    let cell = document.createElement("article");
    cell.id = c;
    container.appendChild(cell).className = "grid-item";

    // pour ajouter les coordonées x et y pour simplifier les deplacements
    let x = c % gridSize;

    if (c % gridSize === 0 && c >= gridSize) {
      y += 1;
    }
    cell.setAttribute('x', x);
    cell.setAttribute('y', y);

    //creation du NID
    if (c === parseInt(rows * cols / 2)) {
      cell.classList.add('nid');
      cell.innerHTML = 'N'
    }
    // smell = 1, sinon multiplication par 0 donne toujours 0, ce qui empeche de capter correctement l'odeur de retour
    let smell = 1;
    cell.setAttribute('smell', smell);
    // smell = pheromone_f, a voir pour supprimer une des deux.
    let pheromone_f = 1;
    cell.setAttribute('pheromone_f', pheromone_f);

    let pheromone_h = 1;
    cell.setAttribute('pheromone_h', pheromone_h);

    cell.addEventListener('click', (event) => {
      cell.className = 'block';
      if (event.shiftKey) {
        cell.className = 'grid-item'
      }
    })
  };
};

makeRows(gridSize, gridSize);

//###################################################  Create ANTS ##############################################

function displayAnt(nbAnts) {
  let ants = [];
  let nid;

  for (let i = 1; i <= nbAnts; i++) {
    ant = document.createElement("div");
    ants.push(ant)

    ant.setAttribute("id", "ant" + parseInt(id));
    ant.setAttribute("x", center);
    ant.setAttribute("y", center);
    ant.setAttribute("carried_food", 0); // la quantité de nourriture que la fourmis à apporté 
    ant.setAttribute("energy", maxEnergy);
    ant.setAttribute("totalSteps", 0); // nombre de pas que la fourmis a fait pendant sa vie. 
    ant.setAttribute("alpha", alpha); // capteur de phéromone entre [0;10]
    ant.setAttribute("beta",beta); // capteur d'odeur entre [0;10]
    ant.setAttribute("food", 0); // Si la fourmi a de la nourriture -- et la quantite de celle-ci, ici 0
    ant.setAttribute("random", 0.05);//Math.random()*1); 

    ant.className = "child"
    ant.innerHTML = "ANT"
    let nid = document.querySelector(".nid");
    nid.appendChild(ant)
    id++;
  }
  return ants;
}


let fourmies = displayAnt(nbFourmis);
let nid = document.querySelector(`article[x='${center}'][y='${center}']`);
nid.setAttribute('totalFood', 0);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////  INFOEXPLORATION ///////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function InfoExploration(ant) {
  // On récupere la position de la fourmi sur son div
  x = ant.getAttribute('x');
  y = ant.getAttribute('y');
  id_ant = ant.getAttribute('id');
  // On récupere sa position dans la grille, sa cellule
  let source = document.querySelector(`article[x='${x}'][y='${y}']`);
  idCase = source.getAttribute("id");

  let random = Math.random() * 1;
  let voisin_pos_final = -1;

  pheromone_f_matrice[x][y] = source.getAttribute('pheromone_f');
  // document.getElementById('Matrice').innerHTML = pheromone_f_matrice;

  pheromone_h_matrice[x][y] = source.getAttribute('pheromone_h');
  // document.getElementById('Matrice2').innerHTML = pheromone_h_matrice;

  if (random > ant.getAttribute('random')) {
    let nourriture = document.querySelectorAll(`article[class='grid-item food visited']`);
    let nid = document.querySelector(`article[class='grid-item nid']`);
    let meilleur_neighbor = null;

    let alpha = ant.getAttribute('alpha');
    let beta = ant.getAttribute('beta');
    let vf = ant.getAttribute('food'); // valeur de la nourriture que la fourmi porte
    let nf = 0.2 * ant.getAttribute('energy'); // x_neighbor * y_neighbor; // pour le moment nf, mais à l'avenir prendre ncf (en supprimant l'energie consommée)
    let ncf = maxEnergy - nf;

    let proba = 0;
    let voisin_pos = -1;
    let voisin_pos_final = -1;

    let pheromone1 = Math.round((10 / (1 + ncf))*100)/100; // exploration 
    let pheromone2 = Math.round((vf / (1 + ncf))*100)/100; // retour 
    // on ajoute le pheromone_h = p1  si retour 
    if (ant.getAttribute('food') == 1) {
      p2_f = Math.round(parseFloat(source.getAttribute('pheromone_f'))*100)/100;
      source.setAttribute('pheromone_f',  Math.round((pheromone2 + p2_f)*100)/100)
    }
    // on ajoute le pheromone_f = p2  si exploration 
    else {
      p1_h = Math.round(parseFloat(source.getAttribute('pheromone_h'))*100)/100;
      source.setAttribute('pheromone_h', Math.round((pheromone1 + p1_h)*100)/100)
    }

    // Si on est sur la case de la nourriture, on prend 1 unité de nourriture et on devient rouge
    for (let compt = 0; compt < nourriture.length; compt++) {
      if (source == nourriture[compt]) {
        ant.setAttribute('food', 1);
        ant.setAttribute('energy', maxEnergy);
        document.getElementById(id_ant).style.backgroundColor = 'red';
      }
    }

    // Si on est sur la case du nid, on perd 1 unité de nourriture et on devient noir
    if (source == nid && ant.getAttribute('food') == 1 ) {
      ant.setAttribute('food', 0);
      ant.setAttribute('energy', maxEnergy);
      document.getElementById(id_ant).style.backgroundColor = 'black';
      let maxFoodCarried = parseInt(ant.getAttribute("carried_food"));
      ant.setAttribute("carried_food", maxFoodCarried + 2) // la quantité qu'elle peut porter
      let foodAtTheNid = parseInt(nid.getAttribute("totalFood"));
      nid.setAttribute("totalFood", foodAtTheNid + 2) // la même quantité que la fourmis porte
      document.getElementById('nbFood').innerHTML = nid.getAttribute("totalFood");
    }

    for (let i = 0; i < getCellNeighbors(source).length; i++) {
      voisin_pos = i;
      let neighbor = getCellNeighbors(source)[i];

      x_neighbor = neighbor.getAttribute('x');
      y_neighbor = neighbor.getAttribute('y');

      // On récupére pheromone_f et _h de la cellule voisine sur laquelle on est
      let pheromone_f = parseFloat(neighbor.getAttribute('pheromone_f')); // pheronome_f
      let pheromone_h = parseFloat(neighbor.getAttribute('pheromone_h'));
      let pheromone_smell = parseFloat(neighbor.getAttribute('smell'));


      let probaVoisines = 0, meilleur = 0;
      if (ant.getAttribute('food') == 1) {
        proba = Math.pow(pheromone_h, alpha)  // formule du haut en mode RETOUR
      } else {
        proba = Math.pow(pheromone_f, alpha) * Math.pow(pheromone_smell, beta);  // formule du haut en mode EXPLORATION
      }

      for (let j = 0; j < getCellNeighbors(neighbor).length; j++) {
        let neighborV = getCellNeighbors(source)[i];
        // On récupére pheromone_f et _h de la cellule voisine à la voisine
        let pheronome_smell_voisin = neighborV.getAttribute('smell');
        let pheromone_f_voisin = neighborV.getAttribute('pheromone_f');
        let pheronome_h_voisin = neighborV.getAttribute('pheromone_h');
        // SI food=1, ca veut dire qu'on a de la nourriture
        if (ant.getAttribute('food') == 1) {
          // On calcul la proba de retour 
          probaVoisines = probaVoisines + Math.pow(pheronome_h_voisin, alpha);
        } else {
          // On calcul la proba d'exploration 
          probaVoisines = probaVoisines + (Math.pow(pheronome_smell_voisin, beta) * Math.pow(pheromone_f_voisin, alpha));


        }
      }
      let proba_total = proba / probaVoisines;
      if (proba_total > meilleur) {
        meilleur = proba;
        meilleur_neighbor = neighbor
        voisin_pos_final = voisin_pos;
      }
    }
  }
  else {
    x = ant.getAttribute('x');
    y = ant.getAttribute('y');
    id_ant = ant.getAttribute('id');

    let vf = ant.getAttribute('food'); // valeur de la nourriture que la fourmi porte
    let nf = 0.2 * ant.getAttribute('energy');
    let nourriture = document.querySelectorAll(`article[class='grid-item food visited']`);

    let source = document.querySelector(`article[x='${x}'][y='${y}']`);
    let ncf = maxEnergy - nf;
    let pheromone1 = 10 / (1 + ncf); // exploration 
    let pheromone2 = vf / (1 + ncf); // retour

    
    // Si on est sur la case de la nourriture, on prend 1 unité de nourriture et on devient rouge
    for (let compt = 0; compt < nourriture.length; compt++) {
      if (source == nourriture[compt]) {
        ant.setAttribute('food', 1);
        ant.setAttribute('energy', maxEnergy);
        document.getElementById(id_ant).style.backgroundColor = 'red';
      }
    }
    if (source == nid && ant.getAttribute('food') == 1 ) {
      ant.setAttribute('food', 0);
      ant.setAttribute('energy', maxEnergy);
      document.getElementById(id_ant).style.backgroundColor = 'black';
      let maxFoodCarried = parseInt(ant.getAttribute("carried_food"));
      ant.setAttribute("carried_food", maxFoodCarried + 2) // la quantité qu'elle peut porter
      let foodAtTheNid = parseInt(nid.getAttribute("totalFood"));
      nid.setAttribute("totalFood", foodAtTheNid + 2) // la même quantité que la fourmis porte
      document.getElementById('nbFood').innerHTML = nid.getAttribute("totalFood");
    }

    // on ajoute le pheromone_h = p1  si retour 
    if (ant.getAttribute('food') == 1) {
      p2_f = parseFloat(source.getAttribute('pheromone_f'));
      source.setAttribute('pheromone_f', pheromone2 + p2_f)
    }
    // on ajoute le pheromone_f = p2  si exploration 
    else {
      p1_h = parseFloat(source.getAttribute('pheromone_h'));
      source.setAttribute('pheromone_h', pheromone1 + p1_h)
    }
  }
  document.getElementById('nbTour').innerHTML = compteur;
  return voisin_pos_final; //meilleur_neighbor;
}

//////////////////////////////////////////////////// NEWGENERATIONANT /////////////////////////////////////////////////////////////////////////////////////////   
function newGenerationAnt(alpha, beta) {
  ant = document.createElement("div");
  ant.setAttribute("id","ant"+parseInt(id));
  ant.setAttribute("x", center);
  ant.setAttribute("y", center);
  ant.setAttribute("carried_food", 0); // la quantité de nourriture que la fourmis à apporté 
  ant.setAttribute("energy", maxEnergy);
  ant.setAttribute("totalSteps", 0); // nombre de pas que la fourmis a fait pendant sa vie. 
  ant.setAttribute("alpha", alpha); // capteur de phéromone entre [0;10]
  ant.setAttribute("beta", beta); // capteur d'odeur entre [0;10]
  ant.setAttribute("food", 0); // Si la fourmi a de la nourriture -- et la quantite de celle-ci, ici 0
  ant.setAttribute("random", Math.random() * 1);

  ant.className = "child"
  ant.innerHTML = "ANT"

  nid.setAttribute("totalfood", 0);
  nid.appendChild(ant)
  id++;

  return ant;
}

let allANTS = document.querySelectorAll("div[class='child']");
// Selection des fourmis qui ont plus travaillé

//////////////////////////////////////////////////// SELECTANTS /////////////////////////////////////////////////////////////////////////////////////////   
function selectAnts(){
  // let allANTS = document.querySelectorAll("div");
  // le seuil de nourriture porté par les fourmies. 
  let nourriturePorteParChaqueFourmis = [];
  allANTS.forEach((elem) => {
    nourriturePorteParChaqueFourmis.push(parseInt(elem.getAttribute("carried_food")));
  })
  let k = Math.max(...nourriturePorteParChaqueFourmis);
  let tri = nourriturePorteParChaqueFourmis.sort();
  let bestWorkers = [];
  // allANTS.forEach((elem) => {
  //   // on cherche si les fourmies ont porte de la nourriture au moins une fois..... 
  //   if (parseInt(elem.getAttribute("carried_food")) > (k - 3) ) {
  //   // if (parseInt(elem.getAttribute("totalSteps")) > dureeDevie1Genereation) { 
  //     bestWorkers.push(elem);
  //   }
  // });
  for(let nbChoisi=0; nbChoisi<10; nbChoisi++){
    bestWorkers[nbChoisi] = tri[tri.length-nbChoisi];
  }
  return bestWorkers;
}
//let bestWorkers = selectAnts();
//let fourmiesG2 = newGenerationAnt(nbFourmis);
//////////////////////////////////////////////////// CROSSMUTATION /////////////////////////////////////////////////////////////////////////////////////////   
function crossMutation (topAntWorkers) {

  let allANTS = document.querySelectorAll("div");
  let newGeneration = topAntWorkers ;
  while (newGeneration.length <= 20){

    let parent_1 =allANTS[Math.floor(Math.random()*allANTS.length)];
    let parent_2 =allANTS[Math.floor(Math.random()*allANTS.length)];
    // a peut être modifier
    let newAlpha = (parseInt(parent_1.getAttribute("alpha")) + parseInt(parent_2.getAttribute("alpha")))/ 2;
    let newBeta = (parseInt(parent_1.getAttribute("beta")) + parseInt(parent_2.getAttribute("beta")))/ 2; 
   
    // $$$$$$$$$$$$$$$$$$$$$$$$$$$$     MUTATION     $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
    // la probabilité que la mutation arrive avec un taux de 1%
    let probaAntWillMutate = Math.floor(Math.random()*100) + 1
    let tauxDeMutation = 0.95;
    if( probaAntWillMutate === 5 ) {
    // la probabilite 1 sur 2 que la mutation sera ajouté ou soustraite
      let probaPlusOrMinus = Math.floor(Math.random()*2);
      if (probaPlusOrMinus === 0) {
        newAlpha *= -tauxDeMutation
        newAlpha *= -tauxDeMutation
      } else {
        newAlpha *= tauxDeMutation
        newAlpha *= tauxDeMutation
      }
    }
    //creation de la nouvelle generation a partir des 
    let newGenAnt = newGenerationAnt(newAlpha, newBeta);
    nid.appendChild(newGenAnt);
    newGeneration.push(newGenAnt);
    fourmies.push(newGenAnt); 
  }

  // a la fin on va tuer les autres fourmis... qui ne sont pas comprises dans la nouvelle generation mais qui sont encore en vie
  // let tousAnts = document.querySelectorAll("div[class='child]");
  // for (let ant of tousAnts) {
  //   if (!newGeneration.includes(ant)) {
  //     ant.remove();
  //   }
  // }
}

//////////////////////////////////////////////////// ADDFOOD /////////////////////////////////////////////////////////////////////////////////////////   
function addFood(x, y, value) {
  let source = document.querySelector(`article[x='${x}'][y='${y}']`);
  source.innerHTML = 'F';
  source.setAttribute('smell', value);
  source.classList.add('food');

  let k = value; // smell 
  let visited = [];
  let queue = [];
  queue.push(source);

  i = 0;
  while (true) {

    k = parseInt(k / 2);
    let currentNode = queue.shift();

    let smell_range = foodSmellRepartition(currentNode);

    visited.push(currentNode);
    currentNode.classList.add('visited');
    currentNode.setAttribute('visited', true);

    smell_range.forEach((childNode) => {
      if (!visited.includes(childNode) && !queue.includes(childNode) && k != 0) {
        queue.push(childNode);
        childNode.innerHTML = k
        childNode.setAttribute('smell', k);
        childNode.setAttribute('parent', currentNode.id);
      }
    })

    if (i === 5) {
      break;
    }
    i++;
  }
}
addFood(0, 0, 10)
//addFood(0, gridSize-1, 10)
//addFood(gridSize-1, 0, 10)
//addFood(gridSize-1, gridSize-1, 10)

//////////////////////////////////////////////////// RESET_PHEROMONE /////////////////////////////////////////////////////////////////////////////////////////   
function reset_pheromone() {
  let grid = document.querySelectorAll('article');
  for (let f = 0; f < grid.length; f++) {
    let pheromone_f = 0;
    grid[f].setAttribute('pheromone_f', pheromone_f);

    let pheromone_h = 0;
    grid[f].setAttribute('pheromone_h', pheromone_h);
  }
}

//////////////////////////////////////////////////// FOODSMELLEREPARTITION /////////////////////////////////////////////////////////////////////////////////////////   

function foodSmellRepartition(node) {

  let neighbors = []; //returned array

  //current node row and col
  let x = parseInt(node.getAttribute('x'));
  let y = parseInt(node.getAttribute('y'));

  let neighbor; //local variable

  if (x - 1 >= 0) {
    neighbor = document.querySelector(`article[x='${x - 1}'][y='${y}']`);
    if (neighbor && !neighbor.hasAttribute('block')) neighbors.push(neighbor); //if the neighbor exist and is not a wall
  }

  if (y + 1 >= 0) {
    neighbor = document.querySelector(`article[x='${x}'][y='${y + 1}']`);
    if (neighbor && !neighbor.hasAttribute('block')) neighbors.push(neighbor); //if the neighbor exist and is not a wall
  }

  if (x + 1 >= 0) {
    neighbor = document.querySelector(`article[x='${x + 1}'][y='${y}']`);
    if (neighbor && !neighbor.hasAttribute('block')) neighbors.push(neighbor); //if the neighbor exist and is not a wall
  }

  if (y - 1 >= 0) {
    neighbor = document.querySelector(`article[x='${x}'][y='${y - 1}']`);
    if (neighbor && !neighbor.hasAttribute('block')) neighbors.push(neighbor); //if the neighbor exist and is not a wall
  }

  return neighbors;
}




// ############################################ tests ici ########################################################

// console.log(foodSmellRepartition(nid))
// console.log(getCellNeighbors(nid))

// ###############################################################################################################

// BFS(nid)