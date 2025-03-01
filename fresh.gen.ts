// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_404 from "./routes/_404.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $api_cd from "./routes/api/cd.ts";
import * as $api_get_dir_structure from "./routes/api/get-dir-structure.ts";
import * as $api_joke from "./routes/api/joke.ts";
import * as $greet_name_ from "./routes/greet/[name].tsx";
import * as $index from "./routes/index.tsx";
import * as $EngineIsland from "./islands/EngineIsland.tsx";
import * as $UserSettingsIsland from "./islands/UserSettingsIsland.tsx";
import type { Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/_404.tsx": $_404,
    "./routes/_app.tsx": $_app,
    "./routes/api/cd.ts": $api_cd,
    "./routes/api/get-dir-structure.ts": $api_get_dir_structure,
    "./routes/api/joke.ts": $api_joke,
    "./routes/greet/[name].tsx": $greet_name_,
    "./routes/index.tsx": $index,
  },
  islands: {
    "./islands/EngineIsland.tsx": $EngineIsland,
    "./islands/UserSettingsIsland.tsx": $UserSettingsIsland,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
