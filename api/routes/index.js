const authRoutes = require('./auth.js')
const userRoutes = require('./user.js')
const playerRoutes = require('./player.js')
// const verifyToken = require('../middleware/verifyToken')
// const checkIfAdmin = require('../middleware/accessRights')

module.exports = function (app) {
    // app.use('/servers', verifyToken, checkIfAdmin, serverRoutes)
    app.use('/auth', authRoutes)
    app.use('/users', userRoutes)
    app.use('/players', playerRoutes)

    app.use((req, res) => {
        res.status(404).send({
            message: 'Not found'
        });
    });
}