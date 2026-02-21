# Robot Images Guide

## Adding Past Robot Images

The "Past Robot Designs" section on the About page displays your team's robots from different seasons.

### Image Specifications

**Recommended Size:**
- Width: 600-800 pixels
- Height: 400-600 pixels
- Aspect Ratio: 4:3 or 3:2
- Format: JPG or PNG
- File Size: Under 500KB (optimize for web)

### How to Add Robot Images

1. **Prepare Your Images:**
   - Name them clearly: `robot-2025.jpg`, `robot-2024.jpg`, `robot-2023.jpg`
   - Place them in the `images/` folder

2. **The Images Will Auto-Display:**
   - If an image exists, it will show
   - If an image is missing, a robot emoji (🤖) placeholder appears
   - No code changes needed!

### Customizing Robot Information

Edit [about.html](about.html) to update:

**For each robot card, you can change:**
- Season year (e.g., "2025-2026 Season")
- Robot name (e.g., "Current Robot")
- Description paragraph
- Features list (the items with ⚙️ icons)

**Example:**
```html
<div class="robot-card">
    <div class="robot-image-placeholder">
        <img src="images/robot-2025.jpg" alt="2025-2026 Robot">
    </div>
    <div class="robot-info">
        <h3>2025-2026 Season</h3>
        <p class="robot-name">Robot Name Here</p>
        <p>Description of the robot and its capabilities.</p>
        <ul class="robot-features">
            <li>Feature 1</li>
            <li>Feature 2</li>
            <li>Feature 3</li>
        </ul>
    </div>
</div>
```

### Adding More Robots

To add robots from additional years:

1. Copy an existing `<div class="robot-card">...</div>` block
2. Paste it in the `<div class="robots-grid">` section
3. Update:
   - Image filename (e.g., `robot-2022.jpg`)
   - Season year
   - Robot name
   - Description
   - Features

The grid layout automatically adjusts to fit all robots!

### Tips for Best Results

✅ **DO:**
- Use high-quality images of your actual robots
- Show the robot from a clear angle
- Compress images for faster loading
- Keep descriptions concise and informative
- List 3-5 key features per robot

❌ **DON'T:**
- Use images over 1MB in size
- Include distracting backgrounds
- Write overly long descriptions
- Leave placeholder text unchanged

### Current Image Locations

The About page expects these images:
- `images/robot-2025.jpg` - Current season
- `images/robot-2024.jpg` - Last season
- `images/robot-2023.jpg` - Two seasons ago

Add your robot photos to the `images/` folder with these exact names!
