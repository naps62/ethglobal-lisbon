alias d := dev

dev:
  rm -rf target/debug/db.*
  yarn run tauri dev
