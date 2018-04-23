import React from 'react';

const StatusPane = ({serverResponse, uiMessage}) => {

    return (
        <div className={uiMessage || serverResponse ? "statusPane" : "statusPaneHidden"}>
            {serverResponse ? (<div className="serverResponse">{serverResponse}</div>) : ""}
            {uiMessage ? <div className="uiMessage"> {uiMessage}</div> : ""}
        </div>
    )
};

export default StatusPane;