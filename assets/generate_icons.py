import os
from PIL import Image

def generate_icon(base_path, output_name, size, bg_color="#faf4e3", scale_factor=0.8):
    # Load original image
    logo = Image.open(base_path).convert("RGBA")
    
    # Calculate target dimensions
    target_size = (size, size)
    
    # Create background canvas
    canvas = Image.new("RGBA", target_size, bg_color)
    
    # Calculate scaled logo size
    logo_size = int(size * scale_factor)
    logo_resized = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
    
    # Calculate paste position (center)
    offset = ((size - logo_size) // 2, (size - logo_size) // 2)
    
    # Paste logo onto canvas using alpha channel as mask
    canvas.paste(logo_resized, offset, logo_resized)
    
    # Save as PNG
    out_path = os.path.join(os.path.dirname(base_path), output_name)
    canvas.save(out_path, "PNG")
    print(f"Generated {output_name} ({size}x{size})")

base_logo = r"c:\D\Learn\1PROJECTS\Camino\CaminoV2\assets\files\logo.png"

# Generate 192x192 maskable
generate_icon(base_logo, "logo-192.png", 192)

# Generate 512x512 maskable
generate_icon(base_logo, "logo-512.png", 512)

# Generate 180x180 apple-touch-icon
generate_icon(base_logo, "logo-180.png", 180)
