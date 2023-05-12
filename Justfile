alias d := dev

dev:
  rm -rf target/debug/db.*
  pnpm run tauri dev
