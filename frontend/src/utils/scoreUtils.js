export const mapPlayerData = (player) => {
    const hsPercent = player.headshot_kills && player.kills ? ((player.headshot_kills / player.kills) * 100).toFixed(2) : '0.00';
    const ud = player.he_damage_dealt + player.burn_damage_dealt || 0;
    const removeUnderscores = (str) => {
        if (typeof str === 'string') {
            return str.replace(/_/g, ' ');
        }
        return str; 
    };
    return {
      avatar: player.faceit?.avatar,
      nickname: player.nickname,
      kills: player.kills || 0,
      assists: player.assists || 0,
      deaths: player.deaths || 0,
      hs_percent: `${hsPercent}%`,
      kd: ((player.kills / (player.deaths || 1)).toFixed(2)) || '0.00',
      ud: ud,
      adr: player.adr ? player.adr.toFixed(2) : 0,
      faceit_elo: player.faceit?.elo || 0,
      rrating: player.rrating ? player.rrating.toFixed(2) : '0.00',
      team_id: player.team_id,
      team_rounds: player.team_rounds,
      team: removeUnderscores(player.team)
    };
  };


  export const formattedMonths = (month) => {
    return {
      ...month,
      data: month.data.map((entry) => {
        const hsPercent = entry.headshot_kills && entry.kills 
          ? ((entry.headshot_kills / entry.kills) * 100).toFixed(2) 
          : '0.00';
  
        const kd = (entry.kills / (entry.deaths || 1)).toFixed(2);
        const ud = entry.he_damage_dealt + entry.burn_damage_dealt || 0;
        const killsPerRound = (entry.kills / (entry.rounds_played || 1)).toFixed(2);
        const entryWinPercent = entry.entry_wins && entry.entry_count 
          ? ((entry.entry_wins / entry.entry_count) * 100).toFixed(2) 
          : '0.00';
        const matchWinPercent = entry.matches_played 
          ? ((entry.match_wins / entry.matches_played) * 100).toFixed(2) 
          : '0.00';
  
        return {
          nickname: entry.nickname || 'Unknown',
          matchesPlayed: entry.matches_played || 0,
          matchWins: entry.match_wins || 0,
          matchWinPercent: parseFloat(matchWinPercent),
          roundsPlayed: entry.rounds_played || 0,
          damageDone: entry.damage_done || 0,
          kills: entry.kills || 0,
          deaths: entry.deaths || 0,
          hsPercent: parseFloat(hsPercent), 
          kd: parseFloat(kd), 
          killsPerRound: parseFloat(killsPerRound), 
          ud: ud,
          entryWinPercent: parseFloat(entryWinPercent),
          rrating: entry.rrating ? parseFloat(entry.rrating.toFixed(2)) : 0.00,
        };
      }),
    };
  };
  
  export const formatPlayerData = (playerData) => {
    return {
      nickname: playerData.nickname || 'Unknown',
      details: playerData.details.matches.map((match) => ({
        date: match.date || 'N/A',
        map: match.map || 'N/A',
        score: match.score || 0,
        kills: Number(match.kills) || 0,
        deaths: Number(match.deaths) || 0,
        assists: Number(match.assists) || 0,
        adr: Number(match.adr) || 0,
        kast: Number(match.kast) || 0,
        mvps: Number(match.mvps) || 0,
        rrating: Number(match.rrating) || 0,
        team: match.team || 'N/A',
        win: match.win,
        damageDone: Number(match.damage_done) || 0,
        damageReceived: Number(match.damage_received) || 0,
        headshotKills: Number(match.headshot_kills) || 0,
        wallbangKills: Number(match.wallbang_kills) || 0,
        smokeKills: Number(match.smoke_kills) || 0,
        moneySpent: Number(match.money_spent_total) || 0,
        clutchV1: Number(match.clutch_v1_wins) || 0,
        clutchV2: Number(match.clutch_v2_wins) || 0,
        clutchV3: Number(match.clutch_v3_wins) || 0,
        clutchV4: Number(match.clutch_v4_wins) || 0,
        clutchV5: Number(match.clutch_v5_wins) || 0,
        entryWins: Number(match.entry_wins) || 0,
        flashAssists: Number(match.flash_assists) || 0,
        flashKills: Number(match.flash_kills) || 0,
        enemy2k: Number(match.enemy_2k) || 0,
        enemy3k: Number(match.enemy_3k) || 0,
        enemy4k: Number(match.enemy_4k) || 0,
        enemy5k: Number(match.enemy_5k) || 0,
        shotsFired: Number(match.shots_fired) || 0,
        shotsOnEnemies: Number(match.shots_on_enemies) || 0,
        shotsOnTeammates: Number(match.shots_on_teammates) || 0,
        decoysThrown: Number(match.decoys_thrown) || 0,
        flashesThrown: Number(match.flashes_thrown) || 0,
        smokesThrown: Number(match.smokes_thrown) || 0,
        heDamageDealt: Number(match.he_damage_dealt) || 0,
        heDamageReceived: Number(match.he_damage_received) || 0,
        'AK-47': Number(match.kills_by_weapon?.['AK-47']) || 0,
        'AWP': Number(match.kills_by_weapon?.['AWP']) || 0,
        'FAMAS': Number(match.kills_by_weapon?.['FAMAS']) || 0,
        'Glock-18': Number(match.kills_by_weapon?.['Glock-18']) || 0,
        'M4A1': Number(match.kills_by_weapon?.['M4A1']) || 0,
        'M4A4': Number(match.kills_by_weapon?.['M4A4']) || 0,
        'MP7': Number(match.kills_by_weapon?.['MP7']) || 0,
      })),
    };
  };
  