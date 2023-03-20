import React from "react";
import { Link, useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";

import Accordion from "react-bootstrap/Accordion";
import 'bootstrap/dist/css/bootstrap.min.css';
import SidepanelItem from "../../pages/SidepanelItem/SidepanelItem";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock } from '@fortawesome/free-solid-svg-icons'

import "./Sidepanel.css";

function ConnectionsSidepanel() {

    const testData = [
        {
            id: 1,
            name: "Corey", 
        },
        {
            id: 2,
            name: "Luigi", 
        },
        {
            id: 3,
            name: "Toad"
        }
    ]

    // Testing: Map over fetched data for items in active connections
    const sidepanelItem = testData.map((item) => {
        return (
            <Link 
                to={`${item.id}`}
                key={item.id}
                state={{ activeConnections: item.name }}
            >
                <Accordion.Body style={{backgroundColor: '#11515c'}}>
                        <SidepanelItem title={item.name}/>
                </Accordion.Body>
            </Link>
        )
    })
    
    return (
        <div className="sidepanel-container">
            <Typography className="sidepanel-header" variant="h4" color="common.white" gutterBottom>
                Connections
            </Typography>
            <Accordion flush style={{backgroundColor: '#11515c'}} defaultActiveKey="0">
                <Accordion.Item style={{backgroundColor: '#11515c'}} eventKey="0">
                    <Accordion.Header style={{backgroundColor: '#11515c'}}>Active connections</Accordion.Header>
                        {sidepanelItem}
                </Accordion.Item>
            </Accordion>
            <Accordion flush style={{backgroundColor: '#11515c'}}>
                <Accordion.Item style={{backgroundColor: '#11515c'}} eventKey="0">
                    <Accordion.Header style={{backgroundColor: '#11515c'}}>Pending connections</Accordion.Header>
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

export default function Sidepanel(props) {
    return (
        <>
            {props.connections && <ConnectionsSidepanel />}
            {props.groups && <GroupsSidepanel />}
        </>
    );
}


/*
export default function Sidepanel(props) {
    return (
        <div className="sidepanel-container">
            <Accordion flush style={{backgroundColor: '#11515c'}} defaultActiveKey="0">
                <Accordion.Item style={{backgroundColor: '#11515c'}} eventKey="0">
                    <Accordion.Header style={{backgroundColor: '#11515c'}}>Active connections</Accordion.Header>
                    <Accordion.Body style={{backgroundColor: '#11515c'}}>
                        TODO: Separate this into a component i.e. connection content, and then create one for group content.
                        Separate component also need to be created for each item in the accordion.
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            <Accordion flush style={{backgroundColor: '#11515c'}}>
                <Accordion.Item style={{backgroundColor: '#11515c'}} eventKey="0">
                    <Accordion.Header style={{backgroundColor: '#11515c'}}>Pending connections</Accordion.Header>
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
*/