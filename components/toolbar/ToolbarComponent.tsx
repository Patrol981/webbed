import { JSX } from "preact";
import ToolbarItemComponent from "./ToolbarItemComponent.tsx";

const windowStyle: JSX.CSSProperties = {
  display: "flex",
  marginLeft: "15em",
  flexDirection: "row",
  width: "100%",
  height: "fit-content",
  zIndex: 15,
};

export default function ToolbarComponent() {
  return (
    <div style={windowStyle}>
      <ToolbarItemComponent img="open.svg" name="Open" />
      <ToolbarItemComponent img="save.svg" name="Save" />
      <ToolbarItemComponent img="compose.svg" name="Compose" />
    </div>
  );
}
