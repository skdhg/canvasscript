#![deny(clippy::all)]

use raqote::{ DrawTarget, DrawOptions, Color, Source, SolidSource };
use cssparser::{Color as CSSColor, Parser, ParserInput};

#[macro_use]
extern crate napi_derive;

#[napi(js_name = "JSDrawTarget")]
pub struct JSDrawTarget {
  engine: DrawTarget,
}

#[napi]
impl JSDrawTarget {
  #[napi(constructor)]
  pub fn new(width: i32, height: i32) -> Self {
    JSDrawTarget { engine: DrawTarget::new(width, height) }
  }

  #[napi(getter)]
  pub fn width(&self) -> napi::Result<i32> {
    Ok(self.engine.width())
  }

  #[napi(getter)]
  pub fn height(&self) -> napi::Result<i32> {
    Ok(self.engine.height())
  }

  #[napi]
  pub fn fill_rect(&mut self, x: i32, y: i32, width: i32, height: i32, color: String) -> napi::Result<()> {
    let color_str = color.as_str();
    let mut parser_input = ParserInput::new(color_str);
    let mut parser = Parser::new(&mut parser_input);
    let css_color = CSSColor::parse(&mut parser).map_err(|e| {
      napi::Error::new(
        napi::Status::InvalidArg,
        format!("Error parsing color [{}] error: {:?}", color_str, e),
      )
    })?;

    let dt_color = match css_color {
      CSSColor::CurrentColor => Color::new(0, 0, 0, 0),
      CSSColor::RGBA(rgba) => Color::new(rgba.alpha, rgba.red, rgba.green, rgba.blue),
    };

    self.engine.fill_rect(x as f32, y as f32, width as f32, height as f32, &Source::Solid(SolidSource {
      // is this a bug?
      r: dt_color.b(),
      g: dt_color.g(),
      b: dt_color.r(),
      a: dt_color.a(),
    }), &DrawOptions::new());
    Ok(())
  }

  #[napi]
  pub fn get_buffer(&self) -> napi::Result<Vec<u8>> {
    Ok(self.engine.get_data_u8().to_vec())
  }
}
