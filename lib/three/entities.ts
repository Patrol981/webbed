// @ts-types="@types/three/webgpu"
import * as THREE from "three/webgpu";
import { loadFBX } from "./fbx-handler.ts";
import type { Engine } from "./engine.ts";
import { AssetEntity } from "./models/asset-entity.ts";

export async function generateThumbnail(
  asset: AssetEntity,
  engine: Engine,
): Promise<void> {
  const modelClone = engine.setupThumbnailScene(asset.model!);
  asset.thumbnail = await engine.renderThumbnail();
  engine.clearThumbnailScene(modelClone);
}

// export async function loadEntity(
//   path: string,
//   texturePath: string,
// ): Promise<AssetEntity> {
//   const entity: AssetEntity = {
//     model: await loadFBX(path, [], texturePath),
//     path: path,
//     texturePath: texturePath,
//   };

//   return entity;
// }

// export async function loadEntitiesFromEntries(
//   entries: string[],
// ): Promise<AssetEntity[]> {
//   const entities: AssetEntity[] = [];

//   for (let i = 0; i < entries.length; i++) {
//     try {
//       const asset = await loadEntity(
//         `fbx/${entries[i]}`,
//         "textures/PolygonDarkFantasy_Texture_02_A.png",
//       );
//       asset.model!.scale.x = 0.02;
//       asset.model!.scale.y = 0.02;
//       asset.model!.scale.z = 0.02;
//       entities.push(asset);
//     } catch (err) {
//       throw err;
//     }
//   }

//   return entities;
// }
