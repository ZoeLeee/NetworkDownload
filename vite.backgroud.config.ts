import { defineConfig } from "vite";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		// watch: {
		// 	include: ["src/background.ts"],
		// },
		emptyOutDir: false,
		minify: false,
		rollupOptions: {
			input: {
				background: resolve(__dirname, "src/background.ts"),
			},
			output: {
				entryFileNames: (info) => {
					return "background.js";
				}, // 输出文件名配置
				inlineDynamicImports: true,
			},
		},
	},
});
