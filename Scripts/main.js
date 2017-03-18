/*
- G-Solve
- Show numbers improvement on axies
*/


let xMax = 5;
let yMax = 5;
let xMin = -5;
let yMin = -5;
let graphs = [];

const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'white'];

Vector.prototype.viewPort = function() {
	this.x = Math.floor(this.x.map(xMin, xMax, 0, canvas.width));
	this.y = Math.floor(this.y.map(yMin, yMax, canvas.height, 0));
	return this;
}

function setup() {
	canvas = new Canvas(document.getElementById('canvas'), 'auto', document.body.scrollHeight / 2);

	calc();

	document.getElementById('x').min = xMin;
	document.getElementById('x').max = xMax;
	document.getElementById('y').min = yMin;
	document.getElementById('y').max = yMax;

	alert('Use scrollwheel to zoom.\nUse up/down/left/right keys to change the viewport.');

	document.getElementById('calc').addEventListener('click', calc);

	document.getElementById('accuracy').addEventListener('change', evt => {
		document.getElementById('accuracyLabel').innerText = 'Accuracy: ' + Number(evt.target.value).map(1, 20, 20, 1) / 10;
	});

	document.getElementById('playPause').addEventListener('click', evt => {
		if (int) {
			noLoop();
			evt.target.innerText = 'Play';
		} else {
			loop();
			evt.target.innerText = 'Pause';
		}
	});

	document.getElementById('updateViewport').addEventListener('click', evt => {
		xMax = Number(document.getElementById('xMax').value);
		yMax = Number(document.getElementById('yMax').value);
		xMin = Number(document.getElementById('xMin').value);
		yMin = Number(document.getElementById('yMin').value);

		calc();
	});

	document.getElementById('addEquation').addEventListener('click', evt => {
		const div = evt.target.parentElement.querySelector('div').cloneNode(true);
		evt.target.parentElement.appendChild(div);
	});

	document.getElementById('x-call').addEventListener('change', evt => {

	});

	document.getElementById('y-call').addEventListener('change', evt => {

	});

	window.addEventListener('keydown', evt => {
		if (evt.key == 'ArrowUp') {yMin--; yMax--; calc(); evt.preventDefault();}
		if (evt.key == 'ArrowDown') {yMin++; yMax++; calc(); evt.preventDefault();}
		if (evt.key == 'ArrowLeft') {xMin--; xMax--; calc(); evt.preventDefault();}
		if (evt.key == 'ArrowRight') {xMin++; xMax++; calc(); evt.preventDefault();}
	});

	canvas.canvas.addEventListener('wheel', evt => {
		evt.preventDefault();

		if (Math.max(xMin, yMin) < 50 && Math.min(xMax, yMax) > 0) {
			if (evt.deltaY > 0 ) {
				xMax++; xMin--; yMax++; yMin--;
			} else {
				xMax--; xMin++; yMax--; yMin++;
			}

			calc();
		}
	});
}

function draw() {
	canvas.background();

	axies();

	let x = Number(document.getElementById('x').value);
	let y = Number(document.getElementById('y').value);
	const pos = new Vector(x, y).viewPort();

	canvas.circle(pos.x, pos.y, 3);

	graphs.forEach((object, key) => {
		for (let i = 0; i < object.length - 1; i++) {
			const first = object[i];
			const second = object[i + 1];
			const col = colors[key.map(0, graphs.length, 0, colors.length - 1)];

			canvas.line(first.x, first.y, second.x, second.y, 1, col);
		}
	});

	canvas.text(`x: ${x} y: ${y}`, pos.x, pos.y - 5);
}

function calc() {
	graphs = [];

	document.getElementById('equations').querySelectorAll('div').forEach((object, key) => {
		const a = Number(object.querySelector('#a').value);
		const b = Number(object.querySelector('#b').value);
		const c = Number(object.querySelector('#c').value);
		const sqn = Number(object.querySelector('#sqn').value);
		let formula = object.querySelector('#equation').value;

		formula = formula.replace(/([0-9]+|\w+)\^([0-9]+|\w+)/, 'Math.pow($1, $2)');

		try {eval(formula)} catch(err) {alert(err); formula = 2};

		graphs.push(getPoints(formula, a, b, c, sqn));
	});
}

function getPoints(formula, a, b, c, sqn) {
	const points = [];
	const accuracy = Number(document.getElementById('accuracy').value) / 10;

	for (let i = 0; i < (xMax - xMin); i += accuracy) {
		let y = 0;
		let x = i.map(0, (xMax - xMin), xMin, xMax);

		try {
			y = eval(formula);
		} catch(err) {
			y = 0;
		}

		const pos = new Vector(x, y).viewPort();

		points.push({x: pos.x, y: pos.y});
	}

	return points;
}

function axies() {
	const x = 0;
	const y = 0;
	const indicatorLinesLen = 5;
	const pos = new Vector().viewPort();

	canvas.line(pos.x, 0, pos.x, canvas.height, 1, 'white');
	canvas.line(0, pos.y, canvas.width, pos.y, 1, 'white');

	for (let i = xMin; i < (xMax - xMin); i++) {
		const pos = new Vector(i, 0).viewPort();
		canvas.line(pos.x, pos.y - indicatorLinesLen, pos.x, pos.y + indicatorLinesLen, 1, 'white');
		canvas.text(i, pos.x - 3, pos.y + 13);
	}

	for (let i = yMin; i < (yMax - yMin); i++) {
		const pos = new Vector(0, i).viewPort();
		canvas.line(pos.x - indicatorLinesLen, pos.y, pos.x + indicatorLinesLen, pos.y, 1, 'white');
		canvas.text(i, pos.x + 6, pos.y + 3);
	}
}