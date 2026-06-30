import { execSync } from "child_process";

try {
  console.log("🚀 Starting build process...");
  
  console.log("📦 Running: vite build");
  execSync("npx vite build", { stdio: "inherit" });

  if (process.env.VERCEL) {
    console.log("✨ Vercel environment detected. Skipping Express server bundle.");
  } else {
    console.log("⚙️ Bundling Express server using esbuild...");
    execSync("npx esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs", { stdio: "inherit" });
    console.log("✅ Express server bundled successfully.");
  }
  
  console.log("🎉 Build completed successfully!");
} catch (error) {
  console.error("❌ Build failed:", error);
  process.exit(1);
}
