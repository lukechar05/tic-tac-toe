import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Setup() {

    const [players, setPlayers] = useState([
        { name: '', color: 'red' },
        { name: '', color: 'blue' },
    ]);
    const navigate = useNavigate();
    function navigateToGame() {
        if (players[0].name === '' || players[1].name === '') {
            alert('Please enter a name for both players');
            return;
        }
        navigate('/game', { state: { players } });
    }
    return (
        <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 0, margin: 0 }}>
            <div style={{ width: '500px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '20px', alignItems: 'center' }}>
                <h1> 🕹️ Player Setup 🕹️ </h1>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '40px' }}>
                    {players.map((player, index) => (
                        <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <h3 style={{ textDecoration: 'underline' }}>{`Player ${index + 1}`}</h3>
                            <input style={{ border: '1px solid gray', width: '200px', height: '40px' }} type="text" placeholder="Player Name" value={player.name} onChange={(e) => setPlayers(prev => {
                                const newPlayers = [...prev];
                                newPlayers[index].name = e.target.value;
                                return newPlayers;
                            })} />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>🎨</span>
                                <input style={{
                                    width: '100%',
                                    height: '25px',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer'
                                }} type="color" value={player.color} onChange={(e) => setPlayers(prev => {
                                    const newPlayers = [...prev];
                                    newPlayers[index].color = e.target.value;
                                    return newPlayers;
                                })} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <button style={{ marginTop: '50px', width: '120px', height: '32px' }} onClick={() => navigateToGame()}>Start Game</button>
        </div>
    );
}