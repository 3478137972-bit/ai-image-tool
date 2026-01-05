# AI Agents & Models

This document describes the AI models and agents used in the image generation platform.

## Available AI Models

### Text-to-Image Models

1. **Nano Banana Pro** (Default)
   - Primary model for text-to-image generation
   - Optimized for high-quality output
   - Supports resolutions: 1K, 2K, 4K
   - Multiple aspect ratios supported

2. **Nano Banana**
   - Standard version of the Nano Banana model
   - Available for both text-to-image and image-to-image

3. **Stable Diffusion XL**
   - Industry-standard diffusion model
   - Text-to-image generation

4. **Midjourney V6**
   - Advanced artistic generation
   - Text-to-image generation

### Image-to-Image Models

1. **Nano Banana Pro**
   - Primary model for image-to-image transformation
   - Supports prompt-guided image modification

2. **Nano Banana**
   - Standard version for image-to-image tasks

## Generation Capabilities

### Text-to-Image
- Prompt-based generation (up to 5000 characters)
- Resolution options: 1K, 2K, 4K
- Aspect ratios: Auto, 1:1, 9:16, 16:9, 3:4, 4:3, 3:2, 2:3, 5:4, 4:5, 21:9

### Image-to-Image
- Upload support: PNG, JPEG, WebP
- Prompt-guided transformation (up to 5000 characters)
- Resolution options: 1K, 2K, 4K
- Aspect ratios: 1:1, 9:16, 16:9, 4:3, 3:4, 3:2, 2:3, 21:9

## Credit System

- Each generation consumes credits
- Default credit cost: 30 credits per generation
- Users can track available credits in the interface

## Technical Implementation

### Components
- `ImageGenerator`: Main component handling both text-to-image and image-to-image workflows
- Model selection via dropdown interface
- Real-time prompt character counting
- Drag-and-drop file upload support

### Supported File Formats
- Input: PNG, JPEG, WebP
- Maximum prompt length: 5000 characters
