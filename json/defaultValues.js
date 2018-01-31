/*jshint esversion: 6 */
var defaultHots = `
{
"frames": [
    {
        "index": 0,
        "text": "Grubby",
        "icon": "i14830"
    },
    {
        "index": 1,
        "text": "Hero",
        "icon": "i635"
    }]
}`;

var defaultNano = `
{
    "frames": [
    {
        "index": 0,
        "text": "ERROR",
        "icon": "i2493"
    }]
}`;

var defaultEthWallet = `
{
"frames": [
    {
        "text": "Enter your wallet address",
        "icon": "i555"
    }]
}`;
var errorEthWallet = `
{
    "frames": [
    {
        "text": "Enter good wallet address",
        "icon": "i555"
    }]
}`;
module.exports = {
    defaultHots,
    defaultNano,
    defaultEthWallet,
    errorEthWallet
};