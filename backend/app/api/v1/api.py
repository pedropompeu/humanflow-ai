from fastapi import APIRouter

from app.api.v1.endpoints import users, repositories, analysis

api_router = APIRouter()

api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(repositories.router, prefix="/repositories", tags=["repositories"])
api_router.include_router(analysis.router, prefix="/analysis", tags=["analysis"])
