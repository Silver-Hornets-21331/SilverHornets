# Sponsor Logo Management Guide

This guide explains how to add and manage sponsor logos on the Silver Hornets website.

## Directory Structure

Create the following directory to store sponsor logos:
```
images/
  └── sponsors/
      ├── sponsor-1.png
      ├── sponsor-2.png
      ├── sponsor-3.png
      ├── sponsor-4.png
      └── ... (add more as needed)
```

## Adding a New Sponsor

### Step 1: Add Sponsor Logo Image
1. Obtain the sponsor's logo in PNG, JPG, or SVG format
2. Recommended dimensions: 400x200px or similar aspect ratio
3. Save the logo to `images/sponsors/` with a descriptive name
   - Example: `images/sponsors/acme-corp.png`

### Step 2: Update sponsors.json
Open `js/sponsors.json` and add the sponsor to the array:

```json
[
  {
    "name": "ACME Corporation",
    "logo": "images/sponsors/acme-corp.png",
    "website": "https://www.acmecorp.com",
    "description": "Leading technology solutions"
  },
  {
    "name": "Another Company",
    "logo": "images/sponsors/another-company.png",
    "website": "https://www.anothercompany.com",
    "description": "Supporting STEM education"
  }
]
```

**Fields:**
- `name`: Company or organization name (required)
- `logo`: Path to logo image relative to root (required)
- `website`: Company website URL (required)
- `description`: Brief description, shown on hover (required)

### Step 3: Test and Deploy
1. Open `sponsors.html` in a browser
2. Verify the logo displays correctly
3. Check that clicking the logo opens the sponsor's website
4. Commit and push changes to GitHub

## Sponsorship Tiers

The sponsors page displays sponsorship tier information for potential sponsors, but **all sponsor logos are displayed together** without classification by tier.

### Platinum ($5,000+)
- Logo on website and team materials
- Recognition at competitions
- Team merchandise
- Event invitations

### Gold ($2,500 - $4,999)
- Logo on website
- Team merchandise
- Social media recognition

### Silver ($1,000 - $2,499)
- Website acknowledgment
- Social media mention

### Bronze ($500 - $999)
- Website recognition

## Logo Guidelines

**Recommended Specifications:**
- Format: PNG with transparent background (preferred) or JPG
- Size: 400x200px minimum, maintain aspect ratio
- File size: Under 500KB
- Color: Full color or sponsor's standard logo

**Requirements:**
- Clear, high-resolution image
- Appropriate for professional display
- Sponsor's official logo only

## Image Optimization Tips

1. **Compress images** before uploading to reduce file size
2. **Use PNG** for logos with transparency
3. **Use JPG** for photos or logos without transparency
4. **Maintain aspect ratio** to prevent distortion

## Removing a Sponsor

To remove a sponsor:
1. Open `js/sponsors.json`
2. Delete the sponsor's object from the array
3. Optionally delete the logo image file
4. Save and commit changes

## Troubleshooting

**Logo doesn't display:**
- Check that the file path in `sponsors.json` is correct
- Verify the image file exists in `images/sponsors/`
- Check browser console for errors (F12)

**Logo appears distorted:**
- Use images with appropriate aspect ratio (2:1 recommended)
- Logos are automatically constrained to max 120px height

**Logo doesn't link:**
- Verify the `website` field has a complete URL starting with `https://`
- Check that the URL is accessible

## Example sponsors.json

```json
[
  {
    "name": "Tech Giant Inc",
    "logo": "images/sponsors/tech-giant.png",
    "website": "https://techgiant.com",
    "description": "Leading innovation partner"
  },
  {
    "name": "Innovation Co",
    "logo": "images/sponsors/innovation-co.png",
    "website": "https://innovationco.com",
    "description": "Supporting STEM education"
  },
  {
    "name": "Local Business",
    "logo": "images/sponsors/local-biz.png",
    "website": "https://localbiz.com",
    "description": "Community supporter"
  },
  {
    "name": "Engineering Solutions",
    "logo": "images/sponsors/engineering.png",
    "website": "https://engineering.com",
    "description": "Engineering excellence"
  },
  {
    "name": "Community Partner",
    "logo": "images/sponsors/community.png",
    "website": "https://community.org",
    "description": "Building the future"
  }
]
```

## Need Help?

Contact the team at: ftc.team.boulan@gmail.com
