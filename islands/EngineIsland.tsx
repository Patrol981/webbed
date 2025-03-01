import {
  MutableRef,
  Ref,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "preact/hooks";
import { Engine } from "../lib/three/engine.ts";
import { createContext, JSX } from "preact";
import { AssetsComponent } from "../components/assets/AssetsComponent.tsx";
import { AssetRecord } from "../lib/three/models/asset-entity.ts";
import { UserSettingsProvider } from "./UserSettingsIsland.tsx";
import TextureSettingsComponent from "../components/texture-settings/TextureSettingsComponent.tsx";
import TextureListComponent from "../components/texture-settings/TextureListComponent.tsx";
import FlexComponent from "../components/layout/FlexComponent.tsx";
import ToolbarComponent from "../components/toolbar/ToolbarComponent.tsx";
import GridComponent from "../components/layout/GridComponent.tsx";
import FlexboxComponent from "../components/layout/FlexboxComponent.tsx";
import HierarchyListComponent from "../components/hierarchy/HierarchyListComponent.tsx";

interface Props {
  cnv: Ref<HTMLCanvasElement>;
}

const EngineContext = createContext<MutableRef<Engine | null> | null>(null);

export const useEngine = () => {
  const context = useContext(EngineContext);
  return context;
};

const canvasStyle: JSX.CSSProperties = {
  width: "1000px",
  height: "100px",
  background: "#474747",
};

export function EngineProvider(
  { cnv, children }: Props & { children: JSX.Element },
) {
  const engineRef = useRef<Engine | null>(null);

  async function run() {
    if (engineRef.current) {
      requestAnimationFrame(run);
      await engineRef.current.render();
    }
  }

  useLayoutEffect(() => {
    const initEngine = async () => {
      if (cnv.current) {
        const e = new Engine();
        e.initEngine(cnv.current);
        engineRef.current = e;
        await run();
      }
    };

    initEngine();
  }, [cnv.current]);

  return (
    <EngineContext.Provider value={engineRef}>
      {children}
    </EngineContext.Provider>
  );
}

export default function EngineIsland() {
  const [directories, setDir] = useState<AssetRecord | undefined>(undefined);
  const cnv: Ref<HTMLCanvasElement> = useRef(null);

  useEffect(() => {
    const loadDirs = async () => {
      const result = await fetch("/api/get-dir-structure");
      const json = await result.json() as AssetRecord;
      setDir(json);
    };

    loadDirs();
  }, []);
  // <TextureSettingsComponent />

  return (
    <EngineProvider cnv={cnv}>
      <UserSettingsProvider>
        <FlexboxComponent>
          <ToolbarComponent />
          <HierarchyListComponent />
          <canvas style={canvasStyle} ref={cnv}></canvas>
          <TextureListComponent />
          <AssetsComponent assetRecord={directories} />
        </FlexboxComponent>
      </UserSettingsProvider>
    </EngineProvider>
  );
}
