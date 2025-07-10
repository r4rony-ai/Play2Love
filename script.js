
let socket;
function createRoom() {
  const room = Math.random().toString(36).substring(2, 8);
  window.location.href = 'room.html?room=' + room;
}

function joinRoom() {
  const code = document.getElementById('roomCode').value.trim();
  if (code) {
    window.location.href = 'room.html?room=' + code;
  }
}

if (window.location.pathname.includes('room.html')) {
  const canvas = document.getElementById('drawCanvas');
  const ctx = canvas.getContext('2d');
  const params = new URLSearchParams(window.location.search);
  const room = params.get('room');
  document.getElementById('roomDisplay').innerText = 'Room: ' + room;

  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  socket = io('https://play2love.glitch.me');
  socket.emit('join', room);

  let drawing = false;

  canvas.addEventListener('mousedown', () => drawing = true);
  canvas.addEventListener('mouseup', () => drawing = false);
  canvas.addEventListener('mousemove', draw);

  function draw(e) {
    if (!drawing) return;
    const x = e.offsetX;
    const y = e.offsetY;
    ctx.fillStyle = '#ff66a3';
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
    socket.emit('draw', { room, x, y });
  }

  socket.on('draw', ({ x, y }) => {
    ctx.fillStyle = '#66ccff';
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
  });
}
