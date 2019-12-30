// import { random } from "lodash";
import shipImg from './rocket-ship.svg';
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const ship = new Image();
ship.src = shipImg;

const rocketSize = 50;
// const acceleration = 5;
// const topSpeed = 10;
const turnSpeed = 180;

let x = Math.floor(window.innerWidth / 2);
let y = Math.floor(window.innerHeight / 2);
let cursorX = x;
let cursorY = y;
// let xVel = 0;
// let yVel = 0;
let rotation = 0;
let timestamp = new Date().getTime();

function init() {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;

  canvas.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
  });

  window.requestAnimationFrame(draw);
}

function draw() {
  ctx.fillStyle = 'rgba(255, 255, 255, 1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const newTime = new Date().getTime();
  const elapsed = newTime - timestamp;
  timestamp = newTime;
  const timeModifier = elapsed / 1000;

  rotation = rotation + turnSpeed * timeModifier;
  if (rotation >= 360) {
    rotation = rotation - 360;
  }
  if (rotation < 0) {
    rotation = rotation + 360;
  }

  // x += xVel;
  // y += yVel;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((rotation * Math.PI) / 180);

  // Draw rocket
  ctx.drawImage(
    ship,
    0 - rocketSize / 2,
    0 - rocketSize / 2,
    rocketSize,
    rocketSize,
  );
  ctx.restore();

  // Draw line from rocket to cursor
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(cursorX, cursorY);
  ctx.stroke();
  ctx.restore();

  window.requestAnimationFrame(draw);
}

export default init;
