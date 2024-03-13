// Dependencies
const { MessageEmbed, Message } = require('discord.js');
const fs = require('fs');
const config = require('../config.json');
const CatLoggr = require('cat-loggr');
//Made By ScienceGear#4409 Youtube https://www.youtube.com/c/ScienceGearYT
// Functions
const log = new CatLoggr();
const generated = new Set();

module.exports = {
  name: 'pgen', // Command name
  description: 'Generate a specified service if stocked (premium).', // Command description

  /**
   * Command exetute
   * @param {Message} message The message sent by user
   * @param {Array[]} args Arguments splitted by spaces after the command name
   */
  execute(message, args) {
    // If the generator channel is not given in config or invalid
    try {
      message.client.channels.cache.get(config.pgenChannel).id; // Try to get the channel's id
    } catch (error) {
      if (error) log.error(error); // If an error occured log to console

      // Send error messsage if the "error_message" field is "true" in the configuration
      if (config.command.error_message === true) {
        return message.channel.send(
          new MessageEmbed()
            .setColor(config.color.red)
            .setTitle('Error occured!')
            .setDescription('Premium generator is unavailable for now.')
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
            .setTimestamp()
        );
      } else return;
    };
    //Made By ScienceGear#4409 Youtube https://www.youtube.com/c/ScienceGearYT
    // If the message channel id is the generator channel id in configuration
    if (message.channel.id === config.pgenChannel) {
      // If the user have cooldown on the command
      if (generated.has(message.author.id)) {
        return message.channel.send(
          new MessageEmbed()
            .setColor(config.color.red)
            .setTitle('Cooldown!')
            .setDescription(`Please wait **${config.genCooldownsec}** seconds before executing that command again!`)
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
            .setTimestamp()
        );
      } else {
        // Parameters
        const service = args[0];
        //Made By ScienceGear#4409 Youtube https://www.youtube.com/c/ScienceGearYT
        // If the "service" parameter is missing
        if (!service) {
          return message.channel.send(
            new MessageEmbed()
              .setColor(config.color.red)
              .setTitle('Missing parameters!')
              .setDescription('Please specify a service name!')
              .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
              .setTimestamp()
          );
        };

        // File path to find the given service
        const filePath = `${__dirname}/../pstock/${args[0]}.txt`;

        // Read the service file
        fs.readFile(filePath, function(error, data) {
          // If no error
          if (!error) {
            data = data.toString(); // Stringify the content
            //Made By ScienceGear#4409 Youtube https://www.youtube.com/c/ScienceGearYT
            const position = data.toString().indexOf('\n'); // Get position
            const firstLine = data.split('\n')[0]; // Get the first line

            // If the service file is empty
            if (position === -1) {
              return message.channel.send(
                new MessageEmbed()
                  .setColor(config.color.red)
                  .setTitle('Generator error!')
                  .setDescription(`We don\'t have \`${args[0]}\` accounts currently!`)
                  .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                  .setTimestamp()
              );
            };
            //Made By ScienceGear#4409 Youtube https://www.youtube.com/c/ScienceGearYT
            // Send messages to the user
            message.author.send(
              new MessageEmbed()
                .setColor(config.color.green)
                .setTitle('Generated account')
                .addField('Service', `\`\`\`${args[0][0].toUpperCase()}${args[0].slice(1).toLowerCase()}\`\`\``, true)
                .addField('account', `\`\`\`${firstLine}\`\`\``, true)
                .setTimestamp()
            )

            // Send message to the channel if the user recieved the message
            if (position !== -1) {
              data = data.substr(position + 1); // Remove the gernerated account line

              // Write changes
              fs.writeFile(filePath, data, function(error) {
                message.channel.send(
                  new MessageEmbed()
                    .setColor(config.color.green)
                    .setTitle('account generated successfully!')
                    .setDescription(`Check your private ${message.author}! *If you did not receive the message, please unlock your private!*`)
                    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                    .setTimestamp()
                );

                generated.add(message.author.id); // Add user to the cooldown set

                // Set cooldown time
                setTimeout(() => {
                  generated.delete(message.author.id); // Remove the user from the cooldown set after expire
                }, config.genCooldown);
                //Made By ScienceGear#4409 Youtube https://www.youtube.com/c/ScienceGearYT
                if (error) return log.error(error); // If an error occured, log to console
              });
            } else {
              // If the service is empty
              return message.channel.send(
                new MessageEmbed()
                  .setColor(config.color.red)
                  .setTitle('Generator error!')
                  .setDescription(`The \`${args[0]}\` service is empty!`)
                  .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                  .setTimestamp()
              );
            };
          } else {
            // If the service does not exists
            return message.channel.send(
              new MessageEmbed()
                .setColor(config.color.red)
                .setTitle('Generator error!')
                .setDescription(`There is no \`${args[0]}\` service! Make sure you wrote it correctly!`)
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                .setTimestamp()
            );
          };
        });
      };
    } else {
      // If the command executed in another channel
      message.channel.send(
        new MessageEmbed()
          .setColor(config.color.red)
          .setTitle('Wrong command usage!')
          .setDescription(`This command is unavailable for now!`)
          .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
          .setTimestamp()
      );
    };
  }
};
//Made By ScienceGear#4409 Youtube https://www.youtube.com/c/ScienceGearYT