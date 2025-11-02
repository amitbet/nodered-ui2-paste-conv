#!/bin/bash

# Script to create placeholder icons for Electron app
# Replace these with your actual icons later

echo "Creating placeholder icons..."

# Create a simple placeholder PNG (512x512)
# This uses ImageMagick if available, otherwise creates a simple colored square

if command -v convert &> /dev/null; then
    # Using ImageMagick
    convert -size 512x512 xc:"#667eea" \
            -fill white \
            -font Arial-Bold \
            -pointsize 72 \
            -gravity center \
            -annotate +0+0 "NR\nConv" \
            build/icon.png
    
    echo "✅ Created build/icon.png using ImageMagick"
else
    # Create a simple colored square using Python
    python3 << 'EOF'
from PIL import Image, ImageDraw, ImageFont
import os

os.makedirs('build', exist_ok=True)

# Create 512x512 image
img = Image.new('RGB', (512, 512), color='#667eea')
draw = ImageDraw.Draw(img)

# Try to use a font, fallback to default
try:
    font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 72)
except:
    try:
        font = ImageFont.truetype("arial.ttf", 72)
    except:
        font = ImageFont.load_default()

# Draw text
text = "NR\nConv"
bbox = draw.textbbox((0, 0), text, font=font)
text_width = bbox[2] - bbox[0]
text_height = bbox[3] - bbox[1]
position = ((512 - text_width) // 2, (512 - text_height) // 2)

draw.text(position, text, fill='white', font=font)
img.save('build/icon.png')
print("✅ Created build/icon.png using Python PIL")
EOF
    
    if [ $? -ne 0 ]; then
        echo "⚠️  Could not create icon automatically"
        echo "Please create build/icon.png manually (512x512 PNG)"
        echo "Or install ImageMagick: brew install imagemagick"
    fi
fi

echo ""
echo "Next steps:"
echo "1. Replace build/icon.png with your custom icon"
echo "2. Create build/icon.icns for macOS (see build/README.md)"
echo "3. Create build/icon.ico for Windows (see build/README.md)"
echo ""
echo "For now, the app will use icon.png as fallback"

