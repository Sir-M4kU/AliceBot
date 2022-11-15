module.exports = {
	name: 'connectionError',
	execute(queue, error) {
		console.log(error);
		queue.metadata.channel.send('Ha ocurrido un error.');
	},
};