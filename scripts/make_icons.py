import os
from PIL import Image, ImageDraw

def create_icon(size):
    img = Image.new('RGBA', (size, size), (26, 26, 26, 255))
    draw = ImageDraw.Draw(img)
    accent_orange = (255, 161, 22, 255)
    white = (255, 255, 255, 255)
    margin = max(1, size // 8)
    draw.rectangle([margin, margin, size - margin, size - margin], outline=accent_orange, width=max(1, size // 16))
    center = size // 2
    bar_width = max(2, size // 10)
    draw.rectangle([margin + 2, center - bar_width // 2, size - margin - 2, center + bar_width // 2], fill=white)
    node_size = max(3, size // 5)
    draw.ellipse([margin + 2, center - node_size // 2, margin + 2 + node_size, center + node_size // 2], fill=accent_orange)
    draw.ellipse([size - margin - 2 - node_size, center - node_size // 2, size - margin - 2, center + node_size // 2], fill=accent_orange)
    os.makedirs('icons', exist_ok=True)
    path = f'icons/icon{size}.png'
    img.save(path, 'PNG')
    print(f'Generated {path}')

if __name__ == '__main__':
    for sz in [16, 32, 48, 128]:
        create_icon(sz)
