import imagemin from "imagemin";
import jpg from "imagemin-jpegtran";
import png from "imagemin-optipng";
import webp from "imagemin-webp";
import gif from "imagemin-gifsicle";

const minify = async (buf) =>
  Buffer.from(
    await imagemin.buffer(buf, {
      plugins: [
        jpg({ progressive: true }),
        png({ optimizationLevel: 1 }),
        webp(),
        gif(),
      ],
    }),
  );

export default minify;
