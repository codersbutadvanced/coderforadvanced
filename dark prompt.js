const chatBox = document.getElementById('chat-box');
const input = document.getElementById('input');
const passphraseInput = document.getElementById('passphrase');
const authDiv = document.getElementById('auth');
const chatContainer = document.getElementById('chat-container');
const qrPanel = document.getElementById('qr-panel');
const modal = document.getElementById('modal');

let key;
const encoder = new TextEncoder();
const decoder = new TextDecoder();
let idleTimer;

// ---------------------- INIT ----------------------

async function initKey() {
  const passphrase = passphraseInput.value;
  if (!passphrase) return alert('Enter a passphrase!');

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const baseKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );

  authDiv.style.display = 'none';
  chatContainer.style.display = 'block';
  resetIdleTimer();
  appendMessage("[✔] Secure session initialized.");
}

// ---------------------- CHAT INPUT ----------------------

input.addEventListener('keydown', async (e) => {
  if (e.key === 'Enter' && input.value.trim() !== '') {
    const text = input.value.trim();
    input.value = '';
    handleInput(text);
    resetIdleTimer();
  }
});

async function handleInput(text) {
  appendMessage("> " + text);

  if (text.startsWith('/')) {
    parseCommand(text.slice(1).trim());
  } else {
    const encrypted = await encryptMessage(text);
    const decrypted = await decryptMessage(encrypted);
    appendMessage("You: " + decrypted);
    setTimeout(fakeReply, 1000);
  }
}

function appendMessage(text, isAlert = false) {
  const el = document.createElement('div');
  el.textContent = text;
  if (isAlert) el.classList.add('alert');
  chatBox.appendChild(el);
  chatBox.scrollTop = chatBox.scrollHeight;
  if (!isAlert) {
    setTimeout(() => el.remove(), 15000);
  }
}

function clearChat() {
  chatBox.innerHTML = '';
  appendMessage("[✔] Session cleared.");
}

// ---------------------- ENCRYPTION ----------------------

async function encryptMessage(msg) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(msg)
  );
  return { data: encrypted, iv };
}

async function decryptMessage({ data, iv }) {
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );
  return decoder.decode(decrypted);
}

// ---------------------- FAKE REPLIES ----------------------

function fakeReply() {
  const replies = [
    "Secure channel acknowledged.",
    "Response received.",
    "Integrity check passed.",
    "Awaiting next command.",
    "Session stable. Node verified."
  ];
  appendMessage("Bot: " + replies[Math.floor(Math.random() * replies.length)]);
}

// ---------------------- IDLE SURVEILLANCE ALERT ----------------------

function resetIdleTimer() {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    appendMessage("[!] Unusual activity detected — Possible surveillance.", true);
  }, 30000);
}

// ---------------------- COMMAND PARSER ----------------------

function parseCommand(cmd) {
  switch (cmd) {
    case 'scan':
      startNetworkScan();
      break;
    case 'firewall':
      toggleFirewall();
      break;
    case 'clear':
      clearChat();
      break;
    case 'send':
      startFakeTransfer();
      break;
    case '2fa':
      show2FA();
      break;
    case 'qr':
      generateQR();
      break;
    case 'darknet-drop':
      darknetDrop();
      break;
    default:
      appendMessage("[X] Unknown command: " + cmd, true);
  }
}

// ---------------------- NETWORK SCAN ----------------------

function startNetworkScan() {
  const logs = [
    "[SCAN] Scanning subnet 192.168.0.0/24...",
    "[✔] Device found: 192.168.0.1 (Router)",
    "[✔] Device found: 192.168.0.4 (IoT, open: 80,443)",
    "[!] Suspicious device: 192.168.0.13 (unknown OS)",
    "[✔] Scan complete. No breaches found."
  ];

  let i = 0;
  const interval = setInterval(() => {
    if (i < logs.length) {
      appendMessage(logs[i++]);
    } else {
      clearInterval(interval);
    }
  }, 1000);
}

// ---------------------- FIREWALL ANIMATION ----------------------

let firewallVisible = false;
let firewallCtx;
let packets = [];

function toggleFirewall() {
  firewallVisible = !firewallVisible;
  document.getElementById('firewall-panel').style.display = firewallVisible ? 'block' : 'none';

  if (firewallVisible) {
    firewallCtx = document.getElementById('firewallCanvas').getContext('2d');
    packets = [];
    generatePackets();
    animatePackets();
  }
}

function generatePackets() {
  for (let i = 0; i < 10; i++) {
    packets.push({
      x: 0,
      y: 10 + i * 10,
      color: Math.random() > 0.2 ? '#33ff33' : 'red'
    });
  }
}

function animatePackets() {
  if (!firewallVisible) return;
  firewallCtx.clearRect(0, 0, 560, 120);

  for (let p of packets) {
    firewallCtx.fillStyle = p.color;
    firewallCtx.fillRect(p.x, p.y, 10, 4);
    if (p.color === 'red' && p.x > 300) {
      firewallCtx.fillText('✖', p.x, p.y + 5);
      p.x = -10;
    } else if (p.x > 560) {
      p.x = -10;
    } else {
      p.x += 2;
    }
  }

  requestAnimationFrame(animatePackets);
}

// ---------------------- FAKE FILE TRANSFER ----------------------

function startFakeTransfer() {
  let progress = 0;
  const interval = setInterval(() => {
    if (progress < 100) {
      progress += Math.floor(Math.random() * 15);
      if (progress > 100) progress = 100;
      appendMessage(`[SENDING] ${"█".repeat(progress / 10)}${"░".repeat(10 - progress / 10)} ${progress}%`);
    } else {
      clearInterval(interval);
      appendMessage(`[✔] File "payload.zip" transferred to Node #008.`);
    }
  }, 700);
}

// ---------------------- 2FA MODAL ----------------------

function show2FA() {
  modal.classList.remove('hidden');
}

function close2FA() {
  modal.classList.add('hidden');
}

function submit2FA() {
  const code = document.getElementById('twofacode').value;
  if (code === "123456") {
    appendMessage("[✔] 2FA successful.");
  } else {
    appendMessage("[X] Invalid 2FA code.", true);
  }
  close2FA();
}

// ---------------------- QR KEY GENERATOR ----------------------

function generateQR() {
  qrPanel.style.display = "block";
  document.getElementById('qrcode').innerHTML = "";
  QRCode.toCanvas(document.getElementById('qrcode'), "session-key-123456789", { width: 180 }, function (error) {
    if (error) console.error(error);
  });
  appendMessage("[QR] Session key QR generated.");
}

// ---------------------- DARKNET DROP ----------------------

function darknetDrop() {
  appendMessage("💀 Connecting to dark mirror...");
  setTimeout(() => {
    appendMessage("[!] File obtained: deep_extract.zip (encrypted)");
    appendMessage("[!] Source flagged. Possible honeypot detected.", true);
  }, 3000);
}
