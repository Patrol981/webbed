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
  width: "100%",
  height: "15rem",
  backgroundColor: "rgba(35, 35, 35, 1)",
  alignSelf: "flex-end",
  zIndex: 15,
  pointerEvents: "all",
};

const dirContentStyle: JSX.CSSProperties = {
  position: "relative",
  width: "100%",
  height: "100%",
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
  const engine = useEngine();

  useEffect(() => {
    setCurrentDirectory("/static/fbx");
  }, [props.assetRecord]);

  useEffect(() => {
    const fetchDir = async () => {
      const result = await fetch(`/api/cd?path=${currentDirectory}`);
      const json = await result.json() as DirectoryRecord;
      setDirContent(json);
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

      Object.entries(dirContent).map(([name, type]) => (
        type === "file" ? assetsToCheck.push(`${fixedDirectory}/${name}`) : ""
      ));

      const unique = getUnmatchedStrings(
        assetsToCheck,
        engine?.current?.Assets?.value ?? [],
      );
      processPaths(unique);
    }
  }, [dirContent]);

  if (!engine) {
    return <div>Loading Engine...</div>;
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
    const result = await fetch(`/api/cd?path=/static/textures`);
    const json = await result.json() as DirectoryRecord;
    const paths: string[] = [];
    Object.entries(json).map(([name, type]) => {
      paths.push(name);
    });

    for (const assetPath of unique) {
      const asset: AssetEntity = {
        model: await loadFBX(
          assetPath,
          "/textures",
          paths,
          texturePath,
        ),
        path: assetPath,
        texturePath: texturePath,
      };
      engine?.current?.Assets?.value.push(asset);
    }
  }

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
