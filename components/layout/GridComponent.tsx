import { JSX } from "preact";

const style: JSX.CSSProperties = {
  width: "100vw",
  height: "100vh",
  left: 0,
  top: 0,
  display: "grid",
  position: "absolute",
  gridTemplateColumns: "1fr 1fr",
};

export default function GridComponent(
  { children }: { children: JSX.Element | JSX.Element[] },
) {
  return (
    <div style={style}>
      {children}
    </div>
  );
}
