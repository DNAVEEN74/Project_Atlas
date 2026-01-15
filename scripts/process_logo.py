from PIL import Image, ImageDraw

def process_logo():
    input_path = "public/logo-final.png"
    output_path = "public/logo-final.png"
    
    try:
        img = Image.open(input_path).convert("RGBA")
        
        # 1. Flood fill from corners to make background transparent
        # We'll use ImageDraw.floodfill
        # Seed point (0,0)
        ImageDraw.floodfill(img, xy=(0, 0), value=(255, 255, 255, 0), thresh=50)
        
        # Also try other corners just in case connectivity is blocked
        w, h = img.size
        ImageDraw.floodfill(img, xy=(w-1, 0), value=(255, 255, 255, 0), thresh=50)
        ImageDraw.floodfill(img, xy=(0, h-1), value=(255, 255, 255, 0), thresh=50)
        ImageDraw.floodfill(img, xy=(w-1, h-1), value=(255, 255, 255, 0), thresh=50)

        # 2. Crop to bounding box (trim transparency)
        bbox = img.getbbox()
        if bbox:
            img = img.crop(bbox)
            print(f"Cropped to {bbox}")
        
        img.save(output_path)
        print("Successfully processed logo.")

    except Exception as e:
        print(f"Error processing logo: {e}")

if __name__ == "__main__":
    process_logo()
