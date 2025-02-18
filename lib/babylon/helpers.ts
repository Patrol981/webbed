import * as BABYLON from "@babylonjs/core";

export function createGroundGrid(scene: BABYLON.Scene, camera: BABYLON.Camera) {
  const shaderMaterial = new BABYLON.ShaderMaterial("gridShader", scene, {
    vertexSource: `
        precision highp float;
        attribute vec3 position;
        uniform mat4 worldViewProjection;
        varying vec3 vPosition;

        void main() {
            vPosition = position;
            gl_Position = worldViewProjection * vec4(position, 1.0);
        }
    `,
    fragmentSource: `
        precision highp float;
        varying vec3 vPosition;
        uniform vec3 cameraPosition;

        void main() {
            float gridSize = 1.0;
            vec2 gridPos = vPosition.xz + cameraPosition.xz;

            vec2 grid = abs(fract(gridPos / gridSize - 0.5) - 0.5) / fwidth(gridPos);
            float line = min(grid.x, grid.y);

            float alpha = (1.0 - smoothstep(1.0, 0.0, line)) * 0.3;

            gl_FragColor = vec4(vec3(alpha), alpha);
        }
    `,
  }, {
    attributes: ["position"],
    uniforms: ["worldViewProjection", "cameraPosition"],
  });
  shaderMaterial.backFaceCulling = false;
  shaderMaterial.needAlphaBlending = () => true;

  const ground = BABYLON.MeshBuilder.CreateGround("helper_grid", {
    width: 1000,
    height: 1000,
  }, scene);
  ground.material = shaderMaterial;
  ground.isPickable = false;

  scene.onBeforeRenderObservable.add(() => {
    shaderMaterial.setVector3("cameraPosition", new BABYLON.Vector3());
  });
}
