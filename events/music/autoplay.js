module.exports = (client) => {
  client.kazagumo.on("playerEnd", async (player, track) => {
    if (!player.data.get("autoplay")) return;

    const res = await client.kazagumo.search(`${track.author} Music`, { engine: "youtube" });
    if (!res || !res.tracks.length) return;

    const next = res.tracks.find(t => t.identifier !== track.identifier);
    if (!next) return;

    player.queue.add(next);
    if (!player.playing && !player.paused) await player.play();
  });
};