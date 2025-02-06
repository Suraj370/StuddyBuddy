require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const askCommand = require('./commands/ask');
const keepAlive = require('./server')

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent] });

// Register commands
const commands = [
    {
        name: askCommand.name,
        description: askCommand.description,
        options: [
            {
                type: 3, // STRING type
                name: 'question',
                description: 'The question you want to ask',
                required: true,
            },
        ],
    },
   
];

const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

client.once('ready', () => {
    console.log('Bot is online!');
});

const greetings = ["hello", "hi", "hey", "yo", "sup", "hola", "greetings"];


client.on('messageCreate', async (message) => {
    if (message.author.bot) return; // Ignore bot messages

    const content = message.content.toLowerCase().trim();

    if (message.mentions.everyone) return;
   // Check if message is "!help"
   if (content === "!help") {
    return await message.reply(
        "**📜 Bot Commands:**\n" +
        "✅ `@BotName Hello` → The bot will greet you.\n" +
        "✅ Mention the bot (`@BotName`) → It will respond.\n" +
        "✅ `/ask <question>` → Ask the bot a question.\n" +
        "✅ `!help` → Show this help message."
    );
}

// Check if message contains a greeting and mentions the bot
const isGreeting = greetings.some(greet => content.split(/\s+/).includes(greet));

if (message.mentions.has(client.user)) {
    if (isGreeting) {
        return await message.reply(`Hello ${message.author.username}! 😊 How can I help`);
    } else {
        return await message.reply("You mentioned me!");
    }
}
});


client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'ask') {
        await askCommand.execute(interaction);
    }
    
});
keepAlive();

client.login(process.env.BOT_TOKEN);