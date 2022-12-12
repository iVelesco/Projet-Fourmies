function getParent(x, y) {
   return document.querySelector(`article[x='${x}'][y='${y}']`);
}

  let direction = "right";
  function moveAnt(id) {
    let ant = document.getElementById(id);
  
    //pour colorer la celule
    // let cell = document.querySelector(`div[x='${svg.getBBox().x}'][y='${svg.getBBox().y}']`);
    // cell.setAttribute('fill', 'red' );
    
  //   console.log(grid)
  
    if (direction === "right"){
        if(parseInt(ant.getAttribute('x'))+ 1 < gridSize ){
            let cx = parseInt(ant.getAttribute('x'))+ 1;
            let newParent = getParent(cx, parseInt(ant.getAttribute('y')));
            if(newParent.className !="block") {
                ant.setAttribute('x', cx);
                newParent.appendChild(ant);
            }
            // ant.parentElement.remove(); 
        }      
    } else if (direction === "right-down"){
        if ( parseInt(ant.getAttribute('y'))+ 1 < gridSize &&
        parseInt(ant.getAttribute('x'))+ 1 < gridSize) {
            let cy = parseInt(ant.getAttribute('y'))+ 1;
            let cx = parseInt(ant.getAttribute('x'))+ 1;
            let newParent = getParent(cx, cy);
            if(newParent.className !="block") {
                ant.setAttribute('y', cy);
                ant.setAttribute('x', cx);
                newParent.appendChild(ant);
            }
        }
       
    } else if (direction === "down"){
        if ( parseInt(ant.getAttribute('y'))+ 1 < gridSize) {
            let cy = parseInt(ant.getAttribute('y'))+ 1;
            let newParent = getParent(parseInt(ant.getAttribute('x')), cy);
            if(newParent.className !="block") {
                ant.setAttribute('y', cy);
                newParent.appendChild(ant);
            }
        }
       
    } else if (direction === "left-down"){
        if ( parseInt(ant.getAttribute('y'))+ 1 < gridSize &&
        parseInt(ant.getAttribute('x'))- 1 >= 0) {
            let cy = parseInt(ant.getAttribute('y'))+ 1;
            let cx = parseInt(ant.getAttribute('x'))- 1;
            let newParent = getParent(cx, cy);
            if(newParent.className !="block") {
                ant.setAttribute('y', cy);
                ant.setAttribute('x', cx);
                newParent.appendChild(ant);
            }
        }
       
    }else if (direction === "left"){
        if ( parseInt(ant.getAttribute('x'))- 1 >=0) {
            let cx = parseInt(ant.getAttribute('x')) - 1;
            let newParent =  getParent(cx, parseInt(ant.getAttribute('y')));
            if(newParent.className !="block") {
                ant.setAttribute('x', cx);
                newParent.appendChild(ant);
            }
        }
       
    } else if (direction === "left-up"){
        if ( parseInt(ant.getAttribute('y'))- 1 >=0 &&
        parseInt(ant.getAttribute('x'))- 1 >= 0) {
            let cy = parseInt(ant.getAttribute('y'))- 1;
            let cx = parseInt(ant.getAttribute('x'))- 1;
            let newParent = getParent(cx, cy);
            if(newParent.className !="block") {
                ant.setAttribute('y', cy);
                ant.setAttribute('x', cx);
                newParent.appendChild(ant);
            }
        }
       
    } else if (direction === "up"){
        if ( parseInt(ant.getAttribute('y'))- 1 >=0) {
            let cy = parseInt(ant.getAttribute('y'))- 1;
            let newParent = getParent(parseInt(ant.getAttribute('x')), cy);
            if(newParent.className !="block") {
                ant.setAttribute('y', cy);
                newParent.appendChild(ant);
            }
        }
        
    } else if (direction === "right-up"){
        if ( parseInt(ant.getAttribute('y'))- 1 >=0 &&
        parseInt(ant.getAttribute('x'))+ 1 < gridSize) {
            let cy = parseInt(ant.getAttribute('y'))- 1;
            let cx = parseInt(ant.getAttribute('x'))+ 1;
            let newParent = getParent(cx, cy);
            if(newParent.className !="block") {
                ant.setAttribute('y', cy);
                ant.setAttribute('x', cx);
                newParent.appendChild(ant);
            }
        }
    }
    // Ajout de la perte d'énergie à chaque fois que la fourmi parcours une case
    energy = ant.getAttribute('energy');
    energy = energy -1;
    ant.setAttribute('energy', energy);
  }
  




  function getCellNeighbors(node) {

    let neighbors = []; //returned array
  
    //current node row and col
    let x = parseInt(node.getAttribute('x'));
    let y = parseInt(node.getAttribute('y'));
  
    let neighbor; //local variable
  
    if (x - 1 >= 0) {
      neighbor = document.querySelector(`article[x='${x-1}'][y='${y}']`);
      if (neighbor && !neighbor.hasAttribute('block')) neighbors.push(neighbor); //if the neighbor exist and is not a wall
    }
    if (x - 1 >= 0 && y + 1 >=0) {
        neighbor = document.querySelector(`article[x='${x-1}'][y='${y+1}']`);
        if (neighbor && !neighbor.hasAttribute('block')) neighbors.push(neighbor); //if the neighbor exist and is not a wall
    }
    if (y + 1 >= 0) {
        neighbor = document.querySelector(`article[x='${x}'][y='${y+1}']`);
        if (neighbor && !neighbor.hasAttribute('block')) neighbors.push(neighbor); //if the neighbor exist and is not a wall
    }
    if (x + 1 >= 0 && y + 1 >=0) {
        neighbor = document.querySelector(`article[x='${x+1}'][y='${y+1}']`);
        if (neighbor && !neighbor.hasAttribute('block')) neighbors.push(neighbor); //if the neighbor exist and is not a wall
    }
    if (x + 1 >= 0) {
        neighbor = document.querySelector(`article[x='${x+1}'][y='${y}']`);
        if (neighbor && !neighbor.hasAttribute('block')) neighbors.push(neighbor); //if the neighbor exist and is not a wall
    }
    if (x + 1 >= 0 && y - 1 >=0) {
        neighbor = document.querySelector(`article[x='${x+1}'][y='${y-1}']`);
        if (neighbor && !neighbor.hasAttribute('block')) neighbors.push(neighbor); //if the neighbor exist and is not a wall
    }
    if (y - 1 >= 0) {
        neighbor = document.querySelector(`article[x='${x}'][y='${y-1}']`);
        if (neighbor && !neighbor.hasAttribute('block')) neighbors.push(neighbor); //if the neighbor exist and is not a wall
    }
    if (x - 1 >= 0 && y - 1 >=0) {
        neighbor = document.querySelector(`article[x='${x-1}'][y='${y-1}']`);
        if (neighbor && !neighbor.hasAttribute('block')) neighbors.push(neighbor); //if the neighbor exist and is not a wall
    }
  
    return neighbors;
}


