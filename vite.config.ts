import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({ plugins: [react()], base: "/swtor-ops-guide/", build: { outDir: "dist", sourcemap: false } });
