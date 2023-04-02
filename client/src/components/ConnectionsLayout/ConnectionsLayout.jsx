import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidepanel from "../Sidepanel/Sidepanel";
import Notification from "../Notification/Notification"

import './ConnectionsLayout.css'
        
export default function ConnectionsLayout() {
    const path = useLocation().pathname

    const [onChatTab, setOnChatTab] = useState(false)
    const [connectionId, setConnectionId] = useState(null);

    const handleClickChat = ({ connectionId }) => {
        setConnectionId(connectionId)
    }

    useEffect(() => {
        if (path === `/connections/${connectionId}`) {
            setOnChatTab(true)
        } else {
            setOnChatTab(false)
        }
    }, [path, connectionId])

    return (
        <>
            <Sidepanel connections handleClickChat={handleClickChat}/>
            {onChatTab ? (
                <div className="connection-container">
                    <Outlet context={{from: path}}/>
                </div>
            ) : (
                <Notification />
            )}
        </>
    )
}