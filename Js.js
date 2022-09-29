class Graph {
    constructor() {
        this.vertices = {};
    }

    addVertex(value) {
        if (!this.vertices[value]) {
            this.vertices[value] = [];
        }
    }

    addEdge(vertex1, vertex2) {
        if (!(vertex1 in this.vertices) || !(vertex2 in this.vertices)) {
            throw new Error('No edges');
        }

        if (!this.vertices[vertex1].includes(vertex2)) {
            this.vertices[vertex1].push(vertex2);
        }
        if (!this.vertices[vertex2].includes(vertex1)) {
            this.vertices[vertex2].push(vertex1);
        }
    }
    dfs(startVertex) {
        let list = this.vertices;
        let stack = [startVertex]; 
        let visited = { [startVertex]: 1 };
        var enges = [];
        function handleVertex(vertex) {
            enges.push(vertex);
            let reversedNeighboursList = [...list[vertex]].reverse();
            reversedNeighboursList.forEach(neighbour => {
                if (!visited[neighbour]) {
                    visited[neighbour] = 1;
                    stack.push(neighbour);
                }
            });
        }
        while (stack.length) {
            let activeVertex = stack.pop();
            handleVertex(activeVertex);
        }
        stack = Object.keys(this.vertices);

        while (stack.length) {
            let activeVertex = stack.pop();
            if (!visited[activeVertex]) {
                visited[activeVertex] = 1;
                handleVertex(activeVertex);
            }
        }
        return enges;
    }
    bfs(startVertex) {
        let list = this.vertices;
        let queue = [startVertex];
        let visited = { [startVertex]: 1 };
        var enges = [];
        function handleVertex(vertex) {
            enges.push(vertex);
            let neighboursList = list[vertex];
            neighboursList.forEach(neighbour => {
                if (!visited[neighbour]) {
                    visited[neighbour] = 1;
                    queue.push(neighbour);
                }
            });
        }

        while (queue.length) {
            let activeVertex = queue.shift();
            handleVertex(activeVertex);
        }

        queue = Object.keys(this.vertices);

        while (queue.length) {
            let activeVertex = queue.shift();
            if (!visited[activeVertex]) {
                visited[activeVertex] = 1;
                handleVertex(activeVertex);
            }
        }
        return enges;
    }
    bfs2(startVertex) {
        let list = this.vertices;
        let queue = [startVertex];
        let visited = { [startVertex]: 1 };
        let distance = { [startVertex]: 0 };
        let previous = { [startVertex]: null };

        function handleVertex(vertex) {
            let neighboursList = list[vertex];

            neighboursList.forEach(neighbour => {
                if (!visited[neighbour]) {
                    visited[neighbour] = 1;
                    queue.push(neighbour);
                    previous[neighbour] = vertex;
                    distance[neighbour] = distance[vertex] + 1;
                }
            });
        }

        while (queue.length) {
            let activeVertex = queue.shift();
            handleVertex(activeVertex);
        }

        return { distance, previous }
    }
    findShortestPath(startVertex, finishVertex) {
        let result = this.bfs2(startVertex);

        if (!(finishVertex in result.previous))
            throw new Error(`Нет пути из вершины ${startVertex} в вершину ${finishVertex}`);

        let path = [];

        let currentVertex = finishVertex;

        while (currentVertex !== startVertex) {
            path.unshift(currentVertex);
            currentVertex = result.previous[currentVertex];
        }

        path.unshift(startVertex);

        return path;
    }
}
const graph = new Graph();
function renderTable() {
    var sizematrix = document.getElementById("sizeMat");
    var value = sizematrix.options[sizematrix.selectedIndex].value;
    console.log(value);
    renderRows(value)
    renderColumn(value);
    changebuttons();
}
function renderRows(size) {
    var matrix = document.getElementById("matrix");
    for (var i = 1; i <= size; i++) {
        matrix.innerHTML += `<tr id="${"r" + i.toString()}"></tr>`;
    }
}
function renderColumn(size) {
    for (var i = 1; i <= size; i++) {
        for (var j = 1; j <= size; j++) {
            var row = document.getElementById(`${"r" + i.toString()}`);
            row.innerHTML += `<td><input class="form-control" type="number" min="0" name="${i.toString() + j.toString()}" value="0"></td>`;
        }
        graph.addVertex(`${i}`);
    }
}
function changebuttons() {
    var sizematrix = document.getElementById("sizeMat");
    var value = sizematrix.options[sizematrix.selectedIndex].value;
    var button = document.getElementById("rendBut");
    var chooseHolder = document.getElementById("chooseHolder");
    chooseHolder.innerHTML += `<select id="startVertex" size="1">` +
        `</select>`
    chooseHolder.innerHTML += `<select id="finishVertex" size="1">` +
        `</select>`
    addStartVertexOpt(value);
    addFinishVertexOpt(value);
    document.getElementById("sizeMat").innerHTML = `<select id="typeAlgorithm" size="1">` +
        `<option value="1">depth-first search</option>` +
        `<option value="2">breadth-first-search</option>` +
        `<option value="3">Finding the Shortest Path</option>` +
        `</select>`;
    document.getElementById("sizeMat").id = "typeAlgorithm";
    button.remove();
    document.getElementById("Buttons").innerHTML += '<button id="actButton" onclick="algDo()">Do</button>';
}
function algDo() {
    for (var i = 0, row; row = matrix.rows[i]; i++) {
        for (var j = 0, col; col = row.cells[j]; j++) {
            if (col.children[0].value > 0) {
                graph.addEdge((i + 1).toString(), (j + 1).toString());
            }
        }
    }
    var typeAlgorith = document.getElementById("typeAlgorithm");
    var value = typeAlgorith.options[typeAlgorith.selectedIndex].value;
    console.log(value)
    switch (value) {
        case '1':
            depthFirstSearch();
            break;
        case '2':
            breadthFirstSearch();
            break;
        case '3':
            findTheShortestPath();
            break;
    }
}
function depthFirstSearch() {
    start = document.getElementById("startVertex").value;
    var result = graph.dfs(start.toString());
    console.log(result);
    document.getElementById("result").innerHTML = result;
}
function breadthFirstSearch() {
    start = document.getElementById("startVertex").value;
    var result = graph.bfs(start.toString());
    console.log(result);
    document.getElementById("result").innerHTML = result;
}
function findTheShortestPath() {
    start = document.getElementById("startVertex").value;
    end = document.getElementById("finishVertex").value;
    var result = graph.findShortestPath(start.toString(), end.toString());
    console.log(result);
    document.getElementById("result").innerHTML = result;
}
function addStartVertexOpt(size) {
    startVertexGen = document.getElementById("startVertex");
    for (var i = 1; i < size; i++) {
        startVertexGen.innerHTML += `<option value="${i}">${i}</option>`
    }
}
function addFinishVertexOpt(size) {
    endVertexGen = document.getElementById("finishVertex");
    for (var i = 2; i <= size; i++) {
        endVertexGen.innerHTML += `<option value="${i}">${i}</option>`
    }
}