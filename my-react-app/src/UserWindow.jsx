import React, { useState, useEffect} from 'react';
import DataPost from './DataPost';

function UserWindow(props) {

    return (
        <div>
            <h2>{props.name}, Group {props.group}</h2>
            <DataPost postData={props.postData}/>
            {/* <ChatHistory/> */}
            {props.data}
        </div>
    )
}

export default UserWindow;