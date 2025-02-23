// @ts-types="@types/three/webgpu"
import * as THREE from "three/webgpu";
// @ts-types="@types/three/examples/jsm/Addons"
import {
  OBB,
  OrbitControls,
  SkeletonUtils,
  TransformControls,
} from "three/examples/jsm/Addons.js";
import { Signal, signal } from "@preact/signals";
import { AssetEntity } from "./models/asset-entity.ts";
import { getRaycastedObject } from "./raycast.ts";
import { loadFBX } from "./fbx-handler.ts";
import { UserData } from "./models/user-data.ts";

export class Engine {
  private scene: THREE.Scene;
  private thumbnailScene: THREE.Scene;

  private renderer!: THREE.Renderer;
  private thumbnailRenderer!: THREE.Renderer;

  private camera: THREE.Camera;
  private thumbnailCamera: THREE.Camera;

  private orbitControls!: OrbitControls;
  private transformControls!: TransformControls;
  private transformGuizmo;
  private clock!: THREE.Clock;
  private raycaster!: THREE.Raycaster;

  private sceneGrid!: THREE.GridHelper;

  private assets?: Signal<AssetEntity[]> = signal([]);

  constructor(cnv?: HTMLCanvasElement) {
    if (cnv) this.initEngine(cnv);

    this.scene = new THREE.Scene();
    this.thumbnailScene = new THREE.Scene();
    this.scene.background = new THREE.Color("rgb(200,200,200)");
    this.thumbnailScene.background = new THREE.Color("rgb(154, 157, 177)");

    this.camera = new THREE.PerspectiveCamera(
      75,
      globalThis.innerWidth / globalThis.innerHeight,
      0.1,
      1000,
    );
    this.thumbnailCamera = new THREE.PerspectiveCamera(
      75,
      512 / 512,
      0.1,
      1000,
    );

    this.camera.position.z = 5;
    this.camera.position.y = 2;
    this.thumbnailCamera.position.z = 150;
    this.thumbnailCamera.position.y = 100;
    this.thumbnailCamera.position.x = 0;
  }

  public initEngine(cnv: HTMLCanvasElement) {
    console.log("init engine");

    this.renderer = new THREE.WebGPURenderer({ canvas: cnv, alpha: false });
    this.renderer.setSize(globalThis.innerWidth, globalThis.innerHeight);

    this.thumbnailRenderer = new THREE.WebGPURenderer({
      canvas: undefined,
      alpha: false,
    });
    this.thumbnailRenderer.setSize(512, 512);

    this.setupLights(this.scene);
    this.setupLights(this.thumbnailScene);
    this.sceneGrid = this.setupGrid();

    this.orbitControls = new OrbitControls(
      this.camera,
      this.renderer.domElement,
    );
    this.transformControls = new TransformControls(
      this.camera,
      this.renderer.domElement,
    );
    this.transformControls.setMode("translate");
    this.transformGuizmo = this.transformControls.getHelper();
    this.scene.add(this.transformGuizmo);

    this.raycaster = new THREE.Raycaster();

    this.clock = new THREE.Clock();
    this.clock.start();

    this.setupEventListeners();

    // this.testModel();
  }

  public async testModel() {
    const model = await loadFBX(
      "/fbx/Characters/Individual/Characters/SM_Chr_Priest_Female_01.fbx",
      "/textures/PolygonDarkFantasy_Texture_02_A.png",
    );
    model?.position.set(0, 0, 0);
    model?.scale.set(0.3, 0.3, 0.3);
    this.scene.add(model!);
  }

  public async render(): Promise<void> {
    await this.thumbnailRenderer.renderAsync(
      this.thumbnailScene,
      this.thumbnailCamera,
    );
    await this.renderer.renderAsync(this.scene, this.camera);
  }

  public async renderThumbnail(): Promise<string> {
    const renderTarget = new THREE.RenderTarget(512, 512);
    await this.thumbnailRenderer.renderAsync(
      this.thumbnailScene,
      this.thumbnailCamera,
    );
    this.thumbnailRenderer.setRenderTarget(renderTarget);
    const outputData = this.thumbnailRenderer.domElement.toDataURL("image/png");
    this.thumbnailRenderer.setRenderTarget(null);
    return outputData;
  }

