const Sequelize= require('sequelize')
const sequelize= require('../util/database')

const PasswordReq=sequelize.define('Password Requests',{
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    userid: Sequelize.INTEGER,
    isActive: Sequelize.BOOLEAN
}); 

module.exports= PasswordReq