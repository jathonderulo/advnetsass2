import React, { useState, useEffect} from 'react';
import DataPost from './DataPost';
import PostHistory from './PostHistory'

function UserWindow(props) {

    return (
        <div>
            <h2>{props.name}, Group {props.group}</h2>
            <DataPost postData={props.postData}/>
            {/* <PostHistory/> */}
            {props.data}
        </div>
    )
}

export default UserWindow;