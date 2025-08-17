
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo, useReducer } from "react";


const initialGameState = {
    squares: Array(9).fill(null),
    gameLog: [] as { name: string, row: number, col: number }[],
    gameEnded: false,
    winner: -1,
    players: [] as { name: string, color: string }[]
}
function gameReducer(state: any, action: { type: string, index: number }) {
    switch (action.type) {
        case 'MAKE_MOVE':
            if (state.squares[action.index] !== null) {
                return state; // No change, let component handle alert
            }
            // whose move it is 
            let whoseMove = 0;
            if (state.gameLog.length > 0 && state.gameLog[state.gameLog.length - 1].name !== state.players[1].name) {
                whoseMove = 1;
            }
            const newSquares = [...state.squares];
            newSquares[action.index] = whoseMove + 1; // 0 is null
            const newGameLog = [
                ...state.gameLog,
                { name: state.players[whoseMove].name, row: Math.floor(action.index / 3), col: action.index % 3 }
            ];
            const winner = calculateVictory(newSquares);
            if (winner !== -1) {
                return { ...state, winner, squares: newSquares, gameLog: newGameLog };
            }
            return { ...state, squares: newSquares, gameLog: newGameLog, winner};
        case 'END_GAME':
            return { ...state, gameEnded: true };
        case 'RESET':
            return { ...state, squares: Array(9).fill(null), gameLog: [], gameEnded: false, winner: -1, players: state.players };
    }

}

function calculateVictory(newSquares: number[]) {
    // squares is 0 for null, 1 for player 0, 2 for player 2 (there is 9 values)
    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ]
    for (const combo of winningCombos) {
        if (combo.every(item => newSquares[item] === 1)) {
            return 0
        } else if (combo.every(item => newSquares[item] === 2)) {
            return 1
        }
    }
    // now is it mathematically impossible to win. If every squre is either 1 or 2, then it is a draw
    if (newSquares.every(item => item !== null)) {
        return -2
    }
    return -1
}

export default function Game() {

    const location = useLocation();
    const players = location.state.players;
    const initialStateWithPlayers = {
        ...initialGameState,
        players: players
    };
    const [gameState, dispatch] = useReducer(gameReducer, initialStateWithPlayers);

    const navigate = useNavigate()

    function handleMove(index: number) {
        if (gameState.squares[index] !== null) {
            alert('someone already moved there');
            return;
        }
        dispatch({type: 'MAKE_MOVE', index });
    }
    useEffect(() => {
        if (gameState.winner !== -1) {
            setTimeout(() => {
                dispatch({ type: 'END_GAME', index: -1 });
            }, 1000);
        }
    }, [gameState.winner])




    const getCellStyle = useMemo(() => {
        return (index: number) => {
            const cellValue = gameState.squares[index];
            let backgroundColor = 'white'; // default empty

            if (cellValue === 1) {
                backgroundColor = players[0].color; // Player 1's color
            } else if (cellValue === 2) {
                backgroundColor = players[1].color; // Player 2's color
            }

            return {
                border: '1px solid black',
                width: '100%',
                height: '100%',
                cursor: 'pointer',
                fontSize: '24px',
                fontWeight: 'bold',
                color: 'black',
                backgroundColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            };
        };
    }, [gameState.players, gameState.squares]);

    return (
        <div style={{ display: 'flex', width: '100vw', height: '100vh', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center' }}>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h3 style={{ textDecoration: 'underline' }}>Players</h3>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '40px' }}>
                    {gameState.players.map((player: { name: string, color: string }, index: number) => (
                        <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                            <h2>{player.name}</h2>
                            <div style={{
                                backgroundColor: player.color, width: '50px', height: '50px',
                                color: 'black', fontWeight: 'bold', fontSize: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                {index === 0 ? 'O' : 'X'}
                            </div>
                            {((gameState.gameLog.length === 0 && index === 0) || (gameState.gameLog.length > 0 && player.name !== gameState.gameLog[gameState.gameLog.length - 1].name)) &&
                                <button style={{
                                    backgroundColor: 'black',
                                    color: 'white',
                                    fontWeight: 'bold'
                                }}> Your Move</button>
                            }
                        </div>
                    )
                    )}
                </div>
            </div>

            {!gameState.gameEnded &&
                <div style={{ border: '1px solid black', width: '50vw', height: '50vh', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(3, 1fr)' }}>
                    {gameState.squares.map((_: any, index: number) => (
                        <div key={index} style={getCellStyle(index)}
                            onClick={() => handleMove(index)}
                        >
                            {gameState.squares[index] === 1 ? 'O' : gameState.squares[index] == 2 ? 'X' : ''}
                        </div>
                    ))}
                </div>
            }
            {gameState.gameEnded && gameState.winner != -1 && gameState.winner != -2 &&
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                <h2> Game is over, Player {players[gameState.winner].name} won the game, head back to lobby ✈️</h2>
                <button onClick={() => navigate('/')} >Back to lobby</button>
                <button onClick={() => dispatch({type: 'RESET', index: -1})} >Play again</button>
            </div>
            }
            {gameState.gameEnded && gameState.winner === -2 &&
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                <h2> Game is over, it was a draw, head back to lobby </h2>
                <button onClick={() => navigate('/')} >Back to lobby ✈️</button>
                <button onClick={() => dispatch({type: 'RESET', index: -1})} >Play again</button>
            </div>
            }

        </div>
    )

}
