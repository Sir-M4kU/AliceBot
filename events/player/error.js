module.exports = {
	name: 'error',
	execute(queue, error) {
		console.log(error);
		queue.metadata.channel.send('Ha ocurrido un error');
	},
};