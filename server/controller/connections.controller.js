const db = require("../db/connection.db").pool
const { v4: uuidv4 } = require('uuid');

// create Pending connetion: Sender sends a msg to a receiver
const createPendingConnection = (req, res) => {

    const { sender_id, receiver_id } = req.body

    const insertQuery = "INSERT INTO Connections (connection_id, userA_id, userB_id, Status) VALUES (?, ?, ?, ?)"

    db.query(insertQuery, [uuidv4(), sender_id, receiver_id, "pending"], (err, data) => {
        if (err) {
            console.log(err)
            res.status(500).json("Internal server error")
        } else {
            res.status(200).json("Connection created successfully")
        }
    })
}

const getPendingConnections = (req, res) => {

    if (!req.session || !req.session.user) {
        return res.sendStatus(401)
    }

    const userId = req.session.user.user_id

    // GET data with the login user 
    // JOIN Connections table with Users table
    const query = `SELECT c.connection_id, c.status, 
                        c.userA_id, c.userB_id,
                        ua.username AS userA_username, 
                        ub.username AS userB_username, 
                        ua.photo AS userA_photo, 
                        ub.photo AS userB_photo
                    FROM Connections c 
                    JOIN Users ua ON c.userA_id = ua.user_id 
                    JOIN Users ub ON c.userB_id = ub.user_id
                    WHERE c.status = 'pending'
                    AND (c.userA_id = ? OR c.userB_id = ?)`

    db.query(query, [userId, userId], (err, data) => {
        if (err) {
            console.log(err)
            res.status(500).json("Internal server error")
        } else {

            if (data || data.length > 0) {
                res.status(200).json(data)
            } else { 
                console.log("No pending connections found")
                res.status(404).json("No pending connections found")
            }
        }
    })
}

const checkExistingPending = (req, res) => {
    const { sender_id, receiver_id } = req.params

    const query = ` SELECT * FROM Connections
                WHERE (userA_id = ? AND userB_id = ?)
                OR (userA_id = ? AND userB_id = ?)
                AND status = 'pending'`

    db.query(query, [sender_id, receiver_id, receiver_id, sender_id], (err, data) => {
        if (err) {
            console.log(err)
            res.status(500).json("Internal server error")
        } else {
            if (data || data.length > 0) {
                res.status(200).json(data)
            } else { 
                res.status(404).json("No exist pending connections found")
            }
        }
    })
}

// update Pending connection to be Active: Receiver replies to the sender
const updatePendingToActive = (req, res) => {
    const { connection_id } = req.body

    // Check if the conection exists and the status is Pending
    const selectQuery = "SELECT * FROM Connections WHERE connection_id = ? AND status = 'pending'"

    db.query(selectQuery, [connection_id], (err, data) => {
        if (err) {
            console.log(err)
            res.status(500).json("Internal server error")
        } else {
            if (!data || data.length === 0) {
                res.status(404).json("Connection not found")
            } else {
                
                // Pending conection exists and update it to be Active
                const updateQuery = "UPDATE Connections SET status = ? WHERE connection_id = ?"
                db.query(updateQuery, ["active", connection_id], (err, data) => {
                    if (err) {
                        console.log(err)
                        res.status(500).json("Internal server error")
                    } else {
                        res.status(200).json(data)
                    }
                })
            }
        }
    })
}

const getActiveConnections = (req, res) => {

    if (!req.session || !req.session.user) {
        return res.sendStatus(401)
    }

    const userId = req.session.user.user_id

    const query = `SELECT c.connection_id, c.status, 
                        c.userA_id, c.userB_id,
                        ua.username AS userA_username, 
                        ub.username AS userB_username,
                        ua.photo AS userA_photo, 
                        ub.photo AS userB_photo
                    FROM Connections c 
                    JOIN Users ua ON c.userA_id = ua.user_id 
                    JOIN Users ub ON c.userB_id = ub.user_id
                    WHERE c.status = 'active'
                    AND (c.userA_id = ? OR c.userB_id = ?)`

    db.query(query, [userId, userId], (err, data) => {
        if (err) {
            console.log(err)
            res.status(500).json("Internal server error")
        } else {

            if (data || data.length > 0) {
                res.status(200).json(data)
            } else { 
                console.log("No active connections found")
                res.status(404).json("No active connections found")
            }
        }
    })
}

const getInactiveConnections = (req, res) => {

    if (!req.session || !req.session.user) {
        return res.sendStatus(401)
    }

    const userId = req.session.user.user_id

    const selectQuery = `SELECT c.connection_id, c.status, 
                            c.userA_id, c.userB_id,
                            ua.username AS userA_username, 
                            ub.username AS userB_username, 
                            ua.photo AS userA_photo, 
                            ub.photo AS userB_photo
                        FROM Connections c 
                        JOIN Users ua ON c.userA_id = ua.user_id 
                        JOIN Users ub ON c.userB_id = ub.user_id
                        WHERE c.status = 'Inactive'
                        AND (c.userA_id = ? OR c.userB_id = ?)`

    db.query(selectQuery, [userId, userId], (err, data) => {
        if (err) {
            console.log(err)
            res.status(500).json("Internal server error")
        } else {
            if (data || data.length > 0){
                res.status(200).json(data)
            } else {
                console.log("No inactive connections found")
                res.status(404).json("No inactive connections found")
            }
        }
    })
}

const endConnection = (req,res) => {
    const connectionId = req.params.connectionId;
    const qDisconnect = "DELETE FROM Connections WHERE connection_id = ?"
    db.query(qDisconnect, [connectionId], (err,result) => {
        if (err) return res.status(500).json(err)
        return res.status(200).json("Disconnected successfully.")
    })
}

const updateActiveToInactive = (req, res) => {

}

module.exports = { 
    createPendingConnection, 
    getPendingConnections, 
    checkExistingPending,
    updatePendingToActive, 
    getActiveConnections, 
    getInactiveConnections,
    updateActiveToInactive,
    endConnection
}