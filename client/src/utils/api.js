import { getPlayerId } from './playerId';

const nocache = () => `t=${Date.now()}`;

export async function checkPlayer() {
  const res = await fetch(`/api/player?playerId=${getPlayerId()}&${nocache()}`);
  return res.json();
}

export async function registerPlayer(nickname, avatar) {
  const res = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ playerId: getPlayerId(), nickname, avatar }),
  });
  return res.json();
}

export async function submitScore({ score, combo, correct, wrong }) {
  const res = await fetch('/api/score', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ playerId: getPlayerId(), score, combo, correct, wrong }),
  });
  return res.json();
}

export async function fetchLeaderboard() {
  const res = await fetch('/api/leaderboard');
  return res.json();
}

export async function redeemCode(code) {
  const res = await fetch('/api/redeem-code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ playerId: getPlayerId(), code }),
  });
  return res.json();
}

export async function useKey() {
  const res = await fetch('/api/use-key', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ playerId: getPlayerId() }),
  });
  return res.json();
}
