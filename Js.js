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
        console.log(graph);
        let result = this.bfs2(startVertex);

        if (!(finishVertex in result.previous))
            throw new Error(`No way from ${startVertex} To ${finishVertex}`);

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
function Dijkstra(matrix, start = 0) {
    const rows = matrix.length,
        cols = matrix[0].length;

    if (rows !== cols || start >= rows) {

    };

    const distance = new Array(rows).fill(Infinity);
    distance[start] = 0;

    for (let i = 0; i < rows; i++) {
        if (distance[i] < Infinity) {
            for (let j = 0; j < cols; j++) {
                if (matrix[i][j] + distance[i] < distance[j]) {
                    distance[j] = matrix[i][j] + distance[i];
                }
            }
            console.log(distance);
        }
    }
    return distance;
}
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
            row.innerHTML += `<td><input class="form-control" type="number" min="0" max="100" name="${i.toString() + j.toString()}" value="0"></td>`;
        }
        graph.addVertex(String.fromCharCode(i + 64));
    }
}
function changebuttons() {
    var sizematrix = document.getElementById("sizeMat");
    var value = sizematrix.options[sizematrix.selectedIndex].value;
    var button = document.getElementById("rendBut");
    var chooseHolder = document.getElementById("chooseHolder");
    chooseHolder.innerHTML += `<select id="startVertex" class="options vertex" size="1">` +
        `</select>`
    chooseHolder.innerHTML += `<select id="finishVertex" class="options vertex"  size="1">` +
        `</select>`
    addStartVertexOpt(value);
    addFinishVertexOpt(value);
    document.getElementById("sizeMat").innerHTML = `<select id="typeAlgorithm" class="options" size="1">` +
        `<option value="1">depth-first search</option>` +
        `<option value="2">breadth-first-search</option>` +
        `<option value="3">Finding the Shortest Path</option>` +
        `<option value="4">Dijkstra</option>` +
        `</select>`;
    document.getElementById("sizeMat").id = "typeAlgorithm";
    button.remove();
    document.getElementById("Buttons").innerHTML += '<button id="actButton" onclick="algDo()">Do</button>';
}
function algDo() {
    const matrix1 = [];
    for (var i = 0, row; row = matrix.rows[i]; i++) {
        var rowk = []
        for (var j = 0, col; col = row.cells[j]; j++) {
            if (col.children[0].value > 0) {
                graph.addEdge(String.fromCharCode(i + 65), String.fromCharCode(j + 65));
                rowk.push(parseInt(col.children[0].value))
            }
            else {

                rowk.push(Infinity);
            }
        }
        matrix1.push(rowk);
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
        case '4':
            dijkstraSearch(matrix1);
            break;
    }
}
function depthFirstSearch() {
    start = document.getElementById("startVertex").value;
    var result = graph.dfs(start);
    console.log(result);
    document.getElementById("result").innerHTML = result;
}
function breadthFirstSearch() {
    start = document.getElementById("startVertex").value;
    var result = graph.bfs(start);
    console.log(result);
    document.getElementById("result").innerHTML = result;
}
function findTheShortestPath() {
    start = document.getElementById("startVertex").value;
    end = document.getElementById("finishVertex").value;
    console.log(end);
    console.log(start);
    var result = graph.findShortestPath(start, end);
    console.log(result);
    document.getElementById("result").innerHTML = result;
}
function dijkstraSearch(matrix1) {
    start = document.getElementById("startVertex").value;
    console.log(start.charCodeAt(0) - 65);
    document.getElementById("result").innerHTML = Dijkstra(matrix1, start.charCodeAt(0) - 65);
}
function addStartVertexOpt(size) {
    startVertexGen = document.getElementById("startVertex");
    for (var i = 1; i < size; i++) {
        var opt = String.fromCharCode(i + 64);
        startVertexGen.innerHTML += `<option value="${opt}">${opt}</option>`
    }
}
function addFinishVertexOpt(size) {
    endVertexGen = document.getElementById("finishVertex");
    for (var i = 2; i <= size; i++) {
        var opt = String.fromCharCode(i + 64);
        endVertexGen.innerHTML += `<option value="${opt}">${opt}</option>`

    }
}