import React, { useState, useEffect} from 'react';
import DataPost from './DataPost';

function UserWindow(props) {

    return (
        <div>
            <h2>User {props.num}, Group {props.group}</h2>
            <DataPost postData={props.postData}/> 
            <pre>{JSON.stringify(props.data, null, 2)}</pre>
        </div>
    )
}

export default UserWindow;