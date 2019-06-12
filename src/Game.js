import React, { useReducer } from 'react';
import PointCounter from './PointCounter';
const _ = require('lodash');

const initialState = {
	isGameFinished: false,
	isDiceThrowed: false,
	isDiceRolling: false,
	roundPoints: 0,
	throwPoints: 0,
	points: 0,
	diceNumber: 6,
	diceArray: undefined,
	selectedDices: new Set(),
}

const getSelectedDicesArray = (selectedDicesIndices, diceArray) => {
	const resArray = []
	for (const index of selectedDicesIndices) {
		resArray.push(diceArray[index])
	}
	return resArray
}

const reducer = (state, action) => {
	switch (action.type) {
	case 'roll_dice':
		if (state.selectedDices.size !== 0 && state.throwPoints !== 0) {
			const notSelectedCount = state.diceNumber - state.selectedDices.size
			const diceNumber = notSelectedCount <= 0 ? 6 : notSelectedCount
			return { ...state,
				isDiceRolling: true,
				isDiceThrowed: true,
				diceNumber: diceNumber,
				diceArray: _.range(diceNumber).map((num) => {
					return Math.ceil(Math.random() * 6)
				}),
				roundPoints: state.roundPoints + state.throwPoints,
				throwPoints: 0,
				selectedDices: new Set(),
			}
		}
		return { ...state,
			isDiceRolling: true,
			isDiceThrowed: true,
			diceArray: _.range(state.diceNumber).map((num) => {
				return Math.ceil(Math.random() * 6)
			})
		}
	case 'select_dice':
		const selectedDices = state.selectedDices
		if (selectedDices.has(action.index)) {
			selectedDices.delete(action.index)
		} else {
			selectedDices.add(action.index)
		}
		return { ...state,
			selectedDices,
			throwPoints: PointCounter(getSelectedDicesArray(state.selectedDices, state.diceArray))
		}
	case 'stop_dice_roll':
		return { ...state, isDiceRolling: false }
	default:
		throw new Error(`Not supported action type: ${action.type}`)
	}
}

const Cube = ({ number, onClick, isDiceRolling }) => {
	const cubeClassName = `cube${isDiceRolling ? ' animated' : ''}`
	return (
		<div className='cubeWrapper' onClick={onClick}>
			<div className={cubeClassName}>
				<div>{number}</div>
				<div>&nbsp;</div>
				<div>&nbsp;</div>
				<div className='shaded'>{((number + 1) % 6) + 1}</div>
				<div>&nbsp;</div>
				<div className='shaded'>{(number - 1) === 0 ? 6 : number - 1}</div>
			</div>
		</div>
	)
}

const Game = () => {
	const [state, dispatch] = useReducer(reducer, initialState)
	console.log(state)

	return (
		<div className='container'>
			<div>Score: {state.points}</div>
			<div>Round Score: {state.roundPoints}</div>
			<div>Throw Score: {state.throwPoints}</div>
			<button onClick={() => {
				dispatch({ type: 'roll_dice' });
				setTimeout(() => dispatch({ type: 'stop_dice_roll' }), 1000)
			}}>Roll Dice</button>
			{state.roundPoints > 0 && state.isDiceThrowed && <button>Finish Round</button>}
			<div className='diceTable'>
				{state.isDiceThrowed ?
					(
						state.diceArray.map((number, index) => {
							if (state.selectedDices.has(index)) {
								return undefined
							}
							return <Cube
								key={index}
								number={number}
								isDiceRolling={state.isDiceRolling}
								onClick={() => dispatch({ type: 'select_dice', index: index })}
							/>
						}
						)
					) : (
						<div>&nbsp;</div>
					)
				}
			</div>
			<div className='selectedDiceTable'>
				{state.isDiceThrowed ?
					(
						[...state.selectedDices].map((number) => {
							return <Cube
								key={number}
								number={state.diceArray[number]}
								onClick={() => dispatch({ type: 'select_dice', index: number })}
							/>
						}
						)
					) : (
						<div>&nbsp;</div>
					)
				}
			</div>
		</div>
	)
}

export default Game
