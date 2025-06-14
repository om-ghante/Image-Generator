from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List
from image_generator import get_image_size, compose_prompt, generate_images

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/generated_images", StaticFiles(directory="generated_images"), name="generated_images")

class GenerationRequest(BaseModel):
    prompt: str
    selectedFrame: str
    selectedColors: List[str]
    imageCount: int
    images: List[str]
    imageUsageOption: str  

@app.post("/generate-images/")
async def generate_image_endpoint(data: GenerationRequest):

    width, height = get_image_size(data.selectedFrame)

    final_prompt = compose_prompt(
        base_prompt=data.prompt,
        colors=data.selectedColors,
        images=data.images,
        usage=data.imageUsageOption
    )

    urls = generate_images(
        prompt=final_prompt,
        width=width,
        height=height,
        count=data.imageCount
    )

    return {
        "images": urls,
        "usedPrompt": final_prompt,
        "size": {"width": width, "height": height}
    }
