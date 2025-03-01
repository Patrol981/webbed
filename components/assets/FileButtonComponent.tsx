import { JSX } from "preact";
import { Dispatch, StateUpdater, useEffect, useState } from "preact/hooks";
import { AssetEntity } from "../../lib/three/models/asset-entity.ts";
import { Signal } from "@preact/signals";
// @ts-types="@types/three/webgpu"
import * as THREE from "three/webgpu";
import { getMousePos } from "../../lib/three/raycast.ts";
import { Engine } from "../../lib/three/engine.ts";
import { useEngine } from "../../islands/EngineIsland.tsx";

interface Props {
  type: "folder" | "file";
  redirectTo?: string;
  setCurrentDirectory: Dispatch<StateUpdater<string | null>>;

  name: string;
  isBackButton?: boolean;
}

const buttonStyle: JSX.CSSProperties = {
  color: "honeydew",
  width: "fit-content",
  height: "fit-content",
  minWidth: "7.5em",
  minHeight: "7.5em",
  maxWidth: "9em",
  maxHeight: "9em",
  position: "relative",
  justifyContent: "center",
  justifyItems: "center",
  alignContent: "flex-start",
  alignItems: "middle",
  marginLeft: "0",
  marginRight: "0",
  marginTop: "1em",
  paddingTop: "0.25em",
  paddingBottom: "0.25em",
  paddingLeft: "1.5em",
  paddingRight: "1.5em",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "no-wrap",
  transition: "0.2s all ease",
  borderRadius: "24px",
};

const buttonStyleHover: JSX.CSSProperties = {
  background: "white",
  color: "#1d1d1d",
  cursor: "pointer",
};

const textStyle: JSX.CSSProperties = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  textAlign: "center",
  whiteSpace: "no-wrap",
};

const imgStyle: JSX.CSSProperties = {
  width: "auto",
  height: "6em",
};

const imgStyleHover: JSX.CSSProperties = {
  filter: "invert(100%)",
};

export function FileButtonComponent(props: Props) {
  const engine = useEngine();
  const [hover, setHover] = useState(false);

  let model: THREE.Group | THREE.Object3D | null = null;

  const redirectToTarget = () => {
    if (props.type === "file" || !props.redirectTo) return;

    props.setCurrentDirectory(props.redirectTo);
  };

  const getMatchingStrings = (str: string, assets: AssetEntity[]) => {
    return assets.filter((asset) => asset.path?.includes(str));
  };

  const getIcon = () => {
    if (props.isBackButton) {
      return (
        <img
          style={{ ...imgStyle, ...(hover ? imgStyleHover : null) }}
          src="folder_open.svg"
        />
      );
    } else {
      if (props.type === "folder") {
        return (
          <img
            style={{ ...imgStyle, ...(hover ? imgStyleHover : null) }}
            src="folder.svg"
          />
        );
      } else {
        return (
          <img
            style={{ ...imgStyle, ...(hover ? imgStyleHover : null) }}
            src="file.svg"
          />
        );
      }
    }
  };

  const onDragUpdate = (event: DragEvent) => {
    if (model) {
      const { x, y, z } = getMousePos(
        event.x,
        event.y,
        engine!.current!.Raycaster,
        engine!.current!.Camera,
        engine!.current!,
      );

      model.position.set(x, y, z);
    }
  };

  const onDragStart = (event: DragEvent) => {
    if (!model) {
      const target = getMatchingStrings(
        props.name,
        engine!.current?.Assets?.value!,
      );
      if (!engine!.current?.Assets?.value[0].model) return;
      model = engine!.current.addToScene(target[0].model!, true);
      model?.scale.set(0.02, 0.02, 0.02);
    }
  };

  const onDragEnd = (event: DragEvent) => {
    if (model) {
      const { x, y, z } = getMousePos(
        event.clientX,
        event.clientY,
        engine!.current!.Raycaster,
        engine!.current!.Camera,
        engine!.current!,
      );
      model?.position.set(x, y, z);
      model = null;
    }
  };

  return (
    <div
      style={{ ...buttonStyle, ...(hover ? buttonStyleHover : null) }}
      onClick={() => {
        redirectToTarget();
      }}
      title={props.name}
      onDragStart={onDragStart}
      onDrag={onDragUpdate}
      onDragEnd={onDragEnd}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {getIcon()}
      {!props.isBackButton ? <p style={textStyle}>{props.name}</p> : ""}
    </div>
  );
}
