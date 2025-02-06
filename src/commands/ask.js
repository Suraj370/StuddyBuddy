const { GoogleGenerativeAI } = require('@google/generative-ai');
const { splitMessage } = require('../utils/messageUtils');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

module.exports = {
    name: 'ask',
    description: 'Ask a question to get an answer from the Gemini API',
    async execute(interaction) {
        var question = interaction.options.getString('question');
        await interaction.deferReply(); // Acknowledge the interaction

        try {
            question = `generate concise  answer for ${question}`

            const result = await model.generateContent(question);
            const responseText = result.response.text();
            const messageChunks = splitMessage(responseText, 2000); // Split into chunks of 2000 characters

            for (const chunk of messageChunks) {
                await interaction.followUp(chunk); // Send each chunk as a follow-up message
            }
        } catch (error) {
            console.error(error);
            await interaction.editReply('Sorry, I could not fetch an answer.');
        }
    },
};