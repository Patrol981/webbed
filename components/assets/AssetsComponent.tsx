import { Signal } from "@preact/signals";
import { useEffect, useState } from "preact/hooks";
import {
  AssetEntity,
  AssetRecord,
  DirectoryRecord,
} from "../../lib/three/models/asset-entity.ts";
import { JSX } from "preact";
import { FileButtonComponent } from "./FileButtonComponent.tsx";
import { Engine } from "../../lib/three/engine.ts";
import { loadFBX } from "../../lib/three/fbx-handler.ts";
import { useEngine } from "../../islands/EngineIsland.tsx";

interface Props {
  // assets: Signal<AssetEntity[]> | undefined;
  assetRecord: AssetRecord | undefined;
  // engine: Engine;
}

const panelStyle: JSX.CSSProperties = {
  position: "absolute",
  width: "100vw",
  height: "15rem",
  backgroundColor: "rgba(35, 35, 35, 0.5)",
  bottom: 0,
  left: 0,
  overflowY: "scroll",
};

const dirContentStyle: JSX.CSSProperties = {
  position: "absolute",
  width: "100%",
  height: "90%",
  bottom: 0,
  right: 0,
  overflowY: "scroll",
  display: "flex",
  gap: "1em",
  flexWrap: "wrap",
  justifyContent: "flex-start",
  alignContent: "flex-start",
  paddingLeft: "1em",
  paddingRight: "1em",
};

export function AssetsComponent(props: Props) {
  const [currentDirectory, setCurrentDirectory] = useState<string | null>(null);
  const [dirContent, setDirContent] = useState<DirectoryRecord | null>(null);
  // const [asset, setAsset] = useState<AssetEntity | null>(null)
  const engine = useEngine();

  if (!engine) {
    return <div>Loading Engine...</div>; // Prevents crash if engine is still initializing
  }

  function getUnmatchedStrings(
    strings: string[],
    assets: AssetEntity[],
  ): string[] {
    const assetPaths = new Set(
      assets.map((asset) => asset.path).filter(Boolean) as string[],
    );
    return strings.filter((str) => !assetPaths.has(str));
  }

  async function processPaths(unique: string[]) {
    const texturePath = "/textures/PolygonDarkFantasy_Texture_02_A.png";
    for (const assetPath of unique) {
      const asset: AssetEntity = {
        model: await loadFBX(assetPath, texturePath),
        path: assetPath,
        texturePath: texturePath,
      };
      engine?.current?.Assets?.value.push(asset);
    }
  }

  useEffect(() => {
    console.log(props.assetRecord);
    setCurrentDirectory("/static/fbx");
    // const targetAsset = props.assets?.value.filter((val) => {
    //   return val.path ===
    // })
    // setAsset();
  }, [props.assetRecord]);

  useEffect(() => {
    const fetchDir = async () => {
      console.log("setting path to" + currentDirectory);
      const result = await fetch(`/api/cd?path=${currentDirectory}`);
      const json = await result.json() as DirectoryRecord;
      setDirContent(json);

      // engine.testModel();
    };

    fetchDir();
  }, [currentDirectory]);

  useEffect(() => {
    if (dirContent) {
      const assetsToCheck: string[] = [];

      let split = currentDirectory?.split("/");
      let fixedDirectory: string = "";
      for (let i = 2; i < split!.length; i++) {
        fixedDirectory += split![i];
        fixedDirectory += "/";
      }

      // console.log(currentDirectory);
      // console.log(fixedDirectory);

      Object.entries(dirContent).map(([name, type]) => (
        // console.log(`${currentDirectory}/${name}`)
        type === "file" ? assetsToCheck.push(`${fixedDirectory}/${name}`) : ""
      ));

      const unique = getUnmatchedStrings(
        assetsToCheck,
        engine.current?.Assets?.value ?? [],
      );
      processPaths(unique);
    }
  }, [dirContent]);

  const renderListBrowser = () => {
    return (
      <>
        <h2>Current Directory: {currentDirectory}</h2>
        {currentDirectory !== "/fbx" && (
          <button
            onClick={() =>
              setCurrentDirectory(
                currentDirectory?.substring(
                  0,
                  currentDirectory.lastIndexOf("/"),
                ) || "/fbx",
              )}
          >
            🔙 Go Back
          </button>
        )}
        <ul>
          {dirContent &&
            Object.entries(dirContent).map(([name, type]) => (
              <li key={name}>
                {type === "folder"
                  ? (
                    <button
                      onClick={() =>
                        setCurrentDirectory(`${currentDirectory}/${name}`)}
                    >
                      📁 {name}
                    </button>
                  )
                  : <>📄 {name}</>}
              </li>
            ))}
        </ul>
      </>
    );
  };

  const renderGridBrowser = () => {
    return (
      <>
        <div style={dirContentStyle}>
          <FileButtonComponent
            redirectTo={currentDirectory?.substring(
              0,
              currentDirectory.lastIndexOf("/"),
            ) || "/fbx"}
            name="Back"
            type="folder"
            setCurrentDirectory={setCurrentDirectory}
            isBackButton={true}
          />
          {dirContent &&
            Object.entries(dirContent).map(([name, type]) => (
              <FileButtonComponent
                type={type}
                redirectTo={`${currentDirectory}/${name}`}
                name={name}
                setCurrentDirectory={setCurrentDirectory}
              />
            ))}
        </div>
      </>
    );
  };

  return (
    <div style={panelStyle}>
      {renderGridBrowser()}
    </div>
  );
}
