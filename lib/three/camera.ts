// @ts-types="@types/three/webgpu"
import * as THREE from "three/webgpu";
import { Engine } from "./engine.ts";

const cameraSpeed = 15.0;
const lookSpeed = 0.002;
let yaw = 0, pitch = 0;

export function setupCameraMovement(engine: Engine) {
  document.addEventListener(
    "keydown",
    (event) => engine.Keys[event.code] = true,
  );
  document.addEventListener(
    "keyup",
    (event) => engine.Keys[event.code] = false,
  );
}

export function setupCameraLook(engine: Engine) {
  document.addEventListener("mousedown", (event) => {
    if (event.button === 2) {
      engine.RightMouseButtonDown = true;
      engine.PreviousMousePosition.x = event.clientX;
      engine.PreviousMousePosition.y = event.clientY;
    }
  });
  document.addEventListener("mouseup", (event) => {
    if (event.button === 2) engine.RightMouseButtonDown = false;
  });

  document.addEventListener("mousemove", (event) => {
    if (!engine.RightMouseButtonDown) return;

    const deltaX = event.clientX - engine.PreviousMousePosition.x;
    const deltaY = event.clientY - engine.PreviousMousePosition.y;
    engine.PreviousMousePosition.x = event.clientX;
    engine.PreviousMousePosition.y = event.clientY;

    yaw -= deltaX * lookSpeed;
    pitch -= deltaY * lookSpeed;
    pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch)); // Clamp pitch

    const quaternion = new THREE.Quaternion();
    quaternion.setFromEuler(new THREE.Euler(pitch, yaw, 0, "YXZ"));
    engine.Camera.quaternion.copy(quaternion);
  });

  document.addEventListener("contextmenu", (event) => event.preventDefault());
}

export function updateCameraMovement(engine: Engine) {
  const right = new THREE.Vector3();
  const forward = new THREE.Vector3();
  const movement = new THREE.Vector3();

  engine.Camera.getWorldDirection(forward);
  right.crossVectors(engine.Camera.up, forward).normalize();

  if (engine.Keys["KeyW"]) movement.add(forward);
  if (engine.Keys["KeyS"]) movement.sub(forward);
  if (engine.Keys["KeyA"]) movement.add(right);
  if (engine.Keys["KeyD"]) movement.sub(right);

  movement.normalize().multiplyScalar(cameraSpeed * engine.Clock.getDelta());
  engine.Camera.position.add(movement);
}
