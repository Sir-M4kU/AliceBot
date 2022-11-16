module.exports = {
	name: 'botDisconnect',
	execute(queue) {
		queue.metadata.channel.send('Me han sacado del canal...\nLimpiando lista.');
	},
};