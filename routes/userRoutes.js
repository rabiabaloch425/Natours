const express = require('express');
const fs  = require('fs');
getAllUsers = (req,res) => {
  res.status(500).json({
    status: 'error',
    message: 'This Route is not defined yet'
  })
}
getUser = (req,res) => {
  res.status(500).json({
    status: 'error',
    message: 'This Route is not defined yet'
  })
}
createUser = (req,res) => {
  res.status(500).json({
    status: 'error',
    message: 'This Route is not defined yet'
  })
}
updateUser = (req,res) => {
  res.status(500).json({
    status: 'error',
    message: 'This Route is not defined yet'
  })
}
deleteUser = (req,res) => {
  res.status(500).json({
    status: 'error',
    message: 'This Route is not defined yet'
  })
}

//3) Router (Called Mounting)
const router = express.Router();
router.route('/').get(getAllUsers).post(createUser)
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)

module.exports = router;