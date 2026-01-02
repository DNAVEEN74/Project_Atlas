/**
 * Image Compression Utility
 * Compresses images before upload using browser Canvas API
 */

interface CompressionOptions {
    /** Max width in pixels (default: 1200) */
    maxWidth?: number;
    /** Max height in pixels (default: 1200) */
    maxHeight?: number;
    /** Quality 0-1 for JPEG/WebP (default: 0.8) */
    quality?: number;
    /** Output format (default: 'webp' for best compression) */
    format?: 'webp' | 'jpeg' | 'png';
}

/**
 * Compress image file before upload
 * Reduces file size significantly while maintaining quality
 */
export async function compressImage(
    file: File,
    options: CompressionOptions = {}
): Promise<File> {
    const {
        maxWidth = 1200,
        maxHeight = 1200,
        quality = 0.8,
        format = 'webp'
    } = options;

    return new Promise((resolve, reject) => {
        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            reject(new Error('Canvas not supported'));
            return;
        }

        img.onload = () => {
            // Calculate new dimensions maintaining aspect ratio
            let { width, height } = img;

            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }
            if (height > maxHeight) {
                width = (width * maxHeight) / height;
                height = maxHeight;
            }

            // Set canvas size and draw
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            // Convert to blob
            const mimeType = format === 'png' ? 'image/png' :
                format === 'jpeg' ? 'image/jpeg' : 'image/webp';

            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        reject(new Error('Compression failed'));
                        return;
                    }

                    // Create new file with compressed data
                    const ext = format === 'jpeg' ? 'jpg' : format;
                    const fileName = file.name.replace(/\.[^.]+$/, `.${ext}`);
                    const compressedFile = new File([blob], fileName, { type: mimeType });

                    console.log(`Compressed: ${(file.size / 1024).toFixed(1)}KB → ${(compressedFile.size / 1024).toFixed(1)}KB`);
                    resolve(compressedFile);
                },
                mimeType,
                quality
            );
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = URL.createObjectURL(file);
    });
}

/**
 * Get file size in human readable format
 */
export function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}
