import json
import pandas as pd
from fastapi import APIRouter
from app.models import BundleRequest, BundleResponse
from app.logic.synergy_engine import recommend_bundle

router = APIRouter()




# Load data from JSON
with open('app/data/products.json', 'r') as jsonfile:
    products_data = json.load(jsonfile)
    products_df = pd.DataFrame(products_data)

with open('app/data/synergy_scores.json', 'r') as jsonfile:
    synergy_data = json.load(jsonfile)
    synergy_df = pd.DataFrame(synergy_data)


from fastapi import APIRouter
from fastapi.responses import JSONResponse
import json
import os

router = APIRouter()

@router.get("/api/products")
def get_products():
    try:
        with open('app/data/products.json', 'r') as f:
            data = json.load(f)
        return JSONResponse(content=data)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


@router.post("/api/recommend_bundle", response_model=BundleResponse)
def get_bundle(request: BundleRequest):
    result = recommend_bundle(request.cart,synergy_df,products_df)
    return result
