const express = require('express');
const { getAllUser, createUser,getUser,loginUser,getCount, deletUser,registerUser,updatePassword } = require('../controllers/users');
const router = express.Router();

router.get(`/`, getAllUser)
router.get(`/:id`, getUser)
router.post(`/`, createUser)
router.post(`/register`, registerUser)
router.post(`/login`, loginUser)
router.post(`/get/count`, getCount)
router.delete(`/:id`, deletUser)

router.put('/:id',updatePassword)

module.exports =router;