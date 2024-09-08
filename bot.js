const WebSocket = require('ws');
const { nip19, finalizeEvent } = require('nostr-tools/pure');
const { SimplePool, useWebSocketImplementation } = require('nostr-tools/pool');
const { bech32 } = require('bech32');

useWebSocketImplementation(WebSocket);

console.log({ nip19, finalizeEvent });

// Array of Nostr relay URLs
const relays = [
    'wss://relay.nostr.band',
    'wss://christpill.nost1.com',
    'wss://relay.primal.net',
    'wss://relay.damus.io',
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
const npub = '0000000000000000000000000000000000000000000000000000000000000001'; //Add the bots Nostr npub here
const nsec = '0000000000000000000000000000000000000000000000000000000000000001'; //Add the bots Nostr nsec here

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
const intervalId = setInterval(sendQuote, 60 * 60 * 1000); 

// Send the first quote immediately
sendQuote().catch(error => {
    console.error("Error sending the first quote:", error);
});

// Optional: Clear the interval on shutdown
process.on('exit', () => {
    clearInterval(intervalId);
});
