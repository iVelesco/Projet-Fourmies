const container = document.getElementById("container");

const gridSize = 11;
let center = parseInt(gridSize / 2);

let y = 0;
function makeRows(rows, cols) {
  container.style.setProperty('--grid-rows', rows);
  container.style.setProperty('--grid-cols', cols);
  for (c = 0; c < (rows * cols); c++) {
    let cell = document.createElement("article");
    // cell.innerText = (c + 1);
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
    let pheromone_f = 0;
    cell.setAttribute('pheromone_f', pheromone_f);

    let pheromone_h = 0;
    cell.setAttribute('pheromone_h', pheromone_h);

    cell.addEventListener('click', (event) => {
      // console.log("cell clicked");
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
    let ant = document.createElement("div");
    ants.push(ant)

    ant.setAttribute("id", "ant" + i)
    ant.setAttribute("x", center);
    ant.setAttribute("y", center);
    ant.setAttribute("energy", 20);
    ant.setAttribute("alpha", 5); // capteur de phéromone entre [0;10]
    ant.setAttribute("beta", 5); // capteur d'odeur entre [0;10]
    ant.setAttribute("food", 0); // Si la fourmi a de la nourriture -- et la quantite de celle-ci, ici 0
    ant.className = "child"
    ant.innerHTML = "ANT"

    let nid = document.querySelector(".nid");
    nid.appendChild(ant)
  }
  return ants;
}

// let fif = displayAnt(10);

// console.log(fif)


let fourmies = displayAnt(20);

let directions = ["right", "right-down", "right-up", "left", "left-up", "left-down", "down", "up"];

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////  LES MODIF ICI ///////////////////////////////////////////////////////////////////////////////////////
////////// Pourquoi ca ne marche pas ? : car il retourne la case sur laquelle la fourmi doit aller et non le numéro de la direction ////////////////////////////////////////////////////////////

function InfoExploration(ant) {
  // On récupere la position de la fourmi sur son div
  x = ant.getAttribute('x');
  y = ant.getAttribute('y');
  id = ant.getAttribute('id');
  // On récupere sa position dans la grille, sa cellule
  let source = document.querySelector(`article[x='${x}'][y='${y}']`);
  let nourriture = document.querySelector(`article[class='grid-item food visited']`);
  let nid = document.querySelector(`article[class='grid-item nid']`);
  let meilleur_neighbor = null;

  let alpha = ant.getAttribute('alpha');
  let beta = ant.getAttribute('beta');
  let vf = ant.getAttribute('food'); // valeur de la nourriture que la fourmi porte

  // Si on est sur la case de la nourriture, on prend 1 unité de nourriture et on devient rouge
  if (source == nourriture) {
    ant.setAttribute('food', 1);
    document.getElementById(id).style.backgroundColor = 'red';
    // ant.style.background = rgb(6, 4, 4);
  }
  // Si on est sur la case du nid, on perd 1 unité de nourriture et on devient noir
  if (source == nid) {
    ant.setAttribute('food', 1);
    document.getElementById(id).style.backgroundColor = 'black';
    // ant.style.background = rgb(6, 4, 4);
  }

  for (let i = 0; i < getCellNeighbors(source).length; i++) {
    let neighbor = getCellNeighbors(source)[i];

    x_neighbor = neighbor.getAttribute('x');
    y_neighbor = neighbor.getAttribute('y');

    let nf = 0.2 // x_neighbor * y_neighbor; // pour le moment nf, mais à l'avenir prendre ncf (en supprimant l'energie consommée)

    // On récupére pheromone_f et _h de la cellule voisine sur laquelle on est
    let pheromone_f = parseFloat(neighbor.getAttribute('smell')); // pheronome_f
    let pheromone1 = 10 / 1 + nf; // exploration 
    let pheromone2 = vf / 1 + nf; // retour 

    let probaVoisines = 1, meilleur = 0;
    let proba = Math.pow(pheromone2, alpha) * Math.pow(pheromone_f, beta);  // formule du haut 
  
    for (let j = 0; j < getCellNeighbors(neighbor).length; j++) {
      let neighborV = getCellNeighbors(source)[i];
      // On récupére pheromone_f et _h de la cellule voisine à la voisine
      let pheronome_f_voisin = neighborV.getAttribute('smell');
      let pheromone2_voisin = 10 / 1 + nf;

      // SI food=1, ca veut dire qu'on a de la nourriture
      if (ant.getAttribute('food') == 1) {
        // On calcul la proba de retour 
        probaVoisines = probaVoisines + parseFloat(pheromone1) / (parseFloat(pheromone2_voisin));

      } else {
        // On calcul la proba d'exploration 
        probaVoisines = probaVoisines + (Math.pow(pheronome_f_voisin, alpha) * Math.pow(pheromone2_voisin, beta));
      }
    }
    if ((proba / probaVoisines) > meilleur) {
      meilleur = proba;
      meilleur_neighbor = neighbor
    }
  }
  
  return null; //meilleur_neighbor;
}

function StartGame() {
  setInterval(function () {

    fourmies.forEach((elem) => {
      let index //= Math.floor(Math.random() * directions.length);

      // plutot récuperer x et y ?
      if (InfoExploration(elem) == null) {
        index = Math.floor(Math.random() * directions.length); // random direction 
      }
      else {
        index = InfoExploration(elem);
      }
      direction = directions[index];
      // console.log(direction);
      moveAnt(elem.getAttribute('id'));
    })
  }, 300);//--Vitesse de "tron"  
}

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
    //   console.log(k)
  }
}

addFood(0, 0, 10)
// addFood(0, gridSize-1, 10)
// addFood(gridSize-1, 0, 10)
// addFood(gridSize-1, gridSize-1, 10)

function reset_pheromone() {
  let grid = document.querySelectorAll('article');
  for (let f = 0; f < grid.length; f++) {
    let pheromone_f = 0;
    grid[f].setAttribute('pheromone_f', pheromone_f);

    let pheromone_h = 0;
    grid[f].setAttribute('pheromone_h', pheromone_h);
  }
}

// function getCellNeighbors(node)

// function foodSmellRepartition(node)
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

let nid = document.querySelector(`article[x='${center}'][y='${center}']`);



// ############################################ tests ici ########################################################

// console.log(foodSmellRepartition(nid))
// console.log(getCellNeighbors(nid))

// ###############################################################################################################

// BFS(nid)