var express = require('express');
var router = express.Router();
const requireAuth = require('../middleware/auth');

const User = require("../models/User");
const Law = require("../models/Law");
const Vote = require("../models/Vote");


router.post("/propose", requireAuth, async function (req, res) {
    const { law } = req.body;
    const userId = req.user._id;
    //console.log(req);

    if (!law) {
        return res.status(400).json({message: "Law text required"});
    }

    try {
        const newLaw = await Law.create({law, proposedBy: userId});
        return res.status(200).json({message: "The law added"});
    } catch(err){
        console.error("Failed to propse a law", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/:lawId/vote", requireAuth, async function (req, res) {
    const userId = req.user._id;

    lawId = req.params.lawId;

    if (!lawId) {
        return res.status(400).json({message: "law id required"});
    }

    try {
        const vote = await Vote.create({userId, lawId});
        return res.status(200).json({message: "You voted"});
    } catch (err){
        console.error("Failed to vote", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;