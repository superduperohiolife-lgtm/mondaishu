/* GAS（スプレッドシート）とのやりとり。合言葉はこの端末にだけ保存する */
const API_URL = 'https://script.google.com/macros/s/AKfycbyi1UyzEWOMRDQky0LNahvCD8_XvRYKF8WDsKZjdafUjhsI0bggYxY321g6Epqj6grR/exec';

function appKey() {
  try { return localStorage.getItem('appKey') || ''; } catch (e) { return ''; }
}
function saveKey(k) {
  try { localStorage.setItem('appKey', k); } catch (e) { /* 保存できない環境 */ }
  window.__KEY = k;
}

async function call(fn) {
  const args = Array.prototype.slice.call(arguments, 1);
  const res = await fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify({ key: window.__KEY || appKey(), fn: fn, args: args }),
  });
  if (!res.ok) throw new Error('通信エラー ' + res.status);
  const j = await res.json();
  if (!j.ok) {
    if (/合言葉/.test(j.error)) { try { localStorage.removeItem('appKey'); } catch (e) {} }
    throw new Error(j.error);
  }
  return j.result;
}

/* 合言葉の確認。通ったら onReady(タイトル) を呼ぶ */
async function startApp(onReady) {
  const k = window.__KEY || appKey();
  if (k) {
    try {
      window.__KEY = k;
      const r = await call('ping');
      return onReady(r.title);
    } catch (e) {
      if (!/合言葉/.test(e.message)) {
        document.body.insertAdjacentHTML('beforeend', '<div class="loginbox"><p>つながらない：' + e.message + '</p><button onclick="location.reload()">もう一度</button></div>');
        return;
      }
    }
  }
  showLogin(onReady);
}

function showLogin(onReady) {
  const box = document.createElement('div');
  box.className = 'loginbox';
  box.innerHTML = '<form><p>合言葉を入れてください</p><input id="keyInput" autocomplete="off" autocapitalize="off" spellcheck="false">' +
    '<button type="submit">はじめる</button><p class="loginmsg"></p></form>';
  document.body.appendChild(box);
  box.querySelector('form').addEventListener('submit', async function (ev) {
    ev.preventDefault();
    const k = box.querySelector('#keyInput').value.trim();
    if (!k) return;
    window.__KEY = k;
    try {
      const r = await call('ping');
      saveKey(k);
      box.remove();
      onReady(r.title);
    } catch (e) {
      box.querySelector('.loginmsg').textContent = e.message;
    }
  });
  box.querySelector('#keyInput').focus();
}
