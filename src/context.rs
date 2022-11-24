use raqote::{
  DrawOptions, DrawTarget, PathBuilder, SolidSource, Source, StrokeStyle, LineJoin, LineCap,
};
use napi::{Result, bindgen_prelude::Buffer};

#[path = "./utils.rs"]
mod utils;

#[napi]
pub struct CanvasRenderingContext2D {
  engine: DrawTarget,
  canvas_fill_style: String,
  canvas_stroke_style: String,
  canvas_stroke_config: StrokeStyle,
}

#[napi]
impl CanvasRenderingContext2D {
  #[napi(constructor)]
  pub fn new(width: i32, height: i32) -> Self {
    CanvasRenderingContext2D {
      engine: DrawTarget::new(width, height),
      canvas_fill_style: "#000000".to_string(),
      canvas_stroke_style: "#000000".to_string(),
      canvas_stroke_config: StrokeStyle {
        width: 1.0,
        miter_limit: 10.0,
        join: LineJoin::Miter,
        cap: LineCap::Butt,
        dash_array: vec![],
        dash_offset: 0.0
      },
    }
  }

  #[napi(getter)]
  pub fn width(&self) -> Result<i32> {
    Ok(self.engine.width())
  }

  #[napi(getter)]
  pub fn height(&self) -> Result<i32> {
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
  pub fn get_fill_style(&self) -> Result<String> {
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
  pub fn get_stroke_style(&self) -> Result<String> {
    let color = &self.canvas_stroke_style;
    Ok(color.to_string())
  }

  #[napi]
  pub fn fill_rect(&mut self, x: i32, y: i32, width: i32, height: i32) {
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
  }

  #[napi]
  pub fn stroke_rect(&mut self, x: i32, y: i32, width: i32, height: i32) {
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
      &self.canvas_stroke_config,
      &DrawOptions::new(),
    );
  }

  #[napi(setter)]
  pub fn set_line_width(&mut self, val: f64) {
    self.canvas_stroke_config.width = val as f32;
  }

  #[napi(getter)]
  pub fn get_line_width(&self) -> f64 {
    self.canvas_stroke_config.width as f64
  }

  #[napi(js_name="__rq_surface_get_img_data_u8")]
  pub fn get_image_data_buffer(&self) -> Buffer {
    self.engine.get_data_u8().to_vec().into()
  }

  #[napi]
  pub fn set_line_dash(&mut self, dash_list: Vec<f64>) {
    let len = dash_list.len();
    let is_odd = len & 1 != 0;
    let mut line_dash_list = if is_odd {
      vec![0f32; len * 2]
    } else {
      vec![0f32; len]
    };
    for (idx, dash) in dash_list.iter().enumerate() {
      line_dash_list[idx] = *dash as f32;
      if is_odd {
        line_dash_list[idx + len] = *dash as f32;
      }
    }

    self.canvas_stroke_config.dash_array = line_dash_list;
  }

  #[napi]
  pub fn get_line_dash(&self) -> Vec<f64> {
    self.canvas_stroke_config.dash_array.iter().map(|i| *i as f64).collect()
  }
}
