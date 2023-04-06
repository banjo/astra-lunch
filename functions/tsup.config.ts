import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    splitting: false,
    sourcemap: false,
    clean: true,
    dts: false,
    format: ["cjs"],
    minify: true,
    target: "es2020",
    outDir: "lib",
});
