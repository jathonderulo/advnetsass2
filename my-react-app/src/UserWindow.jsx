import React, { useState, useEffect} from 'react';
import DataPost from './DataPost';

function UserWindow(props) {
    const data = [];

    for(let i = 0; i < props.data.length; i++) {
        data[i] = props.data[i];
    }

    return (
        <div>
            <h2>User {props.num}, Group {props.group}</h2>
            <DataPost postData={props.postData}/> 
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    )
}

export default UserWindow;