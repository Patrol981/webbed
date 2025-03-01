import { useState } from "preact/hooks";
import { JSX } from "preact";

interface Props {
  img: string;
  name: string;
}

const windowStyle: JSX.CSSProperties = {
  borderRadius: "24px",
  background: "rgb(35,35,35)",
  color: "white",
  height: "5em",
  width: "5em",
  margin: "0.25em",
  padding: "0.5em",
  cursor: "pointer",
};

const windowHover: JSX.CSSProperties = {
  background: "white",
  color: "rgb(35,35,35)",
};

const imgStyle: JSX.CSSProperties = {
  height: "100%",
  width: "auto",
  transition: ".2s all ease-in",
};

const imgStyleHover: JSX.CSSProperties = {
  filter: "invert(100%)",
};

export default function ToolbarItemComponent(props: Props) {
  const [hover, setHover] = useState(false);

  return (
    <div
      style={{ ...windowStyle, ...(hover ? windowHover : null) }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <img
        src={props.img}
        style={{ ...imgStyle, ...(hover ? imgStyleHover : null) }}
        alt=""
      />
    </div>
  );
}
