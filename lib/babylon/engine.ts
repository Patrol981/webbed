import * as BABYLON from "@babylonjs/core";
import { createGroundGrid } from "./helpers.ts";
import { pickObject } from "./raycast.ts";
import { Signal, signal, useSignal } from "@preact/signals";
import { AssetEntity } from "./models/asset-entity.ts";
import { loadGLB } from "./glb-loader.ts";

export class Engine {
  private babylon?: BABYLON.WebGPUEngine;
  private scene?: BABYLON.Scene;

  private camera?: BABYLON.FreeCamera;
  private gizmoManager?: BABYLON.GizmoManager;

  private assets?: Signal<AssetEntity[]> = signal([]);

  constructor(cnv?: HTMLCanvasElement) {
    if (cnv) this.initEngine(cnv);
  }

  public async initEngine(cnv: HTMLCanvasElement) {
    this.babylon = new BABYLON.WebGPUEngine(cnv);
    await this.babylon.initAsync();
    this.scene = new BABYLON.Scene(this.babylon);

    this.camera = new BABYLON.FreeCamera(
      "main",
      new BABYLON.Vector3(0, 3, -5),
      this.scene,
    );
    this.camera.setTarget(new BABYLON.Vector3(0, 0, 0));
    this.camera.attachControl(this.scene, true);
    this.camera.keysUp.push(87);
    this.camera.keysDown.push(83);
    this.camera.keysLeft.push(65);
    this.camera.keysRight.push(68);
    this.camera.speed = 0.1;

    this.gizmoManager = new BABYLON.GizmoManager(this.scene);
    this.gizmoManager.positionGizmoEnabled = true;
    this.gizmoManager.rotationGizmoEnabled = false;
    this.gizmoManager.scaleGizmoEnabled = false;
    this.gizmoManager.boundingBoxGizmoEnabled = false;
    this.gizmoManager.usePointerToAttachGizmos = false;

    this.setupLight(this.scene);
    this.testModel(this.scene);

    createGroundGrid(this.scene, this.camera);

    this.registerListeners();
  }

  public run() {
    this.babylon?.runRenderLoop(() => {
      this.scene?.render();
    });
  }

  private registerListeners() {
    if (this.scene === undefined) return;

    this.scene.onPointerDown = (pointer) => {
      if (pointer.button !== 0) return;
      const mesh = pickObject(this.scene, this.camera);
      if (mesh) {
        this.gizmoManager?.attachToMesh(mesh);
      } else {
        this.gizmoManager?.attachToMesh(null);
      }
    };
  }

  private setupLight(scene: BABYLON.Scene) {
    const light = new BABYLON.HemisphericLight(
      "light1",
      new BABYLON.Vector3(0, 1, 0),
      scene,
    );
    light.intensity = 0.7;
  }

  private async testModel(scene: BABYLON.Scene) {
    const sphere = BABYLON.MeshBuilder.CreateSphere(
      "sphere1",
      { segments: 16 },
      scene,
    );
    sphere.position.y = 2;

    const model = await loadGLB(
      "/models/SK_Chr_DarkLord_Male_01.glb",
      "/textures/PolygonDarkFantasy_Texture_02_A.png",
      scene,
    );
    // model.scaling = new BABYLON.Vector3(0.03, 0.03, 0.03);

    const ground = BABYLON.MeshBuilder.CreateGround("ground", {
      width: 6,
      height: 6,
      subdivisions: 2,
    }, scene);
    ground.position.y = 1;
  }

  //#region GETTERS

  public get Assets(): Signal<AssetEntity[]> {
    if (!this.assets) throw new Error("Assets not initialized");

    return this.assets;
  }

  //#endregion

  //#region SETTERS

  public set Assets(assets: AssetEntity[]) {
    if (!this.assets) throw new Error("Assets not initialized");

    this.assets.value = assets;
  }

  //#endregion
}
