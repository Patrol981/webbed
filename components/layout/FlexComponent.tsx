import { JSX } from "preact";

const style: JSX.CSSProperties = {
  width: "100vw",
  height: "100vh",
  left: 0,
  top: 0,
  display: "flex",
  flexDirection: "column", // ToolbarComponent is on top
  position: "absolute",
  pointerEvents: "none",
};

const contentStyle: JSX.CSSProperties = {
  display: "flex",
  flex: 1, // Takes up remaining space below toolbar
  width: "100%",
  position: "relative",
};

export default function FlexComponent(
  { children }: { children: JSX.Element | JSX.Element[] },
) {
  return (
    <div style={style}>
      {children[0] /* ToolbarComponent */}
      <div style={contentStyle}>
        {children.slice(1) /* Other components */}
      </div>
    </div>
  );
}
