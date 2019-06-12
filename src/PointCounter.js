const _ = require('lodash');

const checkTriplePairs = (selectedDices) => {
	if (selectedDices.length !== 6) {
		return 0
	}
	const numbers = {};
	selectedDices.forEach((num) => {
		if (numbers.hasOwnProperty(num)) {
			numbers[num] += 1
		} else {
			numbers[num] = 1
		}
	});
	console.log(numbers)
	let isFailed = false
	_.forOwn(numbers, (count, num) => {
		if (count !== 2) {
			isFailed = true
		}
	})
	if (!isFailed) {
		return 750
	}
	return 0
}

const checkNumOfKind = (selectedDices, num) => {
	if (selectedDices.length !== num) {
		return 0
	}
	const count = _.reduce(selectedDices, (count, num) => {
		if (num === selectedDices[0]) {
			return count + 1
		}
		return 0
	}, 0)
	if (count !== num) {
		return 0
	}
	const diceNumber = selectedDices[0] === 1 ? 10 : selectedDices[0]
	return diceNumber * 100 * Math.pow(2, count - 3)
}

const checkStraight = (selectedDices) => {
	if (selectedDices.length !== 5) {
		return 0
	}
	const sorted = _.sortBy(selectedDices)
	const  required = [1,2,3,4,5]
	const isEqual = sorted.map((value, index) => value === required[index])
		.every((elem) => elem === true)
	if (isEqual) {
		return 1500
	}
	return 0
}

const checkSingles = (selectedDices) => {
	const numbers = {};
	selectedDices.forEach((num) => {
		if (numbers.hasOwnProperty(num)) {
			numbers[num] += 1
		} else {
			numbers[num] = 1
		}
	});
	let isFailed = false
	_.forOwn(numbers, (count, num) => {
		const n = parseInt(num)
		if (n !== 5 && n !== 1) {
			isFailed = true
		}
	})
	if (isFailed) {
		return 0
	}
	let res = 0
	if (numbers.hasOwnProperty(1)) {
		res += numbers[1] * 100
	}
	if (numbers.hasOwnProperty(5)) {
		res += numbers[5] * 50
	}
	return res
}

const PointCounter = (selectedDices) => {
	const triplePairsScore = checkTriplePairs(selectedDices)
	if (triplePairsScore !== 0) {
		return triplePairsScore
	}
	for (let i = 6; i >= 3; i = i - 1) {
		const numOfKindScore = checkNumOfKind(selectedDices, i)
		if (numOfKindScore !== 0) {
			return numOfKindScore
		}
	}
	const straightScore = checkStraight(selectedDices)
	if (straightScore !== 0) {
		return straightScore
	}
	const singlesScore = checkSingles(selectedDices)
	if (singlesScore !== 0) {
		return singlesScore
	}
	return 0
}

export default PointCounter
