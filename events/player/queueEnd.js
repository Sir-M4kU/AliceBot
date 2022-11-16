module.exports = {
	name: 'queueEnd',
	execute(queue) {
		queue.metadata.channel.send('La lista ha acabado.');
	},
};