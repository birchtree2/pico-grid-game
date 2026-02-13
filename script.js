// 初始布局数据
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

const gridBg = document.getElementById('grid-bg');
const piecesLayer = document.getElementById('pieces-layer');
const exitGateEl = document.querySelector('.exit-gate');
let pieces = [];
let startXY = { x: 0, y: 0 };

function init() {
    // 1. 生成 4x5 棋盘背景，(0,0) 为深色
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 4; col++) {
            const cell = document.createElement('div');
            // 判断色块：(row + col) 为偶数则深色
            cell.className = `cell ${(row + col) % 2 === 0 ? 'dark' : 'light'}`;
            gridBg.appendChild(cell);
        }
    }

    // 2. 初始化方块
    initialLayout.forEach(data => {
        const el = document.createElement('div');
        el.className = 'piece';
        // el.innerText = data.name;
        
        // 尺寸自适应长方形格子
        el.style.width = `calc(var(--cell-w) * ${data.w})`;
        el.style.height = `calc(var(--cell-h) * ${data.h})`;
        
        // 兼容图片：如果有图则显示，无图显示背景色
        el.style.backgroundColor = data.color;
        el.style.backgroundImage = `url(assets/${data.id}.png)`;

        const piece = { ...data, el };
        pieces.push(piece);
        updateUI(piece);
        
        // 绑定事件（兼容鼠标和触摸）
        el.addEventListener('mousedown', e => handleDown(e.clientX, e.clientY, piece));
        el.addEventListener('touchstart', e => {
            handleDown(e.touches[0].clientX, e.touches[0].clientY, piece);
        }, {passive: false});
        
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

        // 判定滑动（方案二）
        if (Math.abs(dx) > 25 || Math.abs(dy) > 25) {
            let mx = 0, my = 0;
            if (Math.abs(dx) > Math.abs(dy)) mx = dx > 0 ? 1 : -1;
            else my = dy > 0 ? 1 : -1;

            if (canMove(p, mx, my)) {
                p.x += mx;
                p.y += my;
                updateUI(p);
                checkWin();
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
    // 边界检查
    if (nx < 0 || ny < 0 || nx + p.w > 4 || ny + p.h > 5) return false;
    // 碰撞检查
    return !pieces.some(o => o !== p && !(nx + p.w <= o.x || nx >= o.x + o.w || ny + p.h <= o.y || ny >= o.y + o.h));
}

function updateUI(p) {
    // 位置自适应长方形坐标
    p.el.style.transform = `translate(calc(${p.x} * var(--cell-w)), calc(${p.y} * var(--cell-h)))`;
}

function checkWin() {
    const michelle = pieces.find(p => p.id === 'michelle');
    // 米歇尔 (2x2) 的底部到达最后两行中央
    if (michelle.x === 1 && michelle.y === 3) {
        // 步骤3：到达终点变3楼并开门
        currentFloor = 3;
        drawPixels('number-matrix', PIXEL_MAPS.nums[3], 5);
        
        setTimeout(() => {
            toggleExitGate(false);
            alert('3楼到了，米歇尔下电梯！');
        }, 800);
    }
}

// 1. 点阵坐标定义 (x,y)
const PIXEL_MAPS = {
    arrow: [[2,0], [1,1], [2,1], [3,1], [0,2], [2,2], [4,2], [2,3], [2,4]],
    nums: {
    1: [[2,0], [1,1], [2,1], [2,2], [2,3], [2,4], [2,5], [1,6], [2,6], [3,6]],
        2: [[1,0], [2,0], [3,0], [0,1], [4,1], [4,2], [3,3], [2,4], [1,5], [0,6], [1,6], [2,6], [3,6], [4,6]],
        3: [[1,0], [2,0], [3,0], [0,1],[4,1], [4,2], [2,3],[3,3], [4,4], [0,5],[4,5], [1,6], [2,6], [3,6]]
    }
};

// 初始化点阵 HTML
function createMatrix(id, cols, rows) {
    const container = document.getElementById(id);
    for (let i = 0; i < cols * rows; i++) {
        const p = document.createElement('div');
        p.className = 'pixel';
        container.appendChild(p);
    }
}

// 刷新显示 (核心函数)
function drawPixels(matrixId, coords, cols) {
    const pixels = document.getElementById(matrixId).getElementsByClassName('pixel');
    Array.from(pixels).forEach(p => p.classList.remove('on'));
    coords.forEach(([x, y]) => {
        const index = y * cols + x;
        if (pixels[index]) pixels[index].classList.add('on');
    });
}

// 电梯逻辑流程
let currentFloor = 1;

function startElevator() {
    createMatrix('arrow-matrix', 5, 5);
    createMatrix('number-matrix', 5, 7);
    toggleExitGate(false); // 初始开门
    // 步骤1：关门 (线变黑)
    setTimeout(() => {
        toggleExitGate(true);
        drawPixels('arrow-matrix', PIXEL_MAPS.arrow, 5);
        drawPixels('number-matrix', PIXEL_MAPS.nums[1], 5);
    }, 1500);

    // 步骤2：5秒后自动变2楼
    setTimeout(() => {
        currentFloor = 2;
        drawPixels('number-matrix', PIXEL_MAPS.nums[2], 5);
    }, 20000);
}

function toggleExitGate(shouldClose) {
    if (!exitGateEl) return;
    exitGateEl.classList.toggle('closed', !shouldClose);
}

// 在页面加载后启动
window.onload = () => {
    init(); // 原有的棋盘初始化
    startElevator(); // 启动电梯效果
};