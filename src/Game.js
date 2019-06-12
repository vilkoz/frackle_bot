import React, { useReducer } from 'react';
const _ = require('lodash');

const initialState = {
	isGameFinished: false,
	isDiceThrowed: false,
	isDiceRolling: false,
	points: 0,
	diceNumber: 6,
	diceArray: undefined,
	selectedDices: new Set(),
}

const reducer = (state, action) => {
	switch (action.type) {
	case 'roll_dice':
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
		return { ...state, selectedDices }
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
			<button onClick={() => {
				dispatch({ type: 'roll_dice' });
				setTimeout(() => dispatch({ type: 'stop_dice_roll' }), 1000)
			}}>Roll Dice</button>
			{state.points > 0 && state.isDiceTrowed && <button>Finish Move</button>}
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
								// isSelected={state.selectedDices.has(index)}
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

export default Game;
