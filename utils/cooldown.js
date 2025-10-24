module.exports = (client, userId, cmdName, sec) => {
  const key = `${cmdName}-${userId}`;
  const now = Date.now();
  const cd = client.cooldowns.get(key);
  if (cd && now < cd) return `Wait ${Math.ceil((cd - now) / 1000)}s.`;
  client.cooldowns.set(key, now + sec * 1000);
  setTimeout(() => client.cooldowns.delete(key), sec * 1000);
  return null;
};