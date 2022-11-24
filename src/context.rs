use raqote::{DrawOptions, DrawTarget, SolidSource, Source, PathBuilder, StrokeStyle, LineCap, LineJoin};

#[path = "./utils.rs"]
mod utils;

#[napi(js_name = "DrawContext")]
pub struct DrawContext {
  engine: DrawTarget,
  canvas_fill_style: String,
  canvas_stroke_style: String,
}

#[napi]
impl DrawContext {
  #[napi(constructor)]
  pub fn new(width: i32, height: i32) -> Self {
    DrawContext {
      engine: DrawTarget::new(width, height),
      canvas_fill_style: "#000000".to_string(),
      canvas_stroke_style: "#000000".to_string(),
    }
  }

  #[napi(getter)]
  pub fn width(&self) -> napi::Result<i32> {
    Ok(self.engine.width())
  }

  #[napi(getter)]
  pub fn height(&self) -> napi::Result<i32> {
    Ok(self.engine.height())
  }

  #[napi(setter)]
  pub fn set_fill_style(&mut self, color: Option<String>) {
    if color == None {
      self.canvas_fill_style = "#000000".to_string();
    } else {
      self.canvas_fill_style = color.expect("need color");
    }
  }

  #[napi(getter)]
  pub fn get_fill_style(&self) -> napi::Result<String> {
    let color = &self.canvas_fill_style;
    Ok(color.to_string())
  }

  #[napi(setter)]
  pub fn set_stroke_style(&mut self, color: Option<String>) {
    if color == None {
      self.canvas_stroke_style = "#000000".to_string();
    } else {
      self.canvas_stroke_style = color.expect("need color");
    }
  }

  #[napi(getter)]
  pub fn get_stroke_style(&self) -> napi::Result<String> {
    let color = &self.canvas_stroke_style;
    Ok(color.to_string())
  }

  #[napi]
  pub fn fill_rect(&mut self, x: i32, y: i32, width: i32, height: i32) -> napi::Result<()> {
    let col = &self.canvas_fill_style;
    let color = utils::parse_color(col.to_string());

    self.engine.fill_rect(
      x as f32,
      y as f32,
      width as f32,
      height as f32,
      &Source::Solid(SolidSource {
        // is this a bug?
        r: color.b,
        g: color.g,
        b: color.r,
        a: color.a,
      }),
      &DrawOptions::new(),
    );
    Ok(())
  }

  #[napi]
  pub fn stroke_rect(&mut self, x: i32, y: i32, width: i32, height: i32) -> napi::Result<()> {
    let col = &self.canvas_stroke_style;
    let color = utils::parse_color(col.to_string());

    let mut pb = PathBuilder::new();
    pb.rect(x as f32, y as f32, width as f32, height as f32);
    let path = pb.finish();

    self.engine.stroke(
      &path,
      &Source::Solid(SolidSource {
        // is this a bug?
        r: color.b,
        g: color.g,
        b: color.r,
        a: color.a,
      }),
      &StrokeStyle {
        cap: LineCap::Round,
        join: LineJoin::Round,
        width: 10.,
        ..StrokeStyle::default()
    },
      &DrawOptions::new(),
    );
    Ok(())
  }

  #[napi]
  pub fn get_buffer(&self) -> napi::Result<Vec<u8>> {
    Ok(self.engine.get_data_u8().to_vec())
  }
}
