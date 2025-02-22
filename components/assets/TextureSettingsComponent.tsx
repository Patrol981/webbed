import { JSX } from "preact";

const windowStyle: JSX.CSSProperties = {};

const textureOptionWindowStyle: JSX.CSSProperties = {};

export default function TextureSettingsComponent() {
  return (
    <div style={windowStyle}>
      <div style={textureOptionWindowStyle}>
        <p>Current Character Texture</p>
        <img src="" alt="" />
      </div>
      <div style={textureOptionWindowStyle}>
        <p>Current Building Texture</p>
        <img src="" alt="" />
      </div>
    </div>
  );
}
