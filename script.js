const initialLayout = [
    { id: 'nyamu',    name: '若麦', w: 1, h: 2, x: 0, y: 0, color: '#ff99cc' },
    { id: 'michelle', name: '米歇尔', w: 2, h: 2, x: 1, y: 0, color: '#ff0099' },
    { id: 'moca',     name: '摩卡',   w: 1, h: 2, x: 3, y: 0, color: '#00cccc' },
    { id: 'arisa',    name: '有咲',   w: 1, h: 2, x: 0, y: 2, color: '#cc99ff' },
    { id: 'yukina',   name: '友希那', w: 2, h: 1, x: 1, y: 2, color: '#9966ff' },
    { id: 'eve',      name: '伊芙',   w: 1, h: 2, x: 3, y: 2, color: '#ffccff' },
    { id: 'saaya',    name: '沙绫',   w: 1, h: 1, x: 1, y: 3, color: '#ffcc00' },
    { id: 'box',      name: '纸箱',   w: 1, h: 1, x: 2, y: 3, color: '#8d6e63' },
    { id: 'tae',      name: '多惠',   w: 1, h: 1, x: 0, y: 4, color: '#3399ff' },
    { id: 'tsukushi', name: '筑紫',   w: 1, h: 1, x: 3, y: 4, color: '#ff6666' }
];

const piecesLayer = document.getElementById('pieces-layer');
let pieces = [];
let startXY = { x: 0, y: 0 };

function init() {
    initialLayout.forEach(data => {
        const el = document.createElement('div');
        el.className = 'piece';
        el.innerText = data.name;
        el.style.width = `calc(var(--cell-size) * ${data.w})`;
        el.style.height = `calc(var(--cell-size) * ${data.h})`;
        el.style.backgroundColor = data.color;
        
        const piece = { ...data, el };
        pieces.push(piece);
        updateUI(piece);
        
        el.addEventListener('mousedown', e => handleDown(e.clientX, e.clientY, piece));
        el.addEventListener('touchstart', e => handleDown(e.touches[0].clientX, e.touches[0].clientY, piece));
        
        piecesLayer.appendChild(el);
    });
}

function handleDown(x, y, p) {
    startXY = { x, y };
    const onEnd = (e) => {
        const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
        const endY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
        const dx = endX - startXY.x;
        const dy = endY - startXY.y;

        if (Math.abs(dx) > 30 || Math.abs(dy) > 30) {
            let mx = 0, my = 0;
            if (Math.abs(dx) > Math.abs(dy)) mx = dx > 0 ? 1 : -1;
            else my = dy > 0 ? 1 : -1;

            if (canMove(p, mx, my)) {
                p.x += mx; p.y += my;
                updateUI(p);
                if (p.id === 'michelle' && p.x === 1 && p.y === 3) {
                    setTimeout(() => alert('米歇尔逃出成功！'), 200);
                }
            }
        }
        window.removeEventListener('mouseup', onEnd);
        window.removeEventListener('touchend', onEnd);
    };
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchend', onEnd);
}

function canMove(p, dx, dy) {
    const nx = p.x + dx, ny = p.y + dy;
    if (nx < 0 || ny < 0 || nx + p.w > 4 || ny + p.h > 5) return false;
    return !pieces.some(o => o!==p && !(nx+p.w<=o.x || nx>=o.x+o.w || ny+p.h<=o.y || ny>=o.y+o.h));
}

function updateUI(p) {
    p.el.style.transform = `translate(calc(${p.x} * var(--cell-size)), calc(${p.y} * var(--cell-size)))`;
}

init();