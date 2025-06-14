import os
import torch
from uuid import uuid4
from diffusers import StableDiffusion3Pipeline

pipe = StableDiffusion3Pipeline.from_pretrained(
    "stabilityai/stable-diffusion-3.5-large",
    torch_dtype=torch.float16
).to("cuda" if torch.cuda.is_available() else "cpu")

OUTPUT_DIR = "generated_images"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def get_image_size(frame: str) -> tuple[int, int]:
    """
    Returns image dimensions (width, height) based on selected frame aspect ratio.
    Defaults to 512x512 if unknown.
    """
    return {
        "1:1": (512, 512),
        "16:9": (1280, 720),
        "9:16": (720, 1280),
        "4:3": (1024, 768),
        "3:4": (768, 1024),
    }.get(frame, (512, 512))


def compose_prompt(base_prompt: str, colors: list[str], images: list[str], usage: str) -> str:
    """
    Builds a descriptive prompt string using:
    - base prompt
    - selected colors
    - reference/included images
    - image usage preference
    """
    prompt = base_prompt.strip()

    if colors:
        prompt += f" Use prominent colors such as: {', '.join(colors)}."

    if images:
        image_names = [os.path.splitext(os.path.basename(name))[0] for name in images]
        if usage == "include-in-generation":
            prompt += f" Incorporate visual elements like: {', '.join(image_names)}."
        elif usage == "reference-only":
            prompt += f" Style inspired by references: {', '.join(image_names)}."

    return prompt.strip()


def generate_images(prompt: str, width: int, height: int, count: int) -> list[str]:
    """
    Generates `count` number of images with given prompt and dimensions.
    Saves them and returns the list of relative file paths for frontend.
    """
    results = []
    for _ in range(count):
        image = pipe(prompt, height=height, width=width).images[0]
        filename = f"{uuid4().hex}.png"
        output_path = os.path.join(OUTPUT_DIR, filename)
        image.save(output_path)
        results.append(f"/generated_images/{filename}")  
    return results
