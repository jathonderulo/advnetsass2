import React, { useState, useEffect} from 'react';
import DataPost from './DataPost';

function UserWindow({num, data, postData}) {

    return (
        <div>
            <h2>User {num}</h2>
            <DataPost postData={postData}/> 
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    )
}

export default UserWindow;