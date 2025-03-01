import { JSX } from "preact";
import {
  getRaycastedObject,
  getRaycastedObjectFiltered,
} from "../../lib/three/raycast.ts";
import { useEngine } from "../../islands/EngineIsland.tsx";
import { useEffect, useState } from "preact/hooks";
// @ts-types="@types/three/webgpu"
import * as THREE from "three/webgpu";
import { loadTexture } from "../../lib/three/fbx-handler.ts";

interface Props {
  imgPath: string | undefined;
}

const windowStyle: JSX.CSSProperties = {
  padding: "1em",
  width: "fit-content",
  height: "20em",
  color: "white",
};

const windowHoverSTyle: JSX.CSSProperties = {};

const imgStyle: JSX.CSSProperties = {
  height: "90%",
  border: "5px solid #3d3d3d",
  borderRadius: "24px",
  maxHeight: "15em",
  width: "auto",
  marginLeft: "auto",
  marginRight: "auto",
  transition: ".2s all ease",
  cursor: "pointer",
};

const imgHoverStyle: JSX.CSSProperties = {
  border: "5px solid rgba(65, 105, 255, 0.7)",
};

export default function TextureListItemComponent(props: Props) {
  const engine = useEngine();
  const [hover, setHover] = useState(false);
  const [newTexture, setNewTexture] = useState<THREE.Texture | null>(null);
  const [newMaterial, setNewMaterial] = useState<
    THREE.MeshStandardMaterial | null
  >(null);
  const [prevMaterial, setPrevMaterial] = useState<
    THREE.MeshStandardMaterial | null
  >(null);
  const [lastModel, setLastModel] = useState<THREE.Object3D | null>(null);

  const handleTexture = async () => {
    const texture = await loadTexture(props.imgPath!);
    if (texture) {
      setNewTexture(texture);
    }
  };

  useEffect(() => {
    const newMaterial = new THREE.MeshStandardMaterial({
      map: newTexture,
      roughness: 0.5,
    });
    setNewMaterial(newMaterial);
  }, [newTexture]);

  const onDragStart = () => {
    handleTexture();
  };

  const onDragUpdate = (event: DragEvent) => {
    const model = getRaycastedObjectFiltered(
      event.clientX,
      event.clientY,
      engine?.current!,
    );
    if (model && model != lastModel) {
      setLastModel(model);
      model.traverse((child) => {
        if (child as THREE.Mesh) {
          const mesh = child as THREE.Mesh;

          if (!mesh.name.includes("Glass")) {
            setPrevMaterial(mesh.material[0]);
            mesh.material = newMaterial!;
          }
        }
      });
    } else if (model == null) {
      setLastModel(null);
    } else {
      return;
      // if (lastModel) {
      //   lastModel.traverse((child) => {
      //     if (child as THREE.Mesh) {
      //       const mesh = child as THREE.Mesh;

      //       mesh.material = prevMaterial!;
      //     }
      //   });
      //   setLastModel(null);
      // }
    }
  };

  const onDragEnd = () => {
  };

  return (
    <div
      style={{ ...windowStyle, ...(hover ? windowHoverSTyle : null) }}
      onDragStart={onDragStart}
      onDrag={onDragUpdate}
      onDragEnd={onDragEnd}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <img
        style={{ ...imgStyle, ...(hover ? imgHoverStyle : null) }}
        src={props.imgPath}
        alt=""
      />
    </div>
  );
}
