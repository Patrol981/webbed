import { MutableRef, useContext, useEffect, useRef } from "preact/hooks";
import { createContext, JSX } from "preact";
import { UserSettings } from "../lib/user/user-settings.ts";

const UserSettingsContext = createContext<
  MutableRef<UserSettings | null> | null
>(null);

export const useUserSettings = () => {
  return useContext(UserSettingsContext);
};

export function UserSettingsProvider(
  { children }: { children: JSX.Element[] },
) {
  const userSettingsRef = useRef<UserSettings | null>(null);

  useEffect(() => {
    userSettingsRef.current = {
      defaultModelTexturePath: "/textures/PolygonDarkFantasy_Texture_02_A.png",
      defaultBuildingTexturePath:
        "/textures/PolygonDarkFantasy_Texture_02_A.png",
    };
  });

  return (
    <UserSettingsContext.Provider value={userSettingsRef}>
      {children}
    </UserSettingsContext.Provider>
  );
}
