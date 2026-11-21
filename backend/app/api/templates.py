from fastapi import APIRouter, Depends
from app.core.security import get_current_user
from app.services.template_service import template_service

router = APIRouter(prefix="/templates", tags=["Templates"])


@router.get("")
def list_templates(current_user=Depends(get_current_user)):
    return template_service.list_templates()


@router.get("/{template_id}")
def get_template(template_id: str, current_user=Depends(get_current_user)):
    return template_service.get_template(template_id)
