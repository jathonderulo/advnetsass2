import React, { useState } from 'react';

function DataPost({postData}) {
    const [inputPostData, setInputPostData] = useState("");

    return (
        <div>
            <div>
                <input 
                type="text"
                value={inputPostData}
                onChange={(e) => {setInputPostData(e.target.value)}}
                placeholder="Enter a message here"
                />
                <button onClick={() => {postData(inputPostData)}}>Post</button>
            </div>
        </div>
    );
}


export default DataPost;
