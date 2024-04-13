import React, {useState, useEffect, useCallback} from 'react';
import UserWindow from './UserWindow';
import './App.css';

function App() {
    const [ data, setData ] = useState({Place: "Holder"});
    const [triggerUpdate, setTriggerUpdate] = useState(false);

    const getData = useCallback(async () => {
        try {
            const response = await fetch("http://localhost:3001/api/get", {
                method: "GET", // Headers not necessary unless for specific reasons
            });
            const result = await response.json();
            console.log(result.Items);
            const sortedItems = result.Items.sort((a, b) => parseInt(a.PKey, 10) - parseInt(b.PKey, 10));
            setData(sortedItems.map(element => element.content));
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
                body: JSON.stringify({PKey: array[0], Title: array[1], Content: array[2]})
            });
            const result = await response.json();
            console.log(result);

            // Triggering getData after successful postData
            setTriggerUpdate(prev => !prev);  // Toggling state to force getData call
        } catch (error) {
            console.error('Failed to post data:', error);
        }
    }, []);
    
    // Effect to call getData whenever triggerUpdate changes
    useEffect(() => {
        getData();
    }, [getData, triggerUpdate]);

    return (
        <div className="app-container">
            <UserWindow num={1} group={1} postData={postData} data={data}/>
            <UserWindow num={2} group={1} postData={postData} data={data}/>
            <UserWindow num={3} group={2} postData={postData} data={data}/>
        </div>
    );
}

export default App;
