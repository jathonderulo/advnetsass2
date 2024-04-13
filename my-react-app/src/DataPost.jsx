import React, { useState } from 'react';

function DataPost() {
    const [gotData, setGotData] = useState({hi: "lol"});
    const [inputPostData, setInputPostData] = useState("");

    const postData = async () => {
        const array = inputPostData.split(' ');
        try {
            const response = await fetch('http://localhost:3001/api/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({PKey: array[0], Title: array[1], Content: array[2]})
            });
            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.error('Failed to send data:', error);
        } finally {
            getData();
        }
    }   

    const getData = async () => {
        try {
            const response = await fetch("http://localhost:3001/api/get", {
                method: "GET", // Only specify the method and headers if necessary
                // headers are not typically necessary unless you have specific requirements like authentication
            });
            const result = await response.json();
            console.log(result.Items);
            setGotData(result.Items.map(element => 
                element.content  
            ));
        } catch (error) {
            console.error('Failed to send data:', error);
        }
    };

    return (
        <div>
            <div>
                <input 
                type="text"
                value={inputPostData}
                onChange={(e) => {setInputPostData(e.target.value)}}
                placeholder="Enter a message here"
                />
                <button onClick={postData}>Post</button>
                <pre>{JSON.stringify(gotData, null, 2)}</pre>
            </div>
        </div>
    );
}


export default DataPost;
