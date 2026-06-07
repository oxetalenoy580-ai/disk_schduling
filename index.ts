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
ctx.fillStyle = "#202020";
ctx.fillRect(0, 0, app.width, app.height);

const line_pos = 30;
const padding = 10;
const current_path = Math.floor(Math.random() * 1500);
const quantity = 400;

function draw(
  color: string,
  start_x: number,
  start_y: number,
  end_x: number,
  end_y: number,
  lineWidth: number,
) {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.moveTo(start_x, start_y);
  ctx.lineTo(end_x, end_y);
  ctx.lineWidth = lineWidth;
  ctx.stroke();
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

function drawDiskPathLoc(arr: Disk_Path_Arr) {
  for (let i = 0; i < arr.length; ++i) {
    if (i == 0) {
      draw(
        "red",
        padding + current_path,
        line_pos - 10,
        padding + current_path,
        line_pos,
        1,
      );
    }
    if (i > 0 && i % 2 == 0) {
      draw(
        "blue",
        padding + arr[i],
        line_pos - 10,
        padding + arr[i],
        line_pos,
        1,
      );
    } else {
      draw(
        "blue",
        padding + arr[i],
        line_pos + 10,
        padding + arr[i],
        line_pos,
        1,
      );
    }
  }
}

let animationId: number | null = null;

function drawAL(arr: Disk_Path_Arr) {
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
  }

  let i = 0;
  const interval = 30;

  function animate(timestamp: number) {
    if (i >= arr.length - 1) {
      animationId = null;
      return;
    }
    const start = [arr[i] + padding, line_pos + 15 + 3 * i];
    const endPt = [arr[i + 1] + padding, start[1] + 3];
    draw("red", start[0], start[1], endPt[0], endPt[1], 1);
    i++;
    animationId = setTimeout(() => {
      animationId = requestAnimationFrame(animate);
    }, interval);
  }
  animationId = requestAnimationFrame(animate);
}

function calculateTotalLen(arr: Disk_Path_Arr): number {
  let sum = 0;
  for (let i = 0; i < arr.length - 1; i++) {
    sum = Math.abs(arr[i] - arr[i + 1]) + sum;
  }
  return sum;
}

function FCFS(arr: Disk_Path_Arr) {
  drawAL(arr);
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
}

function C_SCAN(arr: Disk_Path_Arr, direction: number) {
  const start = arr[0];
  const requests = arr.slice(1).sort((a, b) => a - b);
  const result_C_SCAN: Disk_Path_Arr = [start];

  const left = requests.filter((r) => r <= start);
  const right = requests.filter((r) => r >= start);

  if (direction === -1) {
    result_C_SCAN.push(...left, ...right);
  } else {
    result_C_SCAN.push(...right, ...left);
  }
  drawAL(result_C_SCAN);
}

function resetCanvas() {
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  ctx.clearRect(0, 0, app.width, app.height);
  draw("white", padding, line_pos, app.width - padding, line_pos, 3);
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
  // need to create a chose box for direction
  SCAN(disk_schedule_arr, 1);
});
const C_SCAN_button = document.getElementById("C_SCAN") as HTMLButtonElement;
C_SCAN_button.addEventListener("click", () => {
  resetCanvas();
  // need to create a chose box for direction
  C_SCAN(disk_schedule_arr, 1);
});
