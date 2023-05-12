alias d := dev

dev:
  rm -rf target/debug/db.*
  RUST_LOG=ethglobal-lisbon=debug pnpm run tauri dev
  pnpm run tauri dev
