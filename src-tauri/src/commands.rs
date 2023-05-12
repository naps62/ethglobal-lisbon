use crate::context::Context;

type Ctx<'a> = tauri::State<'a, Context>;
type Result<T> = std::result::Result<T, String>;

impl From<crate::error::Error> for String {
    fn from(e: crate::error::Error) -> Self {
        e.to_string()
    }
}

#[tauri::command]
pub async fn hello(ctx: Ctx<'_>) -> Result<String> {
    let ctx = ctx.lock().await;

    Ok("hello".into())
}
