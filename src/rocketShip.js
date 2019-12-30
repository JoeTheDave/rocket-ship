// import { random } from "lodash";
import shipImg from './rocket-ship.svg';
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const ship = new Image();
ship.src = shipImg;

const rocketSize = 50;
// const acceleration = 5;
// const maxVelocity = 10;
const maxRotationalVelocity = 120;
const rotationalAcceleration = 360;

let x = Math.floor(window.innerWidth / 2);
let y = Math.floor(window.innerHeight / 2);
let cursorX = x;
let cursorY = y;
// let xVel = 0;
// let yVel = 0;
let rotationalVelocity = 0;
let rotation = 60;
let timestamp = new Date().getTime();

function init() {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;

  canvas.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
  });

  ctx.font = '18px serif';

  window.requestAnimationFrame(draw);
}

const radiansToDegrees = (radians) => radians * (180 / Math.PI);

const determineAngleToDestination = () => {
  const xComponent = cursorX - x;
  const yComponent = cursorY - y;
  const hypot = Math.sqrt(Math.pow(xComponent, 2) + Math.pow(yComponent, 2));
  if (xComponent >= 0 && yComponent < 0) {
    // quadrant 1
    return radiansToDegrees(Math.asin(xComponent / hypot));
  }
  if (xComponent >= 0 && yComponent >= 0) {
    // quadrant 2
    return 180 - radiansToDegrees(Math.asin(xComponent / hypot));
  }
  if (xComponent < 0 && yComponent >= 0) {
    // quadrant 3
    return 180 + Math.abs(radiansToDegrees(Math.asin(xComponent / hypot)));
  }
  if (xComponent < 0 && yComponent < 0) {
    // quadrant 4
    return 360 + radiansToDegrees(Math.asin(xComponent / hypot));
  }
  return 0;
};

const determineAngleCorrection = () => {
  const destinationAngle = determineAngleToDestination();
  const diff = ((destinationAngle - rotation + 180) % 360) - 180;
  return diff < -180 ? diff + 360 : diff;
};

function draw() {
  const correction = determineAngleCorrection();

  // Clear canvas
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Debug
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 1)';
  ctx.fillText(`Rotational Velocity: ${rotationalVelocity}`, 10, 20);
  ctx.fillText(`Angular Correction: ${correction}`, 10, 40);
  ctx.restore();

  // Determine time modifier
  const newTime = new Date().getTime();
  const elapsed = newTime - timestamp;
  timestamp = newTime;
  const timeModifier = elapsed / 1000;

  // Steer ship

  const rotationalVelocityDelta = rotationalAcceleration * timeModifier;
  if (correction) {
    if (correction > 0) {
      // turn right
      // if (rotationalVelocity > correction) {
      //   rotationalVelocity -= rotationalVelocityDelta;
      // } else {
      rotationalVelocity += rotationalVelocityDelta;
      // }
      rotationalVelocity = Math.min(rotationalVelocity, maxRotationalVelocity);
    }
    if (correction < 0) {
      // turn left
      // if (rotationalVelocity < correction) {
      //   rotationalVelocity += rotationalVelocityDelta;
      // } else {
      rotationalVelocity -= rotationalVelocityDelta;
      // }
      rotationalVelocity -= rotationalVelocityDelta;
      rotationalVelocity = Math.max(
        rotationalVelocity,
        maxRotationalVelocity * -1,
      );
    }
    rotation = rotation + rotationalVelocity * timeModifier;
  }

  // rotation = rotation + maxRotationalVelocity * timeModifier;
  // if (rotation >= 360) {
  //   rotation = rotation - 360;
  // }
  // if (rotation < 0) {
  //   rotation = rotation + 360;
  // }

  // Draw rocket
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((rotation * Math.PI) / 180);
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
