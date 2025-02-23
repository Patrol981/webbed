import { JSX } from "preact";
import { useUserSettings } from "../../islands/UserSettingsIsland.tsx";
import TextureSettingsItemComponent from "./TextureSettingsItemComponent.tsx";

const windowStyle: JSX.CSSProperties = {
  position: "absolute",
  top: "25%",
  left: "50%",
  transform: "translate(-50%, -25%)",
  display: "flex",
  flexDirection: "column",
  verticalAlign: "middle",
  justifyContent: "center",
  alignItems: "center",
  background: "rgba(35,35,35,0.7)",
  height: "max-content",
  width: "30vw",
  borderRadius: "24px",
  userSelect: "none",
};

export default function TextureSettingsComponent() {
  const userSettings = useUserSettings();

  return (
    <div style={windowStyle}>
      <TextureSettingsItemComponent
        imgPath={userSettings?.current?.defaultModelTexturePath}
        name="Current Character Texture"
      />
      <TextureSettingsItemComponent
        imgPath={userSettings?.current?.defaultBuildingTexturePath}
        name="Current Building Texture"
      />
    </div>
  );
}
