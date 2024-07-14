import { defineConfig } from "vite";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		// watch: {
		// 	include: ["src/content.ts"],
		// },
		emptyOutDir: false,
		minify: false,
		rollupOptions: {
			input: {
				content: resolve(__dirname, "src/content.ts"),
			},
			output: {
				entryFileNames: (info) => {
					return "content.js";
				}, // 输出文件名配置
				inlineDynamicImports: true,
			},
		},
	},
});
