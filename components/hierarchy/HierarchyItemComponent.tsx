import { JSX } from "preact";
import { HierarchyItem } from "../../lib/three/models/hierarchy-item.ts";

const windowStyle: JSX.CSSProperties = {
  margin: 0,
  paddingRight: "1em",
  paddingLeft: "1em",
  marginBottom: "0.5em",
  marginTop: "0.5em",
  display: "inline",
  background: "royalblue",
};

const pStyle: JSX.CSSProperties = {
  whiteSpace: "nowrap",
};

export default function HierarchyItemComponent(
  props: { hierarchyItem: HierarchyItem },
) {
  return (
    <div style={windowStyle}>
      <p style={pStyle}>
        [{props.hierarchyItem.refId}] - {props.hierarchyItem.refName.length > 0
          ? props.hierarchyItem.refName
          : "No Name "}
        ({props.hierarchyItem.refType})
      </p>
    </div>
  );
}
