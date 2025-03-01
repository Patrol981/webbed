import { JSX } from "preact";

const wrapperStyle: JSX.CSSProperties = {
  display: "grid",
  flexFlow: "column",
  gridTemplateColumns: "1fr",
  gridTemplateRows: "1fr auto",
  left: 0,
  top: 0,
  height: "100vh",
  width: "100vw",
  position: "absolute",
};

const headerStyle: JSX.CSSProperties = {
  position: "fixed",
  width: "87.5%",
  height: "fit-content",
  left: 0,
  top: 0,
  zIndex: 15,
};

const mainStyle: JSX.CSSProperties = {
  width: "100%",
  height: "auto",
  gridTemplateRows: "1fr",
  gridTemplateColumns: "auto 1fr auto",
  display: "grid",
};

const contentStyle: JSX.CSSProperties = {
  height: "100%",
  maxHeight: "100%",
};

const asideStyle: JSX.CSSProperties = {
  position: "relative",
  height: "100%",
  maxHeight: "100%",
};

export default function FlexboxComponent(
  { children }: { children: JSX.Element[] },
) {
  const [header, asideLeft, main, asideRight, footer] = children;

  return (
    <>
      <header style={headerStyle}>{header}</header>
      <div style={wrapperStyle}>
        <div style={mainStyle}>
          <div style={asideStyle}>{asideLeft}</div>
          <div id="content-id-hook" style={contentStyle}>{main}</div>
          <div style={asideStyle}>{asideRight}</div>
        </div>
        <div>{footer}</div>
      </div>
    </>
  );
}
