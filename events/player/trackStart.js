const { EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'trackStart',
	execute(queue, track) {
		queue.metadata.channel.send({
			embeds: [ new EmbedBuilder()
				.setColor('Aqua')
				.setTitle('Reproduciendo ahora:')
				.setDescription(`${track.title}`)
				.setThumbnail(track.thumbnail)
				.setURL(track.url)
				.addFields(
					{ name: 'Pedida por:', value: `${track.requestedBy}` },
				),
			],
		});
	},
};