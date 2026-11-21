// Center-crop any image (File or URL) to a 1200×630 PNG for link previews.
export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load image"));
    img.src = src;
  });
}

export async function cropToOgFile(source, name = "og-image-1200x630.png") {
  const src = typeof source === "string" ? source : URL.createObjectURL(source);
  const img = await loadImage(src);
  if (typeof source !== "string") URL.revokeObjectURL(src);
  const scale = Math.max(OG_WIDTH / img.width, OG_HEIGHT / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  const canvas = document.createElement("canvas");
  canvas.width = OG_WIDTH;
  canvas.height = OG_HEIGHT;
  canvas.getContext("2d").drawImage(img, (OG_WIDTH - w) / 2, (OG_HEIGHT - h) / 2, w, h);
  const blob = await new Promise((r) => canvas.toBlob(r, "image/png"));
  return new File([blob], name, { type: "image/png" });
}