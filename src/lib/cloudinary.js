/**
 * Cloudinary configuration constants
 * Used for direct unsigned uploads to Cloudinary
 */

export const CLOUDINARY_CLOUD_NAME = "dmxpshi9o";
export const CLOUDINARY_UPLOAD_PRESET = "nature-view-upload";

/**
 * Cloudinary delivery cloud name (for optimized delivery URLs)
 * This is the cloud name used for serving optimized images
 */
export const CLOUDINARY_DELIVERY_CLOUD_NAME = "dkhhjhpbc";

/**
 * Cloudinary upload API endpoint
 */
export const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;

/**
 * Cloudinary delivery URL base
 */
export const CLOUDINARY_DELIVERY_URL = `https://res.cloudinary.com/${CLOUDINARY_DELIVERY_CLOUD_NAME}/image/upload`;

/**
 * Extract public ID from a Cloudinary URL
 */
export function extractPublicId(url)| null {
  if (!url) return null;
  
  // Match patterns like:
  // https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/public_id.jpg
  // https://res.cloudinary.com/cloud_name/image/upload/folder/public_id.jpg
  const match = url.match(/\/upload\/(?\d+\/)?(.+?)(?:\.[^.]+)?$/);
  if (match) {
    return match[1];
  }
  return null;
}

/**
 * Get optimized Cloudinary URL with transformation parameters
 */
export function getOptimizedCloudinaryUrl(
  publicId
  options: {
    width?;
    height?;
    crop?;
    quality?| number;
    format?;
    gravity?;
  } = {}
){
  const {
    width,
    height,
    crop = "fill",
    quality = "auto",
    format = "auto",
    gravity = "auto",
  } = options;

  const transformations = [];
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (crop) transformations.push(`c_${crop}`);
  if (quality) transformations.push(`q_${quality}`);
  if (format) transformations.push(`f_${format}`);
  if (gravity) transformations.push(`g_${gravity}`);

  const transformationString = transformations.join(",");
  return `${CLOUDINARY_DELIVERY_URL}/${transformationString}/${publicId}`;
}

/**
 * Get responsive Cloudinary URLs for different breakpoints
 */
export function getResponsiveCloudinaryUrls(
  publicId
  options: {
    widths[];
    aspectRatio?;
    crop?;
    quality?| number;
    format?;
  }
): { width; url}[] {
  const { widths, aspectRatio, crop = "fill", quality = "auto", format = "auto" } = options;

  return widths.map((width) => {
    let height| undefined;
    if (aspectRatio) {
      const [w, h] = aspectRatio.split(":").map(Number);
      if (w && h) {
        height = Math.round((width * h) / w);
      }
    }
    return {
      width,
      url(publicId, { width, height, crop, quality, format }),
    };
  });
}

/**
 * Cloudinary transformation presets for common use cases
 */
export const CLOUDINARY_PRESETS = {
  // Hero/banner images - 21:9 aspect ratio, 1920px wide
  hero: {
    width: 1920,
    aspectRatio: "21:9",
    crop: "fill",
    quality: "auto",
    format: "auto",
  },
  // Card images - 4:3 aspect ratio, 600px wide
  card: {
    width: 600,
    aspectRatio: "4:3",
    crop: "fill",
    quality: "auto",
    format: "auto",
  },
  // Gallery images - 16:9 aspect ratio, 800px wide
  gallery: {
    width: 800,
    aspectRatio: "16:9",
    crop: "fill",
    quality: "auto",
    format: "auto",
  },
  // Thumbnail - 1:1 aspect ratio, 200px wide
  thumbnail: {
    width: 200,
    aspectRatio: "1:1",
    crop: "fill",
    quality: "auto",
    format: "auto",
  },
  // Avatar/profile - 1:1 aspect ratio, 150px wide
  avatar: {
    width: 150,
    aspectRatio: "1:1",
    crop: "fill",
    quality: "auto",
    format: "auto",
  },
  // Open Graph / social sharing - 1.91:1 aspect ratio, 1200px wide
  og: {
    width: 1200,
    aspectRatio: "1.91:1",
    crop: "fill",
    quality: "auto",
    format: "auto",
  },
};

/**
 * Get Cloudinary URL with a preset
 */
export function getCloudinaryUrlWithPreset(
  publicId
  preset
){
  const presetOptions = CLOUDINARY_PRESETS[preset];
  return getOptimizedCloudinaryUrl(publicId, presetOptions);
}
