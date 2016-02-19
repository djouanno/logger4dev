const Tail = require('always-tail');
const fs = require('fs');
const ipcMain = require('electron').ipcMain;

const tailModule = (function () {
	var tail;

	const init = function () {
		ipcMain.on('watch', function (event, file) {
			if (fs.existsSync(file)) {
				if (tail === undefined || tail.filename !== file) {
					tail = new Tail(file);
					event.sender.send('filewatching', {filename: file});
					tail.on('line', function (line) {
						const log = {date: Date.now(), msg: line};
						event.sender.send('newLogEvent', log);
					});
				}
				tail.watch();
			} else {
				console.log('File not found');
				event.sender.send('error', 'File not found');
			}
		});

		ipcMain.on('unwatch', function (event, file) {
			if (fs.existsSync(file)) {
				if (tail && tail.filename === file) {
					tail.unwatch();
				}
			}
		});
	};

	return {init: init};
})();

module.exports = tailModule;
