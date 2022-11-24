use cssparser::{Color, Parser, ParserInput};

pub struct CSSColor {
    pub r: u8,
    pub g: u8,
    pub b: u8,
    pub a: u8
}

pub fn parse_color(color: String) -> CSSColor {
    let color_str = color.as_str();
    let mut parser_input = ParserInput::new(color_str);
    let mut parser = Parser::new(&mut parser_input);
    let css_color = Color::parse(&mut parser);

    let dt_color = match css_color {
      Ok(Color::CurrentColor) => CSSColor { r: 0xff, g: 0xff, b: 0xff, a: 0xff },
      Ok(Color::RGBA(c)) => CSSColor { r: c.red, g: c.green, b: c.blue, a: c.alpha },
      Err(_e) => CSSColor { r: 0xff, g: 0xff, b: 0xff, a: 0xff }
    };

    dt_color
}