  public addToScene(
    obj: THREE.Group | THREE.Mesh,
    clone: boolean = false,
  ): THREE.Object3D | null {
    if (clone) {
      const clonedObj = SkeletonUtils.clone(obj);
      let min = new THREE.Vector3();
      let max = new THREE.Vector3();
      clonedObj.traverse((child) => {
        if (child instanceof THREE.Mesh || child instanceof THREE.SkinnedMesh) {
          const geometry = child.geometry as THREE.BufferGeometry;
          if (geometry) {
            geometry.computeVertexNormals();
            geometry.computeBoundingBox();
            geometry.computeBoundingSphere();
            geometry.attributes.position.needsUpdate = true;

            if (geometry.boundingBox!.min < min) {
              min = geometry.boundingBox!.min;
            }
            if (geometry.boundingBox!.max > max) {
              max = geometry.boundingBox!.max;
            }
          }
        }
      });
      this.scene.add(clonedObj);
      clonedObj.matrixAutoUpdate = true;
      const aabb = new THREE.Box3().setFromObject(clonedObj);
      const obb = new OBB().fromBox3(aabb);
      const userData: UserData = {
        obb: obb,
      };
      clonedObj.userData = userData;
      console.log(clonedObj);
      return clonedObj;
    } else {
      this.scene.add(obj);
      obj.matrixAutoUpdate = true;
      return obj;
    }
  }

  public setupThumbnailScene(
    obj: THREE.Group | THREE.Mesh,
  ): THREE.Group | THREE.Mesh {
    const clone = obj.clone(true);
    this.thumbnailScene.add(clone);
    clone.position.set(0, 0, 0);
    clone.scale.set(0.02, 0.02, 0.02);
    return clone;
  }

  public clearThumbnailScene(obj: THREE.Group | THREE.Mesh) {
    this.thumbnailScene.remove(obj);
  }

  private setupEventListeners() {
    this.transformControls.addEventListener("dragging-changed", (event) => {
      this.orbitControls.enabled = !event.value;
    });

    document.addEventListener("mousedown", (event: MouseEvent) => {
      if (event.button !== 0) return;
      const obj = getRaycastedObject(
        event.clientX,
        event.clientY,
        this.raycaster,
        this.camera,
        this.scene,
      );
      if (obj && !this.isHelperObject(obj)) {
        console.log(obj);
        if (obj.type === "SkinnedMesh") {
          this.transformControls.attach(obj.parent!);
        } else {
          this.transformControls.attach(obj);
        }
      }
    });

    document.addEventListener("keyup", (event) => {
      switch (event.key) {
        case "w":
          this.transformControls.setMode("translate");
          break;
        case "r":
          this.transformControls.setMode("rotate");
          break;
        case "e":
          this.transformControls.setMode("scale");
          break;
        case "Delete":
          this.scene.remove(this.transformControls.object);
          this.transformControls.detach();
          break;
        case "Escape":
          this.transformControls.detach();
          break;
        default:
          console.log(event.key);
          break;
      }
    });
  }

  private isHelperObject(obj: THREE.Object3D): boolean {
    let currentObj: THREE.Object3D | null = obj;

    while (currentObj) {
      if (
        currentObj === this.sceneGrid ||
        currentObj === this.transformGuizmo
      ) {
        return true;
      }
      currentObj = currentObj.parent;
    }

    return false;
  }

  private setupLights(targetScene: THREE.Scene) {
    const light = new THREE.AmbientLight(THREE.Color.NAMES.gray);
    const directionalLight = new THREE.DirectionalLight(
      THREE.Color.NAMES.white,
      1,
    );

    targetScene.add(light);
    targetScene.add(directionalLight);
  }

  private setupGrid(): THREE.GridHelper {
    const grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    this.scene.add(grid);
    return grid;
  }

  public get Renderer() {
    return this.renderer;
  }

  public get Scene() {
    return this.scene;
  }

  public get SceneGrid() {
    return this.sceneGrid;
  }

  public get Camera() {
    return this.camera;
  }

  public get Clock() {
    return this.clock;
  }

  public get Raycaster() {
    return this.raycaster;
  }

  public get Assets(): Signal<AssetEntity[]> {
    if (!this.assets) throw new Error("Assets not initialized");

    return this.assets;
  }

  public set Assets(assets: AssetEntity[]) {
    if (!this.assets) throw new Error("Assets not initialized");

    this.assets.value = assets;
  }
}
