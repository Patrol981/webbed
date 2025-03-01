import { useEffect, useState } from "preact/hooks";
import { JSX } from "preact";
import { DirectoryRecord } from "../../lib/three/models/asset-entity.ts";
import TextureListItemComponent from "./TextureListItemComponent.tsx";

const windowStyle: JSX.CSSProperties = {
  height: "100%",
  // maxHeight: "65.5vh",
  maxHeight: "74.8vh",
  width: "fit-content",
  minWidth: "17em",
  display: "flex",
  flexDirection: "column",
  background: "rgba(29, 29, 29, 1)",
  alignSelf: "flex-start",
  marginLeft: "auto",
  overflowY: "scroll",
  overflowX: "hidden",
  justifyItems: "center",
  alignContent: "center",
  alignItems: "center",
  zIndex: 15,
  pointerEvents: "all",
};

export default function TextureListComponent() {
  const texturesPath = "/static/textures";
  const [textures, setTextures] = useState<string[]>([]);

  const getDirStrings = async () => {
    const result = await fetch(`/api/cd?path=${texturesPath}`);
    const records = await result.json() as DirectoryRecord;
    const paths: string[] = [];
    Object.entries(records).map(([name]) => {
      if (
        name.endsWith("png") && !name.includes("Normal") &&
        !name.includes("normal")
      ) {
        paths.push(name);
      }
    });
    setTextures(paths);
  };

  useEffect(() => {
    getDirStrings();
  }, []);

  return (
    <div style={windowStyle}>
      {Object.entries(textures).map(([key, name]) => (
        <TextureListItemComponent
          key={key}
          imgPath={"textures/" + name}
        />
      ))}
    </div>
  );
}
