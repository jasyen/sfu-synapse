import React, { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { Typography, Button } from "@mui/material";

import Accordion from "react-bootstrap/Accordion";
import 'bootstrap/dist/css/bootstrap.min.css';
import SidepanelItem from "../SidepanelItem/SidepanelItem";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock } from '@fortawesome/free-solid-svg-icons'

import "./Sidepanel.css";

function ConnectionsSidepanel() {

    const [pendingConnections, setPendingConnections] = useState([])
    const [activeConnections, setActiveConnections] = useState([])
    const [clickedConnection, setClickedConnection] = useState(null)
    const [currentUserId, setCurrentUserId] = useState(null);
    const [error, setError] = useState(null)

    useEffect(() => {
        async function getCurrentLoginUser() {
            try {
                const response = await fetch("/api/currentuser")
                if (!response.ok) {
                    // eslint-disable-next-line no-throw-literal
                    throw {
                        message: "Failed to fetch current login user", 
                        statusText: response.statusText,
                        status: response.status
                    }
                }
                const data =  await response.json()
                setCurrentUserId(data[0].user_id)
            } catch (err) {
                console.log(err)
            }
        }
        getCurrentLoginUser()
    }, []);

    // Fetching pending connections
    useEffect(() => {
        async function getPendingConnections() {
            try {
                const response = await fetch(`/api/connections`)
                if (!response.ok) {
                    // eslint-disable-next-line no-throw-literal
                    throw {
                        message: "Failed to fetch pending connections", 
                        statusText: response.statusText,
                        status: response.status
                    }
                }
                const data =  await response.json()
                setPendingConnections(data)
            } catch (err) {
                console.log(err)
                setError(err)
            }
        }
        getPendingConnections()
    }, [])

    // Fetching active connections
    const { connectionId } = useParams()
    useEffect(() => {
        async function getActiveConnections() {
            try {
                const response = await fetch(`/api/connections/${connectionId}`)
                if (!response.ok) {
                    // eslint-disable-next-line no-throw-literal
                    throw {
                        message: "Failed to fetch active connections", 
                        statusText: response.statusText,
                        status: response.status
                    }
                }
                const data =  await response.json()
                setActiveConnections(data)
            } catch (err) {
                console.log(err)
                setError(err)
            }
        }
        getActiveConnections();
    }, [pendingConnections]) // Re-fetch whenever pendingConnections changed

    function renderAddButton(connectionId) {
        setClickedConnection(connectionId)
    }

    // Update the pending connection to be active 
    function handleUpdateConnection(connectionId) {

        console.log(`PUT request send from here with connection id: ${connectionId}`)

        const options = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ connection_id: connectionId }),
        };
        
        fetch(`/api/connections/${connectionId}`, options)
            .then((res) => res.json())
            .then((data) => {
                setPendingConnections((prevConnections) =>
                prevConnections.filter((connection) => 
                    connection.connection_id !== connectionId
                ));
            })
            .catch((err) => {
                console.log(err);
            });
    }

    // Map over activeConnections data return from backend
    const activeConnectionsEl = activeConnections.map((connection) => {
        return (
            <Accordion.Body key={connection.connection_id} style={{backgroundColor: '#11515c'}}>
                <SidepanelItem image={connection.userB_photo} title={connection.userB_username} />
            </Accordion.Body>
        )
    })

    // Map over the pendingConnections
    const pendingConnectionsEl = pendingConnections.map((connection) => {
        return (
            <Link 
                to={`/connections/${connection.connection_id}`}
                key={connection.connection_id}
                state={{ 
                    sender_id: currentUserId,
                    receiver_name: connection.userA_id === currentUserId ? connection.userB_username : connection.userA_username, 
                    pendingConnections: pendingConnections
                }}
                onClick={() => renderAddButton(connection.connection_id)}
            >
                <Accordion.Body style={{backgroundColor: '#11515c'}}>
                        <SidepanelItem
                            image={
                                connection.userA_id === currentUserId
                                    ? connection.userB_photo
                                    : connection.userA_photo
                            }
                            indicator={clickedConnection === connection.connection_id 
                                ? (<Button size="small" variant="contained" color="success" 
                                        onClick={() => handleUpdateConnection(connection.connection_id)}
                                        >
                                        <PersonAddIcon />
                                    </Button>) 
                                : null}
                                title={
                                    connection.userA_id === currentUserId
                                        ? connection.userB_username
                                        : connection.userA_username
                                }
                        />
                </Accordion.Body>
            </Link>
        )
    })

    if (error) {
        return <h4>There was an error: {error.message}</h4>
    }

    return (
        <div className="sidepanel-container">
            <Typography className="sidepanel-header" variant="h4" color="common.white" gutterBottom>
                Connections
            </Typography>
            <Accordion flush style={{backgroundColor: '#11515c'}} defaultActiveKey="0">
                <Accordion.Item style={{backgroundColor: '#11515c'}} eventKey="0">
                    <Accordion.Header style={{backgroundColor: '#11515c'}}>Active connections</Accordion.Header>
                        {activeConnectionsEl}
                </Accordion.Item>
            </Accordion>
            <Accordion flush style={{backgroundColor: '#11515c'}} defaultActiveKey="0">
                <Accordion.Item style={{backgroundColor: '#11515c'}} eventKey="0">
                    <Accordion.Header style={{backgroundColor: '#11515c'}}>Pending connections</Accordion.Header>
                        {pendingConnectionsEl}
                </Accordion.Item>
            </Accordion>
            <Accordion flush style={{backgroundColor: '#11515c'}} defaultActiveKey="0">
                <Accordion.Item style={{backgroundColor: '#11515c'}} eventKey="0">
                    <Accordion.Header style={{backgroundColor: '#11515c'}}>Inactive connections</Accordion.Header>
                    <Accordion.Body style={{backgroundColor: '#11515c'}}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate velit esse cillum dolore eu
                        fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                        non proident, sunt in culpa qui officia deserunt mollit
                        anim id est laborum.
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    );
}

