var express = require('express');
var router = express.Router();
const requireAuth = require('../middleware/auth');
const processCity = require("../services/processCity");

const User = require("../models/User");
const Law = require("../models/Law");
const Vote = require("../models/Vote");
const City = require('../models/City');

router.post("/end", async function (req, res) {
    await processCity();
    return res.status(200).json({message: "round ended"});
});


router.post("/propose", requireAuth, async function (req, res) {
    const { law } = req.body;
    const userId = req.user._id;

    if (!userId) {
        return res.status(401).json({message: "User is unauthorize"});
    }

    if (!law) {
        return res.status(400).json({message: "Law text required"});
    }

    const existingLaw = await Law.findOne({ proposedBy: userId });

    if (existingLaw) {
        return res.status(409).json({message: "You already proposed a law"});
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

    const lawToVote = await Law.findOne({_id: lawId});

    if (!lawToVote) {
        return res.status(404).json({message: "There is no law with this id"});
    }

    if (lawToVote.proposedBy == userId) {
        return res.status(400).json({message: "You cannot vote for you'r own law"});
    }

    existingVote = await Vote.findOne({userId: userId});

    if (existingVote) {
        return res.status(409).json({message: "You already voted"});
    }

    try {
        const vote = await Vote.create({userId, lawId});
        return res.status(200).json({message: "You voted"});
    } catch (err){
        console.error("Failed to vote", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/getCityInfo", async function (req, res) {
    return res.status(200).json(await City.findOne());
});

router.get("/getLaws", async function (req, res){
    return res.status(200).json(await Law.find());
});



module.exports = router;