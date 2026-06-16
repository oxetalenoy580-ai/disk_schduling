type Disk_Path = number;
type Disk_Path_Arr = Disk_Path[];

const canvasId = "app";
const app = document.getElementById("app") as HTMLCanvasElement;
if (app === null) {
  throw new Error(`can not find canvas ${canvasId}`);
}

app.width = 1520;
app.height = 1300;

const ctx = app.getContext("2d")!;
if (ctx === null) {
  throw new Error(`can not init context`);
}

const bgGrad = ctx.createLinearGradient(0, 0, 0, app.height);
bgGrad.addColorStop(0, "#07070d");
bgGrad.addColorStop(0.5, "#0f0f18");
bgGrad.addColorStop(1, "#14141e");
ctx.fillStyle = bgGrad;
ctx.fillRect(0, 0, app.width, app.height);

ctx.strokeStyle = "rgba(255,255,255,0.03)";
ctx.lineWidth = 1;
for (let x = 0; x < app.width; x += 50) {
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, app.height);
  ctx.stroke();
}
for (let y = 0; y < app.height; y += 50) {
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(app.width, y);
  ctx.stroke();
}

const line_pos = 30;
const padding = 10;
const current_path = Math.floor(Math.random() * 1500);
const quantity = 400;
let direction = 1;

function draw(
  color: string,
  start_x: number,
  start_y: number,
  end_x: number,
  end_y: number,
  lineWidth: number,
  glowColor?: string,
  glowSize?: number,
) {
  ctx.save();
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.moveTo(start_x, start_y);
  ctx.lineTo(end_x, end_y);
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";
  if (glowColor && glowSize) {
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = glowSize;
  }
  ctx.stroke();
  ctx.restore();
}

function drawCircle(
  x: number,
  y: number,
  radius: number,
  color: string,
  glowColor?: string,
  glowSize?: number,
) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  if (glowColor && glowSize) {
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = glowSize;
  }
  ctx.fill();
  ctx.restore();
}

function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function chaosArr(arr: Disk_Path_Arr) {
  for (let i = 0; i < arr.length; ++i) {
    const x = randomInRange(0, arr.length - 1);
    const y = randomInRange(0, arr.length - 1);
    if (x == y) {
      continue;
    } else {
      [arr[x], arr[y]] = [arr[y], arr[x]];
    }
  }
}

function gernerateDiskScheduleArr() {
  const disk_schedule_arr = [];
  for (let i = 0; i < quantity * 0.5; ++i) {
    disk_schedule_arr.push(randomInRange(0, 499));
  }
  for (let i = 0; i < quantity * 0.25; ++i) {
    disk_schedule_arr.push(randomInRange(500, 999));
  }
  for (let i = 0; i < quantity * 0.25; ++i) {
    disk_schedule_arr.push(randomInRange(1000, 1499));
  }
  chaosArr(disk_schedule_arr);
  return disk_schedule_arr;
}

const disk_schedule_arr = gernerateDiskScheduleArr();
disk_schedule_arr.unshift(current_path);

function drawTrackScale() {
  ctx.save();
  for (let v = 0; v <= 1500; v += 250) {
    const x = padding + v;
    ctx.beginPath();
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.lineWidth = 1;
    ctx.moveTo(x, line_pos - 12);
    ctx.lineTo(x, line_pos + 12);
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.font = "9px 'Courier New', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(String(v), x, line_pos + 15);
  }
  ctx.restore();
}

function drawDiskPathLoc(arr: Disk_Path_Arr) {
  ctx.save();
  ctx.beginPath();
  ctx.strokeStyle = "rgba(6, 182, 212, 0.25)";
  ctx.lineWidth = 8;
  ctx.moveTo(padding, line_pos);
  ctx.lineTo(app.width - padding, line_pos);
  ctx.shadowColor = "#06b6d4";
  ctx.shadowBlur = 30;
  ctx.stroke();
  ctx.restore();

  const trackGrad = ctx.createLinearGradient(
    padding,
    0,
    app.width - padding,
    0,
  );
  trackGrad.addColorStop(0, "#0891b2");
  trackGrad.addColorStop(0.5, "#22d3ee");
  trackGrad.addColorStop(1, "#0891b2");
  ctx.save();
  ctx.beginPath();
  ctx.strokeStyle = trackGrad;
  ctx.lineWidth = 2;
  ctx.moveTo(padding, line_pos);
  ctx.lineTo(app.width - padding, line_pos);
  ctx.stroke();
  ctx.restore();

  drawTrackScale();

  for (let i = 0; i < arr.length; ++i) {
    const x = padding + arr[i];
    const side = i % 2 === 0 ? -1 : 1;
    const y = line_pos + side * 8;
    const color = side === -1 ? "#a78bfa" : "#22d3ee";
    drawCircle(x, y, 2.5, color, color, 6);
  }

  const cx = padding + arr[0];
  drawCircle(cx, line_pos, 5, "#fbbf24", "#fbbf24", 20);
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, line_pos, 12, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(251, 191, 36, 0.3)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
}

let animationId: number | null = null;

function drawAL(arr: Disk_Path_Arr) {
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
  }

  let i = 0;
  const interval = 20;
  const total = arr.length - 1;
  let lastTime = 0;

  function animate(timestamp: number) {
    if (i >= total) {
      animationId = null;
      return;
    }

    if (timestamp - lastTime < interval) {
      animationId = requestAnimationFrame(animate);
      return;
    }
    lastTime = timestamp;

    const t = total > 0 ? i / total : 0;
    const hue = 220 - t * 180;
    const color = `hsl(${hue}, 90%, 55%)`;

    const startPt = [arr[i] + padding, line_pos + 15 + 3 * i];
    const endPt = [arr[i + 1] + padding, startPt[1] + 3];

    draw(color, startPt[0], startPt[1], endPt[0], endPt[1], 2.5, color, 6);
    drawCircle(endPt[0], endPt[1], 4, "#fbbf24", "#fbbf24", 12);

    const pathEl = document.getElementById("pathoutputbox") as HTMLElement;
    const valEl = pathEl.querySelector(".stat-value") as HTMLElement | null;
    if (valEl) {
      valEl.innerText = String(arr[i]);
    } else {
      pathEl.innerText = `Current Path: ${arr[i]}`;
    }

    i++;
    animationId = requestAnimationFrame(animate);
  }
  animationId = requestAnimationFrame(animate);
}

function calculateTotalLen(arr: Disk_Path_Arr) {
  let sum = 0;
  for (let i = 0; i < arr.length - 1; i++) {
    sum = Math.abs(arr[i] - arr[i + 1]) + sum;
  }
  const distEl = document.getElementById("outputbox") as HTMLElement;
  const valEl = distEl.querySelector(".stat-value") as HTMLElement | null;
  if (valEl) {
    valEl.innerText = String(sum);
  } else {
    distEl.innerText = `Total Length: ${sum}`;
  }
}

function setDirection(): number {
  let d = 0;
  const direction_nodelist = document.getElementsByName("direction");
  for (let i = 0; i <= 1; i++) {
    if ((direction_nodelist[i] as HTMLInputElement).checked) {
      switch (i) {
        case 0:
          d = -1;
          break;
        case 1:
          d = 1;
          break;
      }
    }
  }
  return d;
}

function FCFS(arr: Disk_Path_Arr) {
  drawAL(arr);
  calculateTotalLen(arr);
}

function SSTF(arr: Disk_Path_Arr) {
  const visited_SSTF = new Array(arr.length).fill(false);
  const result_SSTF: Disk_Path_Arr = [arr[0]];
  visited_SSTF[0] = true;

  for (let i = 1; i < arr.length; i++) {
    let minDist = Infinity;
    let nextIdx = -1;
    for (let j = 1; j < arr.length; j++) {
      if (visited_SSTF[j]) continue;
      const dist = Math.abs(result_SSTF[result_SSTF.length - 1] - arr[j]);
      if (dist < minDist) {
        minDist = dist;
        nextIdx = j;
      }
    }
    result_SSTF.push(arr[nextIdx]);
    visited_SSTF[nextIdx] = true;
  }
  drawAL(result_SSTF);
  calculateTotalLen(result_SSTF);
}

function SCAN(arr: Disk_Path_Arr, direction: number) {
  const start = arr[0];
  const requests = arr.slice(1).sort((a, b) => a - b);
  const result_SCAN: Disk_Path_Arr = [start];

  const left = requests.filter((r) => r <= start).reverse();
  const right = requests.filter((r) => r >= start);

  if (direction === -1) {
    result_SCAN.push(...left, ...right);
  } else {
    result_SCAN.push(...right, ...left);
  }
  drawAL(result_SCAN);
  calculateTotalLen(result_SCAN);
}

function C_SCAN(arr: Disk_Path_Arr, direction: number) {
  const start = arr[0];
  const requests = arr.slice(1).sort((a, b) => a - b);
  const result_C_SCAN: Disk_Path_Arr = [start];

  let left = requests.filter((r) => r <= start);
  let right = requests.filter((r) => r >= start);

  if (direction === -1) {
    left = left.reverse();
    right = right.reverse();
    result_C_SCAN.push(...left, ...right);
  } else {
    result_C_SCAN.push(...right, ...left);
  }
  drawAL(result_C_SCAN);
  calculateTotalLen(result_C_SCAN);
}

function resetCanvas() {
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  ctx.clearRect(0, 0, app.width, app.height);

  const g = ctx.createLinearGradient(0, 0, 0, app.height);
  g.addColorStop(0, "#07070d");
  g.addColorStop(0.5, "#0f0f18");
  g.addColorStop(1, "#14141e");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, app.width, app.height);

  ctx.strokeStyle = "rgba(255,255,255,0.03)";
  ctx.lineWidth = 1;
  for (let x = 0; x < app.width; x += 50) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, app.height);
    ctx.stroke();
  }
  for (let y = 0; y < app.height; y += 50) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(app.width, y);
    ctx.stroke();
  }

  drawDiskPathLoc(disk_schedule_arr);
}

const FCFS_button = document.getElementById("FCFS") as HTMLButtonElement;
FCFS_button.addEventListener("click", () => {
  resetCanvas();
  FCFS(disk_schedule_arr);
});

const SSTF_button = document.getElementById("SSTF") as HTMLButtonElement;
SSTF_button.addEventListener("click", () => {
  resetCanvas();
  SSTF(disk_schedule_arr);
});

const SCAN_button = document.getElementById("SCAN") as HTMLButtonElement;
SCAN_button.addEventListener("click", () => {
  resetCanvas();
  direction = setDirection();
  SCAN(disk_schedule_arr, direction);
});

const C_SCAN_button = document.getElementById("C_SCAN") as HTMLButtonElement;
C_SCAN_button.addEventListener("click", () => {
  resetCanvas();
  direction = setDirection();
  C_SCAN(disk_schedule_arr, direction);
});
