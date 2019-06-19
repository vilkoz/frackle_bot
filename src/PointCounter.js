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

const checkSingles = (selectedDices, testForFrakle) => {
  const numbers = {};
  selectedDices.forEach((num) => {
    if (numbers.hasOwnProperty(num)) {
      numbers[num] += 1
    } else {
      numbers[num] = 1
    }
  });
  if (!testForFrakle) {
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

const PointCounter = (selectedDices, testForFrakle) => {
  let copySelectedDices = [...selectedDices]
  copySelectedDices.sort()
  const triplePairsScore = checkTriplePairs(copySelectedDices)
  if (triplePairsScore !== 0) {
    return triplePairsScore
  }
  let resScore = 0
  for (let similarCount = copySelectedDices.length; similarCount >= 3; similarCount--) {
    if (copySelectedDices.length < 3) {
      break
    }
    for (let offset = 0; offset <= copySelectedDices.length - similarCount; offset++) {
      const testArray = copySelectedDices.slice(offset, similarCount + offset)
      const numOfKindScore = checkNumOfKind(testArray, similarCount)
      if (numOfKindScore !== 0) {
        copySelectedDices = Array.concat(
          copySelectedDices.slice(0, offset),
          copySelectedDices.slice(similarCount + offset, copySelectedDices.lenght)
        )
        resScore += numOfKindScore
      }
    }
  }
  if (copySelectedDices.length >= 5) {
    for (let offset = 0; offset <= copySelectedDices.length - 5; offset++) {
      const straightScore = checkStraight(copySelectedDices.slice(offset, offset + 5))
      if (straightScore !== 0) {
        resScore += straightScore
        copySelectedDices = Array.concat(
          copySelectedDices.slice(0, offset),
          copySelectedDices.slice(5 + offset),
        )
        break
      }
    }
  }
  const singlesScore = checkSingles(copySelectedDices, testForFrakle)
  if (singlesScore !== 0) {
    copySelectedDices = copySelectedDices.filter(dice => (dice !== 1 && dice !== 5))
    resScore += singlesScore
  }
  console.log('frakle:', copySelectedDices)
  if (!testForFrakle && copySelectedDices.length !== 0) {
    return 0
  }
  return resScore
}

export default PointCounter
