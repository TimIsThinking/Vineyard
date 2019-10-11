const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const request = require('request');

const playerController = require('./api/controllers/player.js');

const { fileCrawler } = require('./lib/file-crawler.js');

let onlinePlayers = [];

const logOnlinePlayers = async () => setInterval(() => console.log('onlinePlayers', onlinePlayers), 60000);
logOnlinePlayers();

const processLine = async line => {
    console.log('line:', line);
    if (line.includes('<img=ico_swordone>') || line.includes('<img=ico_spear>') || line.includes('<img=ico_')) {
        // If a kill takes place
        console.log('PLAYER KILLED');

        const lineArray = line.split(' ');

        const playerName1 = line.slice(11, line.indexOf('<') - 1);
        const playerName2 = lineArray[lineArray.length - 1];

        console.log('player1', playerName1, 'has killed', 'player2', playerName2);

        try {
            // const guid1 = onlinePlayers.find(player => player.name === player1).guid;
            onlinePlayers.find(player => player.name === playerName1).kills++
            const player1 = onlinePlayers.find(player => player.name === playerName1);
            playerController.updatePlayersKills(player1.guid, player1.kills);
        } catch(e) {
            console.log('Player 1 not online!', e);
        }

        try {
            onlinePlayers.find(player => player.name === playerName2).deaths++
            const player2 = onlinePlayers.find(player => player.name === playerName1);
            playerController.updatePlayersDeaths(player2.guid, player2.deaths);
        } catch(e) {
            console.log('Player 2 not online!', e);
        }

    } else if (line.includes('has joined the game with ID:')) {
        // Player join
        console.log('PLAYER JOIN');

        const lineArray = line.split(' ');

        const playerName = lineArray[2];
        const guid = lineArray[lineArray.length - 1];

        request(`http://localhost:3000/players/${guid}`, {}, (err, res, body) => {
            const data = JSON.parse(body);
            let player;
            if (err) {
                playerController.createPlayer(playerName, guid);
                player = {
                    name: playerName,
                    guid: guid,
                    kills: 0,
                    deaths: 0
                };
            } else {
                player = {
                    name: playerName,
                    guid: guid,
                    kills: data.kills,
                    deaths: data.deaths
                }
            }

            onlinePlayers.push(player);
        })

    } else if (line.includes('has left the game with ID:')) {
        // Player left
        console.log('PLAYER LEFT');

        const lineArray = line.split(' ');
        const guid = lineArray[lineArray.length - 1];
        onlinePlayers.splice(onlinePlayers.findIndex(player => player.guid = guid), 1);

    } else if (line.includes(' Changed the map to ')) {
        // Map change
        console.log('MAP CHANGE');

        onlinePlayers = [];

    } else if (line.includes('SERVER has joined the game with ID: 0')) {
        // Server start
        console.log('SERVER START');

        onlinePlayers = [];
    }
}

const readDailyLogFile = async directory => {

    let currentLogFileName;

    setInterval(() => {
        const now = new Date;
        let day = now.getDate();
        let month = now.getMonth() + 1;
        day < 10 && (day = `0${day}`);
        month < 10 && (month = `0${month}`);
        const year = `${now.getFullYear()}`.slice(2);
        logFileName = `server_log_${month}_${day}_${year}`;

        if (currentLogFileName !== logFileName) {
            fileCrawler(`${directory}/${logFileName}`);
        }

    }, 60000)
}

readDailyLogFile(process.env.LOG_FILE_LOCATION);

try {
    mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
} catch (e) {
    console.log('Database connection error');
    console.log(e);
}

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require('./api/routes')(app);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log('Vineyard RESTful API server started on: ' + port));
