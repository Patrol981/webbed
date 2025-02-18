// @ts-types="@types/three/webgpu"
import * as THREE from "three/webgpu";

export type AssetEntity = {
  path?: string;
  texturePath?: string;
  thumbnailPath?: string;
  thumbnail?: string;
  model?: THREE.Group;
};

export type AssetRecord = Record<string, "file" | "unknown">;
export type DirectoryRecord = Record<string, "file" | "folder">;
