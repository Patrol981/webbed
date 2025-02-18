// @ts-types="@types/three/webgpu"
import * as THREE from "three/webgpu";
import { FBXLoader } from "three/examples/jsm/Addons.js";

const manager = new THREE.LoadingManager();
const loader = new FBXLoader(manager);
const texLoader = new THREE.TextureLoader();

export async function loadFBX(
  path: string,
  texturePath: string,
): Promise<THREE.Group | undefined> {
  try {
    const model = await loader.loadAsync(path);
    if (!model) throw new Error("Could not load file.");

    const texture = await loadTexture(texturePath);

    model.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const newMaterial = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.5,
        });

        mesh.material = newMaterial;
      }
    });

    return model;
  } catch (err) {
    console.log(err);
  }
}

async function loadTexture(url: string) {
  try {
    const texture = await texLoader.loadAsync(url);
    if (!url) throw new Error("Could not load texture.");

    return texture;
  } catch (err) {
    console.log(err);
  }
}
