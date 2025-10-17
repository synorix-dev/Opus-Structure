const vcstatus = require('../../schemas/vcstatus.js');

module.exports = (client) => {   client.kazagumo.on('playerCreate', async (player) => {
       const data = await vcstatus.findOne({ guildId: player.guildId });
    if (!data || data.enabled !== true) return;
        
        if (data.enabled === true) {
            try {
      await client.rest.put(`/channels/${player.voiceId}/voice-status`, {
        body: { status: '**>play <song>**' },
      });
    } catch (err) {
      console.warn(`[VC Status] Failed to update status:`, err?.message || err);
    }
        }
   }); 
    client.kazagumo.on('playerDestroy', async (player) => {
       const data = await vcstatus.findOne({ guildId: player.guildId });
    if (!data || data.enabled !== true) return;
        
        if (data.enabled === true) {
            try {
      await client.rest.put(`/channels/${player.voiceId}/voice-status`, {
        body: { status: "" },
      });
    } catch (err) {
      console.warn(`[VC Status] Failed to update status:`, err?.message || err);
    }
        }
   });
   client.kazagumo.on('playerEmpty', async (player) => {
       const data = await vcstatus.findOne({ guildId: player.guildId });
    if (!data || data.enabled !== true) return;
        
        if (data.enabled === true) {
            try {
      await client.rest.put(`/channels/${player.voiceId}/voice-status`, {
        body: { status: '**>play <song>**' },
      });
    } catch (err) {
      console.warn(`[VC Status] Failed to update status:`, err?.message || err);
    }
        }
   });
    client.kazagumo.on('playerStart', async (player, track) => {
       const data = await vcstatus.findOne({ guildId: player.guildId });
    if (!data || data.enabled !== true) return;
        
        if (data.enabled === true) {
            try {
      await client.rest.put(`/channels/${player.voiceId}/voice-status`, {
        body: { status: `<a:cd:1425327114269360202> ${track.title}` },
      });
    } catch (err) {
      console.warn(`[VC Status] Failed to update status:`, err?.message || err);
    }
        }      
    });
}