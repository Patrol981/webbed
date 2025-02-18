import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";
import { GLTFLoaderAnimationStartMode } from "@babylonjs/loaders";

export async function loadGLB(
  modelPath: string,
  texturePath: string,
  scene: BABYLON.Scene,
) {
  const split = modelPath.split("/");
  const rootNode = new BABYLON.TransformNode(split[split.length - 1], scene);

  const result = await BABYLON.LoadAssetContainerAsync(modelPath, scene, {
    pluginOptions: {
      gltf: {
        alwaysComputeSkeletonRootNode: true,
        alwaysComputeBoundingBox: true,
        animationStartMode: GLTFLoaderAnimationStartMode.NONE,
        useGltfTextureNames: false,
        // customRootNode: rootNode,
        loadNodeAnimations: false,
      },
    },
  });

  result.animationGroups.forEach((animation) => animation.stop());

  const texture = new BABYLON.Texture(
    texturePath,
    scene,
    true,
    false,
    BABYLON.Texture.NEAREST_NEAREST,
  );

  console.log(result);

  result.materials.forEach((mat) => {
    if (mat instanceof BABYLON.PBRMaterial) {
      const pbr = mat as BABYLON.PBRMaterial;
      pbr.albedoTexture = texture;
      pbr.metallicTexture = texture;

      pbr.metallic = 0.0;
      pbr.roughness = 1.0;
    } else {
      const std = mat as BABYLON.StandardMaterial;
      std.diffuseTexture = texture;
    }
  });

  // result.meshes.forEach((mesh) => {
  //   // const mat = new BABYLON.StandardMaterial("_diffuse", scene);
  //   // mat.diffuseTexture = texture;
  //   mesh.material = result.materials[0];
  // });

  result.addAllToScene();

  console.log(rootNode);

  return result;
}
