const fs = require("fs");
const path = require("path");

module.exports = async (client) => {
  const eventsPath = path.join(__dirname, "../events");

  const loadEvents = (dir) => {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        loadEvents(filePath);
      } else if (file.endsWith(".js")) {
        try {
          delete require.cache[require.resolve(filePath)];
          const event = require(filePath);
          event(client);

          const eventName = path.parse(file).name;
          client.events.set(eventName, filePath);

          console.log(`[EVENT] Loaded: ${eventName}`);
        } catch (err) {
          console.error(`[ERROR] Failed to load event ${file}`, err);
        }
      }
    }
  };

  loadEvents(eventsPath);
};