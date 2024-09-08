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
npm install
