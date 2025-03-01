// @ts-types="@types/three/webgpu"
import * as THREE from "three/webgpu";
import { FBXLoader } from "three/examples/jsm/Addons.js";

const manager = new THREE.LoadingManager();
const loader = new FBXLoader(manager);
const texLoader = new THREE.TextureLoader();

export async function loadFBX(
  path: string,
  textureFolder: string,
  texturePaths: string[],
  defaultPath: string,
): Promise<THREE.Group | undefined> {
  try {
    const textureMap = createTextureMap(textureFolder, texturePaths);

    const model = await loader.loadAsync(path);
    if (!model) throw new Error("Could not load file.");

    model.traverse(async (child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const materialHint = (mesh.material && (mesh.material as any).name) ||
          mesh.name;
        const textureUrl = findClosestTexture(materialHint, textureMap);

        let targetTexture = "";

        if (mesh.name.includes("Glass")) {
          targetTexture = textureUrl!;
        } else if (mesh.name.includes("Bld")) {
          targetTexture = "textures/Brick_Small_04.png";
        } else {
          targetTexture = defaultPath;
        }

        const texture = await loadTexture(targetTexture);
        const newMaterial = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.5,
        });
        mesh.material = newMaterial;
      }
    });

    return model;
  } catch (err) {
    console.error(err);
  }
}

export async function loadTexture(url: string) {
  try {
    const texture = await texLoader.loadAsync(url);
    if (!url) throw new Error("Could not load texture.");

    return texture;
  } catch (err) {
    console.log(err);
  }
}

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  // Initialize first column.
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  // Initialize first row.
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  // Compute distances.
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1, // deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

type TextureMap = { [key: string]: string };
function findClosestTexture(
  refName: string,
  textureMap: TextureMap,
): string | undefined {
  const keys = Object.keys(textureMap);
  let bestMatch: string | null = null;
  let bestDistance = Infinity;
  const normalizedRef = refName.toLowerCase();
  for (const key of keys) {
    const distance = levenshteinDistance(normalizedRef, key.toLowerCase());
    if (distance < bestDistance) {
      bestDistance = distance;
      bestMatch = key;
    }
  }
  return bestMatch ? textureMap[bestMatch] : undefined;
}

function createTextureMap(
  textureFolder: string,
  fileNames: string[],
): TextureMap {
  const textureMap: TextureMap = {};
  for (const fileName of fileNames) {
    // Remove extension and convert to lowercase.
    const dotIndex = fileName.lastIndexOf(".");
    const nameWithoutExt = dotIndex !== -1
      ? fileName.substring(0, dotIndex).toLowerCase()
      : fileName.toLowerCase();
    textureMap[nameWithoutExt] = `${textureFolder}/${fileName}`;
  }
  return textureMap;
}
