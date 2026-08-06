export function getPlayerId() {
  try {
    let pid = localStorage.getItem('eco_player_id');
    if (!pid) {
      pid = 'p_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36);
      localStorage.setItem('eco_player_id', pid);
    }
    return pid;
  } catch {
    let pid = sessionStorage.getItem('eco_player_id');
    if (!pid) {
      pid = 'p_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36);
      try { sessionStorage.setItem('eco_player_id', pid); } catch {}
    }
    return pid;
  }
}
