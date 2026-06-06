"use strict";
const canvasId = "app";
const app = document.getElementById("app");
if (app === null) {
    throw new Error(`can not find canvas ${canvasId}`);
}
app.width = 1520;
app.height = 1300;
const ctx = app.getContext("2d");
if (ctx === null) {
    throw new Error(`can not init context`);
}
ctx.fillStyle = "#202020";
ctx.fillRect(0, 0, app.width, app.height);
const line_pos = 30;
const padding = 10;
const current_path = Math.floor(Math.random() * 1500);
const quantity = 400;
function draw(color, start_x, start_y, end_x, end_y, lineWidth) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(start_x, start_y);
    ctx.lineTo(end_x, end_y);
    ctx.lineWidth = lineWidth;
    ctx.stroke();
}
function randomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function chaosArr(arr) {
    for (let i = 0; i < arr.length; ++i) {
        const x = randomInRange(0, arr.length - 1);
        const y = randomInRange(0, arr.length - 1);
        if (x == y) {
            continue;
        }
        else {
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
function drawDiskPathLoc(arr) {
    for (let i = 0; i < arr.length; ++i) {
        if (i == 0) {
            draw("red", padding + current_path, line_pos - 10, padding + current_path, line_pos, 1);
        }
        if (i > 0 && i % 2 == 0) {
            draw("blue", padding + arr[i], line_pos - 10, padding + arr[i], line_pos, 1);
        }
        else {
            draw("blue", padding + arr[i], line_pos + 10, padding + arr[i], line_pos, 1);
        }
    }
}
function drawAL(arr) {
    for (let i = 0; i < arr.length - 1; ++i) {
        const start = [arr[i] + padding, line_pos + 15 + 3 * i];
        const end = [arr[i + 1] + padding, start[1] + 3];
        draw("red", start[0], start[1], end[0], end[1], 1);
    }
}
function FCFS(arr) {
    drawAL(arr);
}
function SSTF(arr) {
    const visited_SSTF = new Array(arr.length).fill(false);
    const result_SSTF = [arr[0]];
    visited_SSTF[0] = true;
    for (let i = 1; i < arr.length; i++) {
        let minDist = Infinity;
        let nextIdx = -1;
        for (let j = 1; j < arr.length; j++) {
            if (visited_SSTF[j])
                continue;
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
function SCAN(arr, direction) {
    const start = arr[0];
    const requests = arr.slice(1).sort((a, b) => a - b);
    const result_SCAN = [start];
    const left = requests.filter((r) => r <= start).reverse();
    const right = requests.filter((r) => r >= start);
    if (direction === -1) {
        result_SCAN.push(...left, ...right);
    }
    else {
        result_SCAN.push(...right, ...left);
    }
    drawAL(result_SCAN);
}
function C_SCAN(arr, direction) {
    const start = arr[0];
    const requests = arr.slice(1).sort((a, b) => a - b);
    const result_C_SCAN = [start];
    const left = requests.filter((r) => r <= start);
    const right = requests.filter((r) => r >= start);
    if (direction === -1) {
        result_C_SCAN.push(...left, ...right);
    }
    else {
        result_C_SCAN.push(...right, ...left);
    }
    drawAL(result_C_SCAN);
}
const FCFS_button = document.getElementById("FCFS");
FCFS_button.addEventListener("click", () => {
    ctx.clearRect(0, 0, app.width, app.height);
    draw("white", padding, line_pos, app.width - padding, line_pos, 3);
    drawDiskPathLoc(disk_schedule_arr);
    FCFS(disk_schedule_arr);
});
const SSTF_button = document.getElementById("SSTF");
SSTF_button.addEventListener("click", () => {
    ctx.clearRect(0, 0, app.width, app.height);
    draw("white", padding, line_pos, app.width - padding, line_pos, 3);
    drawDiskPathLoc(disk_schedule_arr);
    SSTF(disk_schedule_arr);
});
const SCAN_button = document.getElementById("SCAN");
SCAN_button.addEventListener("click", () => {
    ctx.clearRect(0, 0, app.width, app.height);
    draw("white", padding, line_pos, app.width - padding, line_pos, 3);
    drawDiskPathLoc(disk_schedule_arr);
    // need to create a chose box for direction
    SCAN(disk_schedule_arr, 1);
});
const C_SCAN_button = document.getElementById("C_SCAN");
C_SCAN_button.addEventListener("click", () => {
    ctx.clearRect(0, 0, app.width, app.height);
    draw("white", padding, line_pos, app.width - padding, line_pos, 3);
    drawDiskPathLoc(disk_schedule_arr);
    // need to create a chose box for direction
    C_SCAN(disk_schedule_arr, 1);
});
//# sourceMappingURL=index.js.map