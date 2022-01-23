const SELECT_LUMA_THRESHOLD = 0.5;

export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

export function calculateAccentColor(rgbArr) {
  try {
    if (verifyRGBArray(rgbArr)) {
      const luminanceValue =
        (rgbArr[0] * 0.2126 + rgbArr[1] * 0.7152 + rgbArr[2] * 0.0722) / 255;
      return `hsl(0, 0%, calc((${luminanceValue} - ${SELECT_LUMA_THRESHOLD}) * -10000000%))`;
    } else {
      console.error("Not a valid rgbArr");
      return null;
    }
  } catch (e) {
    console.error("There was an error creating the accent color");
  }
  return null;
}

function verifyRGBArray(rgbArr) {
  if (rgbArr.length === 3) {
    return rgbArr.every((v) => v > -1 && v < 256);
  }
  return false;
}
