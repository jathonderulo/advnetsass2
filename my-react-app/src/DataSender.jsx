import React, { useState } from 'react';

function DataSender() {
    const [inputGetData, setInputGetData] = useState(""); 
    const [inputPostData, setInputPostData] = useState("");
    const [gotData, setGotData] = useState({});
    const [postedData, setPostedData] = useState({});
  
    const getData = async () => {
        try {
            const url = new URL("http://localhost:3001/api/get");
            url.searchParams.append("PKey", inputGetData);
            const response = await fetch(url, {
                method: "GET", // Only specify the method and headers if necessary
                // headers are not typically necessary unless you have specific requirements like authentication
            });
            const result = await response.json();
            console.log(result);
            setGotData(result.item);
        } catch (error) {
            console.error('Failed to send data:', error);
        }
    };

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
            // setPostedData(response.body);
        } catch (error) {
            console.error('Failed to send data:', error);
        } 
    }

    return (
        <div>
            <div>
                <input 
                type="text"
                value={inputGetData}
                onChange={(e) => {setInputGetData(e.target.value)}}
                placeholder="Enter a message here"
                />
                <button onClick={getData}>Get data from DB</button>
                <pre>{JSON.stringify(gotData, null, 2)}</pre>
            </div>
            <div>
                <input 
                type="text"
                value={inputPostData}
                onChange={(e) => {setInputPostData(e.target.value)}}
                placeholder="Enter a message here"
                />
                <button onClick={postData}>Post data to DB</button>
                {inputPostData}
                <pre>{JSON.stringify(postedData, null, 2)}</pre>
            </div>
        </div>
    );
}


export default DataSender;
