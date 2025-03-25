import {
  SlashCommandBuilder,
  MessageFlags,
  PermissionsBitField,
  EmbedBuilder,
} from 'discord.js';

const data = new SlashCommandBuilder()
  .setName('kick')
  .setDescription('Removes a user from the server.')
  .addUserOption((option) =>
    option
      .setName('user')
      .setDescription('Select the user you wish to remove from the server.')
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName('reason')
      .setDescription('Provide a reason for the removal of the user.')
  );

const execute = async (interaction) => {
  const user = interaction.options.getUser('user');
  const reason = interaction.options.getString('reason');

  if (
    !interaction.appPermissions.has(PermissionsBitField.Flags.KickMembers, true)
  )
    return interaction.reply({
      content:
        'The bot does not have the required permissions to manage this user.',
      flags: MessageFlags.Ephemeral,
    });

  if (user.id == interaction.user.id)
    return interaction.reply({
      content: 'You are unable to kick yourself.',
      flags: MessageFlags.Ephemeral,
    });

  if (user.bot || !user.kickable)
    return interaction.reply({
      content: 'This user cannot be kicked.',
      flags: MessageFlags.Ephemeral,
    });

  try {
    await user.kick(reason ? reason : 'No reason provided.');
  } catch (error) {
    console.error(
      'An error occurred while attempting to kick this user:',
      error
    );

    return interaction.reply({
      content:
        'An error occurred while attempting to kick this user. Please try again later.',
      flags: MessageFlags.Ephemeral,
    });
  }

  const successEmbed = new EmbedBuilder()
    .setTitle('Kick')
    .setDescription('The user has been kicked from the server.')
    .setTimestamp()
    .setColor('#2596be');

  await interaction.reply({
    embeds: [successEmbed],
  });
};

export { data, execute };
