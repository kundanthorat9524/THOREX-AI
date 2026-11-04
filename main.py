import os
import uuid
import json
import requests
from flask import Flask, request, jsonify, Response, session
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv

import database

# Load environment variables
load_dotenv()

# Initialize DB
database.init_db()

app = Flask(__name__, static_folder='public', static_url_path='')
app.secret_key = os.getenv("SECRET_KEY", "thorex-ai-super-secret-key-2026")

def get_api_key():
    # 1. Check database settings
    db_key = database.get_setting("GEMINI_API_KEY")
    if db_key:
        return db_key
    # 2. Check env variables
    env_key = os.getenv("GEMINI_API_KEY")
    if env_key:
        return env_key
    return ""

@app.route('/')
def index():
    return app.send_static_file('index.html')

# Authentication Endpoints
@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json() or {}
        username = data.get("username", "").strip()
        password = data.get("password", "").strip()
        email = data.get("email", "").strip()

        if not username or not password:
            return jsonify({"error": "Username and password are required."}), 400
        if len(username) < 3:
            return jsonify({"error": "Username must be at least 3 characters long."}), 400
        if len(password) < 4:
            return jsonify({"error": "Password must be at least 4 characters long."}), 400

        existing_user = database.get_user_by_username(username)
        if existing_user:
            return jsonify({"error": "Username is already taken."}), 400

        user_id = str(uuid.uuid4())
        pw_hash = generate_password_hash(password)
        database.create_user(user_id, username, email, pw_hash)

        session['user_id'] = user_id
        return jsonify({
            "status": "success",
            "user": {"id": user_id, "username": username, "email": email}
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json() or {}
        username = data.get("username", "").strip()
        password = data.get("password", "").strip()

        if not username or not password:
            return jsonify({"error": "Username and password are required."}), 400

        user = database.get_user_by_username(username)
        if not user or not check_password_hash(user["password_hash"], password):
            return jsonify({"error": "Invalid username or password."}), 401

        session['user_id'] = user["id"]
        return jsonify({
            "status": "success",
            "user": {"id": user["id"], "username": user["username"], "email": user.get("email", "")}
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({"status": "success", "message": "Logged out successfully."})

@app.route('/api/auth/me', methods=['GET'])
def get_current_user():
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({"user": None})
        user = database.get_user_by_id(user_id)
        return jsonify({"user": user})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/sessions', methods=['GET'])
def get_sessions():
    try:
        user_id = session.get('user_id')
        sessions = database.get_sessions(user_id=user_id)
        return jsonify(sessions)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/sessions', methods=['POST'])
def create_session():
    try:
        data = request.get_json() or {}
        session_id = str(uuid.uuid4())
        title = data.get("title", "New Conversation")
        user_id = session.get('user_id')
        database.create_session(session_id, title, user_id=user_id)
        return jsonify({"id": session_id, "title": title})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/sessions/<session_id>', methods=['DELETE'])
def delete_session(session_id):
    try:
        database.delete_session(session_id)
        return jsonify({"status": "success", "message": f"Session {session_id} deleted."})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/sessions/<session_id>/messages', methods=['GET'])
def get_messages(session_id):
    try:
        messages = database.get_messages(session_id)
        return jsonify(messages)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/settings', methods=['GET'])
def get_settings():
    api_key = get_api_key()
    masked_key = ""
    if api_key:
        masked_key = api_key[:6] + "..." + api_key[-4:] if len(api_key) > 10 else "configured"
        
    hf_key = database.get_setting("HF_API_KEY") or os.getenv("HF_API_KEY", "")
    masked_hf_key = ""
    if hf_key:
        masked_hf_key = hf_key[:6] + "..." + hf_key[-4:] if len(hf_key) > 10 else "configured"
        
    return jsonify({
        "gemini_api_key_configured": bool(api_key),
        "masked_key": masked_key,
        "hf_api_key_configured": bool(hf_key),
        "masked_hf_key": masked_hf_key
    })

@app.route('/api/settings', methods=['POST'])
def save_settings():
    try:
        data = request.get_json() or {}
        api_key = data.get("gemini_api_key")
        hf_key = data.get("hf_api_key")
        
        if api_key is not None:
            database.save_setting("GEMINI_API_KEY", api_key)
        if hf_key is not None:
            database.save_setting("HF_API_KEY", hf_key)
            
        return jsonify({"status": "success", "message": "Settings saved successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500



def generate_chat_title(api_key, user_message):
    """Helper to generate a clean title using Gemini based on first prompt"""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    prompt = (
        f"Generate a short, concise title (maximum 3-5 words) for a chat conversation that begins with the following message:\n"
        f"\"{user_message}\"\n\n"
        f"Rules: Return ONLY the raw title text. Do not write 'Title:', do not include quotes, markdown formatting, or any extra text."
    )
    payload = {
        "contents": [
            {
                "parts": [{"text": prompt}]
            }
        ],
        "generationConfig": {
            "maxOutputTokens": 20,
            "temperature": 0.2
        }
    }
    
    try:
        res = requests.post(url, json=payload, timeout=10.0)
        if res.status_code == 200:
            data = res.json()
            title_text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
            title_text = title_text.replace('"', '').replace("'", "")
            return title_text
    except Exception:
        pass
    
    # Fallback to truncated user message
    words = user_message.split()
    return " ".join(words[:4]) + ("..." if len(words) > 4 else "")

@app.route('/api/chat', methods=['POST'])
def chat():
    api_key = get_api_key()
    if not api_key:
        def key_missing_stream():
            yield "data: " + json.dumps({"error": "Google Gemini API Key is missing. Please set it in the settings panel."}) + "\n\n"
        return Response(key_missing_stream(), mimetype="text/event-stream")

    try:
        data = request.get_json() or {}
        session_id = data.get("session_id")
        user_content = data.get("message")
        model = data.get("model", "gemini-2.5-flash")
        language = data.get("language", "en")
        
        # Mapping table for languages to customize system instruction for Gemini
        lang_names = {
            'en': 'English',
            'hi': 'Hindi',
            'mr': 'Marathi',
            'es': 'Spanish',
            'fr': 'French',
            'de': 'German',
            'ar': 'Arabic',
            'zh': 'Chinese',
            'ja': 'Japanese',
            'ru': 'Russian',
            'pt': 'Portuguese',
            'bn': 'Bengali',
            'ta': 'Tamil',
            'te': 'Telugu'
        }
        language_name = lang_names.get(language, "English")
        
        if not session_id or not user_content:
            return jsonify({"error": "Missing session_id or message"}), 400

        user_msg_id = str(uuid.uuid4())
        assistant_msg_id = str(uuid.uuid4())

        # Save user message to database
        database.save_message(user_msg_id, session_id, "user", user_content)

        # Check if first message to auto-update title
        existing_messages = database.get_messages(session_id)
        is_first_message = len(existing_messages) <= 1

        def event_generator():
            history = []
            db_messages = database.get_messages(session_id)
            for msg in db_messages[:-1]:
                history.append({
                    "role": msg["role"],
                    "parts": [{"text": msg["content"]}]
                })
            
            history.append({
                "role": "user",
                "parts": [{"text": user_content}]
            })

            payload = {
                "contents": history,
                "systemInstruction": {
                    "parts": [
                        {"text": f"You are THOREX AI, a highly intelligent AI assistant designed by Google Gemini APIs. You must communicate and respond strictly in {language_name}. Always provide short, concise, and direct answers focused on the core concept. Avoid long explanations, wordy introductions, or unnecessary details unless explicitly requested by the user."}
                    ]
                },
                "generationConfig": {
                    "temperature": 0.7,
                    "topP": 0.95,
                    "maxOutputTokens": 512,
                }
            }

            gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:streamGenerateContent?alt=sse&key={api_key}"
            full_response_text = ""

            # Handle title generation if first message
            if is_first_message:
                try:
                    new_title = generate_chat_title(api_key, user_content)
                    if new_title:
                        database.update_session_title(session_id, new_title)
                        yield "data: " + json.dumps({"type": "title", "title": new_title}) + "\n\n"
                except Exception:
                    pass

            try:
                # Call Gemini stream
                response = requests.post(gemini_url, json=payload, stream=True, timeout=60.0)
                if response.status_code != 200:
                    yield "data: " + json.dumps({"error": f"Gemini API returned error code {response.status_code}"}) + "\n\n"
                    return

                buffer = ""
                for chunk in response.iter_content(chunk_size=1024, decode_unicode=True):
                    if chunk:
                        buffer += chunk
                        while "\n" in buffer:
                            line, buffer = buffer.split("\n", 1)
                            line = line.strip()
                            if not line:
                                continue
                            if line.startswith("data:"):
                                data_str = line[5:].strip()
                                if data_str == "[DONE]":
                                    continue
                                try:
                                    data_json = json.loads(data_str)
                                    text_chunk = data_json["candidates"][0]["content"]["parts"][0]["text"]
                                    full_response_text += text_chunk
                                    yield "data: " + json.dumps({"type": "content", "content": text_chunk}) + "\n\n"
                                except (json.JSONDecodeError, KeyError, IndexError):
                                    pass

                # Save the complete model response in SQLite
                if full_response_text:
                    database.save_message(assistant_msg_id, session_id, "model", full_response_text)
                
                # Send completion signal
                yield "data: " + json.dumps({"type": "done"}) + "\n\n"

            except Exception as ex:
                yield "data: " + json.dumps({"error": f"An error occurred: {str(ex)}"}) + "\n\n"

        return Response(event_generator(), mimetype="text/event-stream")

    except Exception as e:
        return jsonify({"error": str(e)}), 500

import time
from datetime import datetime

# In-memory store for tracking video generations (No SQLite stored as requested)
# Each record contains: id, prompt, aspect_ratio, model, status, operation_name, video_path, error_message, sandbox, created_at, start_time
video_operations = {}

# Ensure static folder for videos is created on startup
VIDEOS_DIR = os.path.join(app.static_folder, 'videos')
os.makedirs(VIDEOS_DIR, exist_ok=True)

# Pre-download a lightweight mock video to play during sandbox simulation
MOCK_VIDEO_PATH = os.path.join(VIDEOS_DIR, 'mock_video.mp4')
if not os.path.exists(MOCK_VIDEO_PATH):
    try:
        # 0.5MB sample video from public Google storage
        sample_url = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
        r = requests.get(sample_url, timeout=15)
        if r.status_code == 200:
            with open(MOCK_VIDEO_PATH, 'wb') as f:
                f.write(r.content)
            print("Successfully downloaded sample video for sandbox simulation.")
    except Exception as e:
        print(f"Warning: Could not pre-download mock video: {e}")

# Pre-download a high-quality mock image for sandbox simulation of image generation models
MOCK_IMAGE_PATH = os.path.join(VIDEOS_DIR, 'mock_image.png')
if not os.path.exists(MOCK_IMAGE_PATH):
    try:
        sample_img_url = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1024"
        r = requests.get(sample_img_url, timeout=15)
        if r.status_code == 200:
            with open(MOCK_IMAGE_PATH, 'wb') as f:
                f.write(r.content)
            print("Successfully downloaded sample image for sandbox simulation.")
    except Exception as e:
        print(f"Warning: Could not pre-download mock image: {e}")


@app.route('/api/video/script-prompt', methods=['POST'])
def generate_script_prompt():
    data = request.get_json() or {}
    topic = data.get("topic", "").strip()
    video_type = data.get("type", "short")  # 'short' (9:16) or 'standard' (16:9)

    if not topic:
        return jsonify({"error": "Topic is required"}), 400

    api_key = get_api_key()
    aspect = "9:16" if video_type == "short" else "16:9"

    if not api_key:
        clean_topic = topic[:80]
        cinematic_prompt = f"Cinematic {video_type} video of {clean_topic}, 8k resolution, photorealistic studio lighting, dynamic camera motion."
        return jsonify({
            "title": f"YouTube {video_type.title()}: {clean_topic[:30]}",
            "script": f"Welcome! Today we explore {clean_topic}. Stay tuned for amazing insights!",
            "video_prompt": cinematic_prompt,
            "aspect_ratio": aspect
        })

    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
        prompt = (
            f"You are a professional YouTube creator and AI video prompt engineer. "
            f"Given the topic or text below, generate a JSON response with 3 fields:\n"
            f"1. 'title': Catchy YouTube title\n"
            f"2. 'script': A brief 2-sentence YouTube video hook & narration script\n"
            f"3. 'video_prompt': A detailed, highly visual cinematic text prompt (written in English) optimized for Google Veo AI video generation.\n\n"
            f"Topic: \"{topic}\"\n"
            f"Video Format: YouTube {video_type.title()} ({aspect})\n\n"
            f"Return ONLY valid JSON matching format: {{\"title\": \"...\", \"script\": \"...\", \"video_prompt\": \"...\"}}"
        )

        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "temperature": 0.7,
                "responseMimeType": "application/json"
            }
        }

        res = requests.post(url, json=payload, timeout=15.0)
        if res.status_code == 200:
            res_data = res.json()
            raw_json = res_data["candidates"][0]["content"]["parts"][0]["text"].strip()
            parsed = json.loads(raw_json)
            parsed["aspect_ratio"] = aspect
            return jsonify(parsed)

    except Exception:
        pass

    clean_topic = topic[:80]
    return jsonify({
        "title": f"YouTube {video_type.title()}: {clean_topic[:30]}",
        "script": f"Discover the truth about {clean_topic} in this quick breakdown!",
        "video_prompt": f"Cinematic scene depicting {clean_topic}, hyperrealistic 8k resolution, dramatic lighting, smooth camera movement.",
        "aspect_ratio": aspect
    })

@app.route('/api/video/generate', methods=['POST'])
def generate_video():
    data = request.get_json() or {}
    sandbox = data.get("sandbox", False)
    prompt = data.get("prompt", "").strip()
    model = data.get("model", "veo-3.1-fast-generate-preview")
    aspect_ratio = data.get("aspect_ratio", "16:9")

    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400

    is_hf = "qwen" in model.lower()
    api_key = None
    hf_key = None

    if is_hf:
        hf_key = database.get_setting("HF_API_KEY")
        if not hf_key:
            hf_key = os.getenv("HF_API_KEY")
        if not sandbox and not hf_key:
            return jsonify({"error": "Hugging Face API Key is missing. Please set it in the settings panel."}), 400
    else:
        api_key = get_api_key()
        if not sandbox and not api_key:
            return jsonify({"error": "Google Gemini API Key is missing. Please set it in the settings panel."}), 400

    generation_id = str(uuid.uuid4())
    now_str = datetime.now().isoformat()

    if sandbox:
        video_operations[generation_id] = {
            "id": generation_id,
            "prompt": prompt,
            "aspect_ratio": aspect_ratio,
            "model": model,
            "status": "pending",
            "operation_name": None,
            "video_path": None,
            "error_message": None,
            "sandbox": True,
            "created_at": now_str,
            "start_time": time.time()
        }
        return jsonify({"status": "pending", "id": generation_id, "sandbox": True})

    if is_hf:
        # Real Hugging Face Inference API Call for Qwen/Qwen-Image
        try:
            # Standard model on HF Inference API is e.g. "Qwen/Qwen-Image"
            hf_model = model
            if model.lower() == "qwen/qwen-image":
                hf_model = "Qwen/Qwen-Image"
                
            url = f"https://api-inference.huggingface.co/models/{hf_model}"
            headers = {
                "Authorization": f"Bearer {hf_key}",
                "Content-Type": "application/json"
            }
            payload = {
                "inputs": prompt
            }
            
            response = requests.post(url, json=payload, headers=headers, timeout=45.0)
            
            # Handle model loading state (503 Service Unavailable)
            if response.status_code == 503:
                try:
                    err_json = response.json()
                    if "estimated_time" in err_json:
                        est_time = err_json["estimated_time"]
                        return jsonify({"error": f"Model is currently loading on Hugging Face. Please try again in {int(est_time)} seconds."}), 503
                except Exception:
                    pass

            if response.status_code != 200:
                try:
                    error_detail = response.json().get("error", response.text)
                    if isinstance(error_detail, list):
                        error_detail = ", ".join(error_detail)
                except Exception:
                    error_detail = response.text
                return jsonify({"error": f"Hugging Face API error: {error_detail}"}), response.status_code

            # Check if response actually contains image data (Hugging Face returns image bytes)
            if len(response.content) < 100:
                return jsonify({"error": f"Hugging Face returned invalid response content: {response.text}"}), 500

            local_filename = f"{generation_id}.png"
            local_filepath = os.path.join(VIDEOS_DIR, local_filename)
            
            with open(local_filepath, "wb") as f:
                f.write(response.content)

            video_operations[generation_id] = {
                "id": generation_id,
                "prompt": prompt,
                "aspect_ratio": aspect_ratio,
                "model": model,
                "status": "completed",
                "operation_name": None,
                "video_path": f"/videos/{local_filename}",
                "error_message": None,
                "sandbox": False,
                "created_at": now_str,
                "start_time": time.time()
            }
            return jsonify({"status": "generating", "id": generation_id, "sandbox": False})

        except Exception as e:
            return jsonify({"error": f"Server error calling Hugging Face: {str(e)}"}), 500

    # Real Veo API Call
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:predictLongRunning?key={api_key}"
        payload = {
            "instances": [{"prompt": prompt}],
            "parameters": {
                "aspectRatio": aspect_ratio,
                "resolution": "720p"
            }
        }
        
        # Long running operations take time, so we POST and receive an operation name
        response = requests.post(url, json=payload, timeout=20.0)
        
        if response.status_code != 200:
            try:
                error_detail = response.json().get("error", {}).get("message", response.text)
            except Exception:
                error_detail = response.text
            return jsonify({"error": f"Google API error: {error_detail}"}), response.status_code
        res_data = response.json()
        operation_name = res_data.get("name")
        if not operation_name:
            return jsonify({"error": "Failed to initiate generation: No operation name returned by API."}), 500


        video_operations[generation_id] = {
            "id": generation_id,
            "prompt": prompt,
            "aspect_ratio": aspect_ratio,
            "model": model,
            "status": "generating",
            "operation_name": operation_name,
            "video_path": None,
            "error_message": None,
            "sandbox": False,
            "created_at": now_str,
            "start_time": time.time()
        }

        return jsonify({"status": "generating", "id": generation_id, "sandbox": False})

    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/api/video/status/<generation_id>', methods=['GET'])
def get_video_status(generation_id):
    if generation_id not in video_operations:
        return jsonify({"error": "Generation not found"}), 404

    op_info = video_operations[generation_id]

    # Handle Sandbox Simulation Mode
    if op_info["sandbox"]:
        elapsed = time.time() - op_info["start_time"]
        is_hf = "qwen" in op_info.get("model", "").lower()
        mock_path = "/videos/mock_image.png" if is_hf else "/videos/mock_video.mp4"

        if elapsed < 5:
            op_info["status"] = "pending"
            progress = int((elapsed / 5) * 20)
            return jsonify({"status": "pending", "progress": progress, "sandbox": True})
        elif elapsed < 15:
            op_info["status"] = "generating"
            progress = 20 + int(((elapsed - 5) / 10) * 70)
            return jsonify({"status": "generating", "progress": progress, "sandbox": True})
        else:
            op_info["status"] = "completed"
            op_info["video_path"] = mock_path
            return jsonify({
                "status": "completed",
                "progress": 100,
                "video_path": op_info["video_path"],
                "sandbox": True
            })


    # Real Polling Mode
    if op_info["status"] in ["completed", "failed"]:
        return jsonify(op_info)

    api_key = get_api_key()
    if not api_key:
        return jsonify({"error": "API Key missing"}), 400

    operation_name = op_info["operation_name"]
    try:
        # Query operations endpoint
        url = f"https://generativelanguage.googleapis.com/v1beta/{operation_name}?key={api_key}"
        res = requests.get(url, timeout=15.0)
        
        if res.status_code != 200:
            return jsonify({"error": f"Failed to fetch operation status: {res.text}"}), res.status_code

        data = res.json()
        done = data.get("done", False)

        if done:
            error = data.get("error")
            if error:
                error_msg = error.get("message", "Unknown Google API error")
                op_info["status"] = "failed"
                op_info["error_message"] = error_msg
                return jsonify(op_info)

            # Retrieve video information
            response_payload = data.get("response", {})
            gen_videos = response_payload.get("generatedVideos", [])
            if not gen_videos:
                op_info["status"] = "failed"
                op_info["error_message"] = "No generated videos found in Google API response"
                return jsonify(op_info)

            video_uri = gen_videos[0].get("video", {}).get("uri")
            if not video_uri:
                op_info["status"] = "failed"
                op_info["error_message"] = "No video URI returned"
                return jsonify(op_info)

            # Download video file content
            if video_uri.startswith("http"):
                download_url = f"{video_uri}:download?alt=media"
            else:
                download_url = f"https://generativelanguage.googleapis.com/v1beta/{video_uri}:download?alt=media"

            video_res = requests.get(download_url, headers={"x-goog-api-key": api_key}, stream=True, timeout=30.0)
            if video_res.status_code != 200:
                op_info["status"] = "failed"
                op_info["error_message"] = f"Failed to download video file content from Google (HTTP {video_res.status_code})"
                return jsonify(op_info)

            local_filename = f"{generation_id}.mp4"
            local_filepath = os.path.join(VIDEOS_DIR, local_filename)

            with open(local_filepath, "wb") as f:
                for chunk in video_res.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)

            op_info["status"] = "completed"
            op_info["video_path"] = f"/videos/{local_filename}"
            return jsonify(op_info)

        else:
            # Operation is still in progress
            elapsed = time.time() - op_info["start_time"]
            progress = min(95, 10 + int(elapsed * 2.5))
            return jsonify({"status": "generating", "progress": progress})

    except Exception as e:
        return jsonify({"error": f"Error updating status: {str(e)}"}), 500

@app.route('/api/video/delete/<generation_id>', methods=['DELETE'])
def delete_video(generation_id):
    if generation_id in video_operations:
        op_info = video_operations[generation_id]
        video_path = op_info.get("video_path")
        if video_path and not video_path.endswith("mock_video.mp4"):
            full_path = os.path.join(app.static_folder, video_path.lstrip('/'))
            if os.path.exists(full_path):
                try:
                    os.remove(full_path)
                except Exception:
                    pass
        del video_operations[generation_id]
        return jsonify({"status": "success"})
    return jsonify({"error": "Generation not found"}), 404

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    app.run(host="0.0.0.0", port=port, debug=False)
