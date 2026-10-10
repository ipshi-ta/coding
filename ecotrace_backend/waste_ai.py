
from pathlib import Path
from io import BytesIO

import numpy as np
import onnxruntime as ort
from PIL import Image

MODEL_PATH = Path(__file__).parent / "models" / "mobilenetv2-10.onnx"

_session = None


def get_session():
    global _session
    if _session is None:
        _session = ort.InferenceSession(
            str(MODEL_PATH),
            providers=["CPUExecutionProvider"]
        )
    return _session


def predict_image(image_bytes):
    image = Image.open(BytesIO(image_bytes)).convert("RGB")
    image = image.resize((224, 224))

    array = np.asarray(image, dtype=np.float32) / 255.0
    array = (array - [0.485, 0.456, 0.406]) / [
        0.229, 0.224, 0.225
    ]
    array = array.transpose(2, 0, 1)
    array = np.expand_dims(array, axis=0).astype(np.float32)

    session = get_session()
    output = session.run(None, {"input": array})[0][0]

    class_id = int(np.argmax(output))

    return {
        "class_id": class_id,
        "confidence": float(np.max(output))
    }
