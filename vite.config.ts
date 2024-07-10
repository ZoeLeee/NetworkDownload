import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		watch: {
			exclude: ["src/background.ts"],
		},
		emptyOutDir: process.env.CLEAR === "true",
		minify: false,
		rollupOptions: {
			output: {
				entryFileNames: (info) => {
					return "assets/[name].js";
				}, // 输出文件名配置
			},
		},
	},
	plugins: [
		react(),
		{
			name: "transform-remote-to-local-urls", // 插件名称
			enforce: "post", // 确保在代码转换后运行此插件
			transform(code) {
				// 修改正则表达式以匹配任何主机名下的 .js URL
				const remoteUrlPattern = /https?:\/\/[^\/]+(\/.+?\.js")/g;
				const localUrlReplacement = "$1"; // 用捕获组替换，即匹配的本地路径

				// 替换代码中的远程 URL
				const transformedCode = code.replace(
					remoteUrlPattern,
					localUrlReplacement,
				);

				return {
					code: transformedCode,
					map: null, // 如果不处理 source map，可以返回 null
				};
			},
		},
	],
});
