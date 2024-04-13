import React, {useState, useEffect, useCallback, useMemo} from 'react';
import UserWindow from './UserWindow';
import './App.css';

function App() {
    const [data, setData] = useState({});
    const [users, setUsers] = useState([]);
    const [triggerUpdate, setTriggerUpdate] = useState(false);
    const [currentUser, setCurrentUser] = useState({ test: "Placeholder" });
    const getUsers = async () => {
        try {
            const response = await fetch("http://localhost:3001/api/getUsers", {
                method: "GET", // Headers not necessary unless for specific reasons
            });
            const result = await response.json();
            console.log("Items is " + result);
            setUsers(result);
        } catch (error) {
            console.error('wtf failed lol', error);
        }
    }
    
    const getData = useCallback(async () => {
        try {
            const url = new URL("http://localhost:3001/api/get");
            url.searchParams.append('PKey', 'One'); 

            const response = await fetch(url, {
                method: "GET", // Headers not necessary unless for specific reasons
            });
            const result = await response.json();
            console.log("Got " + result);
            setData({content: result});
        } catch (error) {
            console.error('Failed to send data:', error);
        }
    }, []); 

    const postData = useCallback(async (inputPostData) => {
        try {
            const array = inputPostData.split(' ');
            const response = await fetch('http://localhost:3001/api/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    PKey: array[0], 
                    Author: currentUser.name, 
                    Group: array[1], 
                    Title: array[2], 
                    Content: array[3]})
            });
            const result = await response.json();
            console.log("result is " + result.Message);

            // Triggering getData after successful postData
            setTriggerUpdate(prev => !prev);  // Toggling state to force getData call
        } catch (error) {
            console.error('Failed to post data:', error);
        }
    }, [currentUser]);

    // Effect to fetch users and data initially
    useEffect(() => {
        getUsers();
        getData();
    }, [getData]);

    // Effect to call getData whenever triggerUpdate changes
    useEffect(() => {
        getData();
    }, [getData, triggerUpdate]);

    const usersToDisplay = useMemo(() => users.map((user, i) => (
        <UserWindow 
            key={i} 
            name={user.name} 
            group={i % 2} 
            data={data.content} 
            setCurrentUser={setCurrentUser} 
            postData={postData} 
            user={user}
        />
    )), [users, data, postData]);

    return (
        <div className="app-container">
            <h1>H</h1>
            {usersToDisplay}

        </div>
    );
}

export default App;
