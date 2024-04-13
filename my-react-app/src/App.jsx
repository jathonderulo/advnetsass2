import React from 'react';
import UserWindow from './UserWindow';
import './App.css';

function App() {
    return (
        <div className="app-container">
            <UserWindow num={1}/>
            <UserWindow num={2}/>
            <UserWindow num={3}/>
        </div>
    );
}

export default App;
