from fastapi import FastAPI
from app.api.routes import router
from fastapi.middleware.cors import CORSMiddleware






app = FastAPI(title="Product Bundle Recommendation API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify: ["http://localhost:3000"] for your React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# app.include_router(router, prefix="/api")

app.include_router(router)


