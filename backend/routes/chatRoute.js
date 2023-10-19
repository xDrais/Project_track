const express = require("express");
 const {
  accessChat, fetchChats, createGroupChat, renameGroup, removeFromGroup, addToGroup,
  /*
  fetchChats,
  createGroupChat,
  removeFromGroup,
  addToGroup,
  renameGroup,
  */
} = require("../Controllers/chatController"); 
const { protectSimpleUser,validator,isAdmin }= require('../Middelware/userMiddelware.js');

const router = express.Router();

router.route("/").post(protectSimpleUser, accessChat);
router.route("/").get(protectSimpleUser, fetchChats);
router.route("/group").post(protectSimpleUser, createGroupChat);
router.route("/rename").put(protectSimpleUser, renameGroup);
router.route("/groupremove").put(protectSimpleUser, removeFromGroup);
router.route("/groupadd").put(protectSimpleUser, addToGroup);

module.exports = router;
