import { FreshContext, Handlers } from "$fresh/server.ts";
import { join } from "$std/path/join.ts";

async function getFileStructure(dir: string): Promise<Record<string, unknown>> {
  const result: Record<string, unknown> = {};

  for await (const entry of Deno.readDir(dir)) {
    const fullPath = `${dir}/${entry.name}`;
    if (entry.isDirectory) {
      result[entry.name] = await getFileStructure(fullPath); // Recurse into subdirectory
    } else {
      result[entry.name] = "file"; // Mark it as a file
    }
  }

  return result;
}

export const handler: Handlers = {
  GET: async (_req) => {
    try {
      const targetPath = join(Deno.cwd(), "/static/fbx");
      const fileStructure = await getFileStructure(targetPath);
      return new Response(JSON.stringify(fileStructure, null, 2), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};
