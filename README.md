# Nostr Quote Bot

This project is a simple Node.js bot that connects to multiple Nostr relays and sends random quotes at regular intervals. It utilizes WebSocket for real-time communication and the `nostr-tools` library for handling Nostr events.

## Features

- Connects to multiple Nostr relays.
- Sends random quotes from a predefined list.
- Uses Bech32 encoding for public and private keys.
- Handles graceful shutdown on termination signals.

## Installation

To get started, clone the repository and install the required dependencies:

```bash
git clone https://github.com/noeljbass/OrthoBot.git
cd OrthoBot
npm install ws nostr-tools bech32
```

## Usage

Before running the bot, you need to add your Nostr public and secret keys in the code. Locate the following lines in the code:

```javascript

const npub = '000000000000000000000000000000000000000000000000000000000000000'; // Add your bot npub here
const nsec = '000000000000000000000000000000000000000000000000000000000000000'; // Add your bot nsec here
```

Replace the placeholder values with your actual Nostr public and secret keys.

To run the bot, use the following command:

```bash

node bot.js
```

The bot will send a random quote to the specified Nostr relays every hour. You can also see the output in the console indicating which quotes were sent and to which relays.
Code Overview

The main functionality of the bot is encapsulated in the following code:

```javascript

const WebSocket = require('ws');
const { nip19, finalizeEvent } = require('nostr-tools/pure');
const { SimplePool, useWebSocketImplementation } = require('nostr-tools/pool');
const { bech32 } = require('bech32');

useWebSocketImplementation(WebSocket);

console.log({ nip19, finalizeEvent });

// Array of Nostr relay URLs
const relays = [
    'wss://relay.nostr.band',
    'wss://relay.damus.io',
    'wss://christpill.nost1.com',
    'wss://relay.primal.net',
    'wss://nostr.mom',
    'wss://nostr.oxtr.dev',
    'wss://nos.lol'
];

const quotes = [
    "It is only necessary to seek one thing: to be with Jesus. The man who remains with Jesus is rich, even if he is poor with regard to material things. Who ever desires the earthly more than the heavenly loses both the earthly and the heavenly. But whoever seeks the heavenly is Lord of the whole world. - Ignatius Bryanchaninov #biblestr #orthodoxy #ChristIsKing #christianity #orthobot",
    "Prayer by its nature is communion and union of man with God; by its action it is the reconciliation of man with God, the mother and daughter of tears, a bridge for crossing temptations, a wall of protection from afflictions, a crushing of conflicts, boundless activity, the spring of virtues, the source of spiritual gifts, invisible progress, food of the soul, the enlightening of the mind, an axe for despair, a demonstration of hope, release from sorrow, the wealth of monks. - Ignatius Bryanchaninov #biblestr #orthodoxy #ChristIsKing #christianity #orthobot",
    "Amma Theodora said: A certain monk, afflicted by many sorrows, said to himself, 'Leave this place.' With these words he began to put his sandals on his feet, and suddenly he saw the devil in the form of a man sitting in the corner of his cell. The devil was also putting on his sandals. He said to the monk, 'Are you leaving here because of me? Well then, wherever you go, I will be there before you.' - Ignatius Bryanchaninov #biblestr #orthodoxy #ChristIsKing #christianity #orthobot",
    "Wherever you may go, the least plant may bring you clear remembrance of the Creator. - Saint Basil #biblestr #orthodoxy #ChristIsKing #christianity #orthobot"
];

// Your provided npub and nsec
const npub = '000000000000000000000000000000000000000000000000000000000000000'; // Add your bot npub here
const nsec = '000000000000000000000000000000000000000000000000000000000000000'; // Add your bot nsec here

// Function to convert Bech32 to hex
function bech32ToHex(bech32Str) {
    const { prefix, words } = bech32.decode(bech32Str);
    const data = bech32.fromWords(words);
    return Buffer.from(data).toString('hex');
}

// Convert npub and nsec to hex
const privateKeyHex = bech32ToHex(nsec);
const publicKeyHex = bech32ToHex(npub);

// Create a SimplePool instance
const pool = new SimplePool();

// Function to send a quote to all relays
async function sendQuote() {
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    const event = {
        kind: 1, // Kind 1 is for text notes
        content: quote,
        tags: [],
        created_at: Math.floor(Date.now() / 1000),
        pubkey: publicKeyHex,
    };

    // Finalize the event (this will sign it)
    const signedEvent = finalizeEvent(event, privateKeyHex);

    // Iterate through each relay and try to publish
    for (const relay of relays) {
        try {
            await pool.publish([relay], signedEvent);
            console.log(`Sent quote: "${quote}" to relay: ${relay}`);
            return; // Exit the function after successfully sending to one relay
        } catch (error) {
            console.error(`Error publishing to ${relay}:`, error);
            // Continue to the next relay
        }
    }

    console.error("Failed to send quote to all relays.");
}

// Function to handle graceful shutdown
function shutdown() {
    console.log("Shutting down the bot...");
    process.exit(0);
}

// Listen for termination signals
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Send a quote every hour
const intervalId = setInterval(sendQuote, 60 * 60 * 1000); // 60 minutes * 60 seconds * 1000 milliseconds

// Send the first quote immediately
sendQuote().catch(error => {
    console.error("Error sending the first quote:", error);
});

// Optional: Clear the interval on shutdown
process.on('exit', () => {
    clearInterval(intervalId);
});
```
## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

## Acknowledgments

    Nostr for the decentralized protocol.
    nostr-tools for the JavaScript library.
    ws for WebSocket support.
