from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI()

def handler(event, context):
    return JSONResponse({"status": "ok", "message": "Eco Learn API is running"})