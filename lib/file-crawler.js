const rll = require('read-last-lines');
const watch = require('node-watch');

const fileCrawler = async processLine => {
    watch(process.env.LOG_FILE_LOCATION, { recursive: false }, function(evt, name) {
        if (evt === 'update') {
            rll.read(process.env.LOG_FILE_LOCATION, 1)
            .then(line => {
                line = line.trim();
                console.log(line)
                
                processLine(line);
            });
        }
    });
};

module.exports = {
    fileCrawler
};