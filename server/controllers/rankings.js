exports.compute = function (points) {
	var score = Math.floor(points/10);

	switch (score) {
		case 0:
			return 0;
		case 1:
			return 1;
		default:
			return 2;
	}
}