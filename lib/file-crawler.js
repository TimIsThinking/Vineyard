const rll = require('read-last-lines');
const watch = require('node-watch');

const fileCrawler = async (fileLocation, processLine) => {
    watch(fileLocation, { recursive: true }, function(evt, name) {
        if (evt === 'update') {
            rll.read(fileLocation, 3)
            .then(line => {
                line = line.trim();                
                processLine(line);
            });
        }
    });
};

module.exports = {
    fileCrawler
};