// @ts-types="@types/three"
import * as THREE from "three/webgpu";

const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const pointer = new THREE.Vector2();
const target = new THREE.Vector3(-1, -1, -1);

export function getMousePos(
  x: number,
  y: number,
  raycaster: THREE.Raycaster,
  camera: THREE.Camera,
  grid?: THREE.GridHelper,
): THREE.Vector3 {
  pointer.x = (x / globalThis.innerWidth) * 2 - 1;
  pointer.y = -(y / globalThis.innerHeight) * 2 + 1;

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
): THREE.Object3D | null {
  pointer.x = (x / globalThis.innerWidth) * 2 - 1;
  pointer.y = -(y / globalThis.innerHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const result = raycaster.intersectObjects(scene.children);
  if (result == null) return null;
  return result[0]?.object;
}
