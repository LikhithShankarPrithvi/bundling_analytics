from pydantic import BaseModel
from typing import List

class BundleRequest(BaseModel):
    cart: List[int]

class Product(BaseModel):
    product_id: int
    product_name: str
    price: float
    category: str

class BundleResponse(BaseModel):
    recommended_bundle: dict  # You can define a nested model if needed
