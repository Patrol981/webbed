import { JSX } from "preact";

interface Props {
  name: string;
  imgPath: string | undefined;
}

const textureOptionWindowStyle: JSX.CSSProperties = {
  display: "flex",
  verticalAlign: "middle",
  height: "fit-content",
  width: "100%",
  color: "white",
  padding: "1em",
};

const imageStyle: JSX.CSSProperties = {
  height: "90%",
  border: "2px solid rgb(35,35,35)",
  borderRadius: "24px",
  maxHeight: "15em",
  width: "auto",
};

const pStyle: JSX.CSSProperties = {
  marginTop: "auto",
  marginBottom: "auto",
  marginRight: "auto",
  verticalAlign: "middle",
  paddingRight: "1em",
  paddingLeft: "1em",
  textAlign: "left",
};

export default function TextureSettingsItemComponent(props: Props) {
  return (
    <div style={textureOptionWindowStyle}>
      <p style={pStyle}>{props.name}</p>
      <img
        style={imageStyle}
        src={props.imgPath}
        alt=""
      />
    </div>
  );
}
