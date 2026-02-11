const ASCII_RAMP = ' .,:;+*?%S#@!$%^&(-_=+`~#"';
const BRIGHTNESS_CUTOFF = 130;
const CONTRAST_GAMMA = 3.0;

let offscreen = null;
let ctx = null;
let currentCols = 0;
let currentRows = 0;

self.onmessage = (e) => {
  const { type } = e.data;

  if (type === "init") {
    // Set up the offscreen sampling canvas
    const { cols, rows } = e.data;
    currentCols = cols;
    currentRows = rows;
    offscreen = new OffscreenCanvas(cols, rows);
    ctx = offscreen.getContext("2d", { willReadFrequently: true });
    return;
  }

  if (type === "resize") {
    const { cols, rows } = e.data;
    currentCols = cols;
    currentRows = rows;
    if (offscreen) {
      offscreen.width = cols;
      offscreen.height = rows;
    }
    return;
  }

  if (type === "frame") {
    const { bitmap } = e.data;
    if (!ctx || !offscreen) {
      bitmap.close();
      return;
    }

    const cols = currentCols;
    const rows = currentRows;

    // Draw the video frame scaled down to cols×rows
    ctx.drawImage(bitmap, 0, 0, cols, rows);
    bitmap.close(); // release the transferred bitmap

    const imageData = ctx.getImageData(0, 0, cols, rows);
    const { data } = imageData;
    const rampLen = ASCII_RAMP.length - 1;

    // Build a flat grid of character indices (0 = space / skip, 1+ = ramp index)
    // Using Uint8Array for efficient transfer
    const grid = new Uint8Array(cols * rows);

    for (let y = 0; y < rows; y++) {
      const yOffset = y * cols * 4;
      const rowOffset = y * cols;
      for (let x = 0; x < cols; x++) {
        const idx = yOffset + x * 4;
        const luminance =
          0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];

        if (luminance < BRIGHTNESS_CUTOFF) {
          const norm = 1 - luminance / BRIGHTNESS_CUTOFF;
          const curved = Math.pow(norm, CONTRAST_GAMMA);
          // Store ramp index + 1 so 0 means "space / skip"
          grid[rowOffset + x] =
            Math.min(Math.floor(curved * rampLen), rampLen) + 1;
        }
        // else grid value stays 0 (space)
      }
    }

    // Transfer the buffer back (zero-copy)
    self.postMessage({ type: "grid", grid, cols, rows }, [grid.buffer]);
  }
};
