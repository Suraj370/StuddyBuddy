// src/utils/messageUtils.js

/**
 * Splits a message into chunks of a specified maximum length.
 * @param {string} message - The message to split.
 * @param {number} maxLength - The maximum length of each chunk.
 * @returns {string[]} - An array of message chunks.
 */
function splitMessage(message, maxLength) {
    const chunks = [];
    for (let i = 0; i < message.length; i += maxLength) {
        chunks.push(message.slice(i, i + maxLength));
    }
    return chunks;
}

module.exports = { splitMessage };