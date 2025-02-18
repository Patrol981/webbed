import { Handlers } from "$fresh/server.ts";
import { join } from "$std/path/join.ts";
import { DirectoryRecord } from "../../lib/three/models/asset-entity.ts";

async function getDirectoryContents(
  dir: string,
): Promise<DirectoryRecord | unknown> {
  const result: DirectoryRecord = {};

  try {
    for await (const entry of Deno.readDir(dir)) {
      result[entry.name] = entry.isDirectory ? "folder" : "file";
    }
  } catch (error) {
    return { error: error };
  }

  return result;
}

export const handler: Handlers = {
  async GET(req) {
    const url = new URL(req.url);
    const targetDir = join(
      Deno.cwd(),
      url.searchParams.get("path") || "/static/fbx",
    );

    const contents = await getDirectoryContents(targetDir);
    return new Response(JSON.stringify(contents, null, 2), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
