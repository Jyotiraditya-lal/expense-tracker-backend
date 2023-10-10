const express= require('express')
const ranking= require('../controllers/leaderboard')

const router= express.Router()

router.get('/leaderboard', ranking.getLeaderboard)
router.get('/leaderboard/rankings', ranking.getRanking)

module.exports= router