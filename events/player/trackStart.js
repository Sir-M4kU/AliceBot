module.exports = {
	name: 'trackStart',
	execute(queue, track) {
		queue.metadata.channel.send(`Se esta reproduciendo **${track.title}**`);
	},
};