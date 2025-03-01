// @ts-types="@types/three/webgpu"
import * as THREE from "three/webgpu";
import { Engine } from "./engine.ts";

const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const pointer = new THREE.Vector2();
const target = new THREE.Vector3(-1, -1, -1);

export function getMousePos(
  x: number,
  y: number,
  raycaster: THREE.Raycaster,
  camera: THREE.Camera,
  engine: Engine,
  grid?: THREE.GridHelper,
): THREE.Vector3 {
  pointer.x = (x / engine.Renderer._width) * 2 - 1;
  pointer.y = -(y / engine.Renderer._height) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);

  if (grid) {
    if (grid.geometry.boundingBox) {
      raycaster.ray.intersectBox(grid.geometry.boundingBox, target);
    } else if (grid.geometry.boundingSphere) {
      raycaster.ray.intersectSphere(grid.geometry.boundingSphere, target);
    }
  } else {
    raycaster.ray.intersectPlane(plane, target);
  }

  return target;
}

export function getRaycastedObject(
  x: number,
  y: number,
  raycaster: THREE.Raycaster,
  camera: THREE.Camera,
  scene: THREE.Scene,
  engine: Engine,
): THREE.Object3D | null {
  pointer.x = (x / engine.Renderer._width) * 2 - 1;
  pointer.y = -(y / engine.Renderer._height) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const result = raycaster.intersectObjects(scene.children);
  if (result == null) return null;
  return result[0]?.object;
}

export function getRaycastedObjectFiltered(
  x: number,
  y: number,
  engine: Engine,
): THREE.Object3D | null {
  const obj = getRaycastedObject(
    x,
    y,
    engine.Raycaster,
    engine.Camera,
    engine.Scene,
    engine,
  );
  if (obj && !engine.isHelperObject(obj)) {
    if (obj.type === "SkinnedMesh") {
      return obj.parent!;
    } else {
      return obj;
    }
  }

  return null;
}
