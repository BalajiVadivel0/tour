const Sentiment = require("sentiment");
const sentiment = new Sentiment();

function analyzeReview(text) {
    const result = sentiment.analyze(text);
    let sentimentLabel = "Neutral";
    if (result.score > 1) sentimentLabel = "Positive";
    else if (result.score < -1) sentimentLabel = "Negative";

    // Simple aspect detection (keywords)
    const aspects = [];
    if (text.toLowerCase().includes("food")) aspects.push("Food");
    if (text.toLowerCase().includes("clean") || text.toLowerCase().includes("hygiene")) aspects.push("Hygiene");
    if (text.toLowerCase().includes("service")) aspects.push("Service");
    if (text.toLowerCase().includes("price")) aspects.push("Price");
    if (text.toLowerCase().includes("crowd")) aspects.push("Crowd");

    return { sentiment: sentimentLabel, aspects };
}

module.exports = analyzeReview;
