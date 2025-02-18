import {
  MutableRef,
  Ref,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "preact/hooks";
import { Signal, useSignal } from "@preact/signals";
import { Engine } from "../lib/three/engine.ts";
import { createContext, JSX } from "preact";
import { AssetsComponent } from "../components/assets/AssetsComponent.tsx";
import { AssetRecord } from "../lib/three/models/asset-entity.ts";

const EngineContext = createContext<MutableRef<Engine | null> | null>(null);

export const useEngine = () => {
  const context = useContext(EngineContext);
  return context;
};

const canvasStyle: JSX.CSSProperties = {
  height: "100vh",
  width: "100vw",
  background: "#474747",
  position: "fixed",
  left: 0,
  top: 0,
};

export function EngineProvider({ children }: { children: JSX.Element }) {
  const cnv: Ref<HTMLCanvasElement> = useRef(null);
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
      <canvas style={canvasStyle} ref={cnv}></canvas>
      {children}
    </EngineContext.Provider>
  );
}

export default function EngineIsland() {
  const [directories, setDir] = useState<AssetRecord | undefined>(undefined);

  useEffect(() => {
    const loadDirs = async () => {
      const result = await fetch("/api/get-dir-structure");
      const json = await result.json() as AssetRecord;
      setDir(json);
    };

    loadDirs();
  }, []);

  return (
    <EngineProvider>
      <AssetsComponent assetRecord={directories} />
    </EngineProvider>
  );
}
