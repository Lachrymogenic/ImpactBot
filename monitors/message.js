const { Monitor } = require('klasa');
const { MessageEmbed } = require('discord.js');

const channels = require('../channels');
const replies = require('../replies');

module.exports = class extends Monitor {
  constructor(...args) {
    super(...args, {
      name: 'message',
      enabled: true,
      ignoreBots: true,
      ignoreSelf: true,
      ignoreOthers: false,
      ignoreWebhooks: true,
      ignoreEdits: true
    });
  }

  async run(msg) {
    const reply = replies
      .filter((e) => !e.exclude.includes(msg.channel.id) && 
              new RegExp('\\b(?:' + e.pattern.toString().slice(1, -1) + ')\\b', 'i').test(msg.content))
      .reduce((a, e) => a + e.message + ' ', '');

    if(reply && [channels.general, channels.help].includes(msg.channel.id)) {
      const m = await msg.send(new MessageEmbed().setDescription(reply));
      if(!msg.mentions.has(this.client.user)) {
        setTimeout(() => {
          m.delete().catch(()=>{}); // in case someone already deleted the message
        }, 15000);
      }
    }
  }
};
