from flask import make_response, jsonify, Request
import traceback
import io
from contextlib import redirect_stdout


def execute_code(code_to_run: str):
    try:
        stdout = io.StringIO()  # Create a StringIO object to capture stdout
        with redirect_stdout(stdout):
            exec(code_to_run)
        return {"status": "success", "output": stdout.getvalue()}
    except Exception as e:
        tb = traceback.format_exc()
        return {"status": "error", "output": str(e), "traceback": tb}


def hello_world(request: Request):
    request_json = request.get_json()
    code_to_run = ""

    if (request_json and 'body' in request_json):
        body = request_json['body']
        if 'code' in body:
            code_to_run = body['code']

    result = execute_code(code_to_run)

    if result["status"] == "success":
        resp = make_response(
            jsonify({"status": "success",
                     "output": result["output"]}), 200)
    else:
        resp = make_response(
            jsonify({"error": result["output"],
                     "traceback": result["traceback"]}), 500)

    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'
    resp.headers['Access-Control-Allow-Headers'] = 'Content-Type'

    return resp
