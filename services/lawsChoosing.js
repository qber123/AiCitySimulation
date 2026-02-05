const Law = require("../models/Law");
const Vote = require("../models/Vote");

async function lawsChoosing() {
    const allVotes = await Vote.find({});
    const voteMap = {};

    allVotes.forEach(vote => {
        voteMap[vote.lawId] = (voteMap[vote.lawId] || 0) + 1;
    });

    const topLawIdsWithCount = Object.entries(voteMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

    var ids = [];

    topLawIdsWithCount.forEach(pair => {
        ids.push(pair[0]);
    })

    //console.log(ids);

    const topLaws = await Law.find({
    _id: { $in: ids }
    });

    //console.log(topLaws);

    const values = topLaws.map(law => law.law);

    console.log(values);

    return values;
}


module.exports = lawsChoosing;