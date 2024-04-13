import React, { useState } from 'react';
import DataPost from './DataPost';

function UserWindow(props) {

    return (
        <div>
            <h2>User {props.num}</h2>
            <DataPost/> 
        </div>
    )
}

export default UserWindow;