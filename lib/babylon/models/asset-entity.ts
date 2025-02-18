import * as BABYLON from "@babylonjs/core";

export type AssetEntity = {
  path?: string;
  texturePath?: string;
  thumbnailPath?: string;
  thumbnail?: string;
  model?: BABYLON.Mesh;
};