function GroupsSidepanel() {
    return (
        <div className="sidepanel-container">
            <Typography className="sidepanel-header" variant="h4" color="common.white" gutterBottom>
                Groups
            </Typography>
            <Accordion flush style={{backgroundColor: '#11515c'}} defaultActiveKey="0">
                <Accordion.Item style={{backgroundColor: '#11515c'}} eventKey="0">
                    <Accordion.Header style={{backgroundColor: '#11515c'}}>Courses</Accordion.Header>
                    <Accordion.Body style={{backgroundColor: '#11515c'}}>
                        <SidepanelItem title="CMPT 372" subtitle="67 members" indicator=""/>
                        <SidepanelItem title="CMPT 371" subtitle="103 members" indicator="" />
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            <Accordion flush style={{backgroundColor: '#11515c'}}>
                <Accordion.Item style={{backgroundColor: '#11515c'}} eventKey="0">
                    <Accordion.Header style={{backgroundColor: '#11515c'}}>Communities</Accordion.Header>
                    <Accordion.Body style={{backgroundColor: '#11515c'}}>
                        <SidepanelItem title="Wildin'" subtitle="9 members" indicator={<FontAwesomeIcon icon={faLock}/>}/>
                        <SidepanelItem title="Dog Owners" subtitle="78 members" indicator=""/>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    )
}

function SettingsSidepanel() {
    const path = useLocation().pathname;

    function handleSettingsClick(event) {
        var items = document.querySelectorAll('.setting-item-div.active');

        if(items.length) 
            items[0].className = 'setting-item-div';

        event.target.className = 'setting-item-div active';
    }

    return (
        <div className="sidepanel-container">
            <Typography className="sidepanel-header" variant="h4" color="common.white" gutterBottom>
                Settings
            </Typography>
            <Link to="/setting/edit-profile">
                {(path === "/setting/edit-profile") ? 
                <div className="setting-item-div active" onClick={handleSettingsClick} >Edit Profile</div> : 
                <div className="setting-item-div" onClick={handleSettingsClick} >Edit Profile</div> 
                }
            </Link>
            <Link to="/setting/change-password">
                {(path === "/setting/change-password") ? 
                <div className="setting-item-div active" onClick={handleSettingsClick} >Change Password</div> : 
                <div className="setting-item-div" onClick={handleSettingsClick} >Change Password</div> 
                }
            </Link>
            <Link to="/setting/edit-course-enrollment">
                {(path === "/setting/edit-course-enrollment") ? 
                <div className="setting-item-div active" onClick={handleSettingsClick} >Edit Course Enrollment</div> : 
                <div className="setting-item-div" onClick={handleSettingsClick} >Edit Course Enrollment</div> 
                }
            </Link>
            <Link to="/setting/logout">
                {(path === "/setting/logout") ? 
                <div className="setting-item-div active" onClick={handleSettingsClick} >Logout</div> : 
                <div className="setting-item-div" onClick={handleSettingsClick} >Logout</div> 
                }
            </Link>
        </div>
    )
}

export default function Sidepanel(props) {
    return (
        <>
            {props.connections && <ConnectionsSidepanel />}
            {props.groups && <GroupsSidepanel />}
            {props.settings && <SettingsSidepanel />}
        </>
    );
}
