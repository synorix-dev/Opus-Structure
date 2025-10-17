# Opus Structure v1.6

A clean and modular **Discord bot structure** built using **Node.js** and **discord.js**.
Designed for developers who want a reliable foundation with **moderation** and **music (Lavalink)** support.
Includes a ready-to-use **public Lavalink setup** and uses the default prefix **`>`**.

---

## ⚙️ Overview

| Property           | Description                                    |
| ------------------ | ---------------------------------------------- |
| **Name**           | Opus Structure                                 |
| **Version**        | 1.6                                            |
| **Developer**      | [synorix.dev2](https://github.com/synorixdev2) |
| **Framework**      | discord.js v14+                                |
| **Bot Type**       | Prefix-based                                   |
| **Default Prefix** | `>`                                            |
| **Focus**          | Moderation + Music                             |
| **Lavalink**       | Public node supported                          |

---

## 🚀 Features

### 🧩 Core Systems

* Command & Event Handlers (auto-loading)
* Centralized configuration system
* Lightweight and scalable foundation
* Owner-only command support
* Permission-checked moderation and music commands

### ⚔️ Moderation

Located in `commands/modreation/`
Includes core administrative actions:

* Kick / Ban / Mute / Unmute
* Clear / Warn / Timeout
* Lock / Unlock
  All use simple, professional embeds with no branding or custom emojis.

### 🎵 Music (Public Lavalink)

Located in `commands/music/`
Fully integrated with **public Lavalink nodes** for ease of use:

* `>play [song/link]` — Stream from YouTube, Spotify, or SoundCloud
* `>skip`, `>stop`, `>queue`, `>volume`, `>loop`
* Reconnects automatically to Lavalink
* Minimalist embed player — no branding or emojis

### 👑 Owner & Config Commands

Located in `commands/owner/` and `commands/config/`

* Manage bot settings dynamically
* Reload commands and events
* Owner-only protected functions

---

## 🧱 Folder Structure

```
📦 Opus Structure v1.6
├── 📁 commands/
│   ├── 📁 config/
│   ├── 📁 info/
│   ├── 📁 modreation/
│   ├── 📁 music/
│   └── 📁 owner/
├── 📁 events/
│   ├── 📁 client/
│   └── 📁 music/
├── 📁 handlers/
│   ├── commandHandler.js
│   └── eventHandler.js
├── 📁 schemas/
├── config.js
├── index.js
├── package.json
└── README.md
```

---

## ⚙️ Configuration

### `config.js`

```js
module.exports = {
  token: "YOUR_BOT_TOKEN",
  prefix: ">",
  owners: ["YOUR_USER_ID"],
  lavalink: {
    host: "lavalink.example.com", // or your public node host
    port: 2333,
    password: "youshallnotpass"
  }
};
```

### Lavalink Setup

1. Download Lavalink from [here](https://github.com/freyacodes/Lavalink/releases)
2. Or use a **public Lavalink node** (recommended for testing)
3. Update the Lavalink credentials in `config.js`
4. Run Lavalink if self-hosting:

   ```bash
   java -jar Lavalink.jar
   ```

---

## 🪄 Usage

### Install Dependencies

```bash
npm install
```

### Start the Bot

```bash
node index.js
```

### Example Commands

```
>ban @user reason
>play song name / link
>skip
>clear 50
```

---

## 🧱 Requirements

* Node.js v18 or newer
* Discord.js v14+
* Public or self-hosted Lavalink node
* Discord Bot Token

---

## 🧡 Optional Credit

If you’d like to support the developer, you may credit:

> *Built using **Opus Structure v1.6** by **synorix.dev2***

*(Credit is optional but appreciated.)*

---

## 🛡️ License

This project is open-source and available under the [MIT License](LICENSE).

---

## 💬 Notes

* Default prefix: `>`
* Uses public Lavalink support out of the box
* No custom emojis or branding
* Focused on simplicity, scalability, and clean design
* Perfect foundation for public Discord bots
