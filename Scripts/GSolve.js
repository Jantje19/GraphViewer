onmessage = evt => {
	const data = [];
	const lines = evt.data.points;

	for (let j = 0; j < lines.length; j++) {
		data[j] = [];

		for (let i = 0; i < lines[j].length - 1; i++) {
			try {
				const line1StartX = lines[0][i].x;
				const line1StartY = lines[0][i].y;
				const line1EndX = lines[0][i + 1].x;
				const line1EndY = lines[0][i + 1].y;

				const line2StartX = lines[1][i].x;
				const line2StartY = lines[1][i].y;
				const line2EndX = lines[1][i + 1].x;
				const line2EndY = lines[1][i + 1].y;

				data[j].push(checkLineIntersection(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY));
			} catch(err) {console.log(err); break;}
		}
	}

	if (data) processData(data);
	else console.log('No data')
}

function checkLineIntersection(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
	// if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
	var denominator, a, b, numerator1, numerator2, result = {
		x: null,
		y: null,
		onLine1: false,
		onLine2: false
	};
	denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
	if (denominator == 0) {
		return result;
	}
	a = line1StartY - line2StartY;
	b = line1StartX - line2StartX;
	numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
	numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
	a = numerator1 / denominator;
	b = numerator2 / denominator;

	// if we cast these lines infinitely in both directions, they intersect here:
	result.x = line1StartX + (a * (line1EndX - line1StartX));
	result.y = line1StartY + (a * (line1EndY - line1StartY));
/*
		// it is worth noting that this should be the same as:
		x = line2StartX + (b * (line2EndX - line2StartX));
		y = line2StartX + (b * (line2EndY - line2StartY));
		*/
	// if line1 is a segment and line2 is infinite, they intersect if:
	if (a > 0 && a < 1) {
		result.onLine1 = true;
	}
	// if line2 is a segment and line1 is infinite, they intersect if:
	if (b > 0 && b < 1) {
		result.onLine2 = true;
	}
	// if line1 and line2 are segments, they intersect if both of the above are true
	return result;
}

function processData(data) {
	const returnData = [];

	data.forEach((object, key) => {
		object.forEach(val => {
			if (val.onLine1 || val.onLine2)
				returnData.push(val);
		});
	});

	if (returnData.length > 0)
		postMessage(returnData);
}