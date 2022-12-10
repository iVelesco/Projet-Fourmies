const container = document.getElementById("container");

const gridSize = 11;
let center = parseInt(gridSize/2);

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
    if(c === parseInt(rows*cols/2)) {
        cell.classList.add('nid');
        cell.innerHTML = 'N'
    }

    let smell = 0;
    cell.setAttribute('smell', smell);
      
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

    ant.setAttribute("id", "ant"+i)
    ant.setAttribute("x", center);
    ant.setAttribute("y", center);

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

gameLoop = setInterval(function(){
  // grid[tron1.getBBox().y/cellSize][tron1.getBBox().x/cellSize] = 1;  
  fourmies.forEach((elem)=> {
      let index = Math.floor(Math.random() * directions.length);
      direction = directions[index];
      // console.log(direction);
      moveAnt(elem.getAttribute('id'));
  })

  
  // if( tron1.getBBox().x >= svgWidth || tron1.getBBox().x < 0 ||
  //         tron1.getBBox().y >= svgWidth || tron1.getBBox().y < 0 ) {
  //     clearInterval(gameLoop);
  // }
  // console.log(typeof gameLoop)
  // ###############################
  // if(typeof gameLoop != "undefined"){
  //     clearInterval(gameLoop);
  // }

}, 300);//--Vitesse de "tron"  


function addFood(x, y, value) {
    let source = document.querySelector(`article[x='${x}'][y='${y}']`);
    source.innerHTML = 'F';
    source.setAttribute('smell', value);
    source.classList.add('food');

    let k = value; // smell 
    let visited = [];
    let queue = [];
    // console.log("premiere queue : ")
    // console.log(queue)
    queue.push(source);

    i = 0;
    while ( true ) {

        // if(currentNode.parent)
        k = parseInt(k/2);
      let currentNode = queue.shift();
    //   console.log(currentNode)
    //   console.log('id ' +currentNode.id)
    // let parNode = document.querySelector(`article[parent='${currentNode.getAttribute("parent")}']`)
    // if (parNode != null) {
    //     console.log(parNode.getAttribute('smell'));
    // }  
  
  
      let smell_range = foodSmellRepartition(currentNode);
    //   console.log("smell range is : " )
    //   console.log(smell_range);
    //   console.log("#####################")
      visited.push(currentNode);
      currentNode.classList.add('visited');
      currentNode.setAttribute('visited', true);
  
      smell_range.forEach((childNode) => {
        if(!visited.includes(childNode)  && !queue.includes(childNode)) {
          // let r = currentNode.getAttribute('smell');
          // console.log("smell = " + r);
          // console.log(" K is : " + k + "################")
          // console.log(childNode);
          queue.push(childNode);
        //   console.log("queue in this moment ")
        //   console.log(queue)
        //   console.log("#####################")
          childNode.innerHTML = k
          childNode.setAttribute('smell', k);
          childNode.setAttribute('parent', currentNode.id);
          // console.log(k)
        }
      })
      // console.log("curent")
      // console.log(document.querySelector(`article[parent='${currentNode.getAttribute("parent")}']`));
    //   console.log(i)
        if(i===5){
            break;
        } 
      i++;
    //   console.log(k)
    }
}

addFood(0, 0, 10)
addFood(0, gridSize-1, 10)
addFood(gridSize-1, 0, 10)
addFood(gridSize-1, gridSize-1, 10)

function reset_pheromone () {
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
      neighbor = document.querySelector(`article[x='${x-1}'][y='${y}']`);
      if (neighbor && !neighbor.hasAttribute('block')) neighbors.push(neighbor); //if the neighbor exist and is not a wall
    }
    
    if (y + 1 >= 0) {
        neighbor = document.querySelector(`article[x='${x}'][y='${y+1}']`);
        if (neighbor && !neighbor.hasAttribute('block')) neighbors.push(neighbor); //if the neighbor exist and is not a wall
    }
    
    if (x + 1 >= 0) {
        neighbor = document.querySelector(`article[x='${x+1}'][y='${y}']`);
        if (neighbor && !neighbor.hasAttribute('block')) neighbors.push(neighbor); //if the neighbor exist and is not a wall
    }
   
    if (y - 1 >= 0) {
        neighbor = document.querySelector(`article[x='${x}'][y='${y-1}']`);
        if (neighbor && !neighbor.hasAttribute('block')) neighbors.push(neighbor); //if the neighbor exist and is not a wall
    }
  
    return neighbors;
}

let nid = document.querySelector(`article[x='${center}'][y='${center}']`);



function Ant (x, y, alpha = 1, beta= 1, rand = 0.2, energy = 20) {
  this.has_food = false;
  this.alpha = alpha;
  this.last_signal = 0;
  this.rand = rand;
  this.energy = energy;
  this.max_energy = energy; 
  this.
  this.orientation = Math.random() * 90;
}

// ############################################ tests ici ########################################################

// console.log(foodSmellRepartition(nid))
// console.log(getCellNeighbors(nid))
// ###############################################################################################################

// BFS(nid)