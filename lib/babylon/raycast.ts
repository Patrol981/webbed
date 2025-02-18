import * as BABYLON from "@babylonjs/core";

export function pickObject(
  scene: BABYLON.Scene | undefined,
  camera: BABYLON.Camera | undefined,
) {
  if (scene === undefined || camera === undefined) return;

  const result = scene.pick(scene.pointerX, scene.pointerY);

  return result.pickedMesh;
}
