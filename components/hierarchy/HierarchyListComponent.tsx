import { useEffect, useState } from "preact/hooks";
import { JSX } from "preact";
import { HierarchyItem } from "../../lib/three/models/hierarchy-item.ts";
import { useEngine } from "../../islands/EngineIsland.tsx";
import HierarchyItemComponent from "./HierarchyItemComponent.tsx";

const windowStyle: JSX.CSSProperties = {
  background: "#1d1d1d",
  color: "white",
  width: "15em",
  height: "100%",
  overflowX: "scroll",
  display: "flex",
  flexDirection: "column",
};

export default function HierarchyListComponent() {
  const engine = useEngine();

  const [items, setItems] = useState<HierarchyItem[]>([]);

  useEffect(() => {
    if (engine?.current) {
      setItems(engine.current.getHierarchy());
      console.log(items);
    }
    console.log("hierarchy reload");
  }, [engine?.current?.Scene.children]);

  return (
    <div style={windowStyle}>
      {Object.entries(items).map(([key, item]) => (
        <HierarchyItemComponent key={key} hierarchyItem={item} />
      ))}
    </div>
  );
}
