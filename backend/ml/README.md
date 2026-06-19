# Locket Gold Ultimate - ML Filter Recommendation

Module nay dung de train rieng mot model nho gon, chay local, khong can GPU.
Sau khi train xong, file can dua cho team la:

```text
backend/ml/models/filter_model.pkl
```

## Cau truc

```text
backend/ml/
├── dataset/
│   ├── warm_gold/
│   ├── vintage/
│   ├── black_white/
│   ├── smooth_skin/
│   └── sharp_gold/
├── models/
│   └── filter_model.pkl
├── config.py
├── feature_extractor.py
├── train_model.py
├── predict_filter.py
└── README.md
```

## Chuan bi dataset

Bo anh training vao dung thu muc label:

```text
backend/ml/dataset/warm_gold/
backend/ml/dataset/vintage/
backend/ml/dataset/black_white/
backend/ml/dataset/smooth_skin/
backend/ml/dataset/sharp_gold/
```

Ho tro anh `.jpg`, `.jpeg`, `.png`.

Nen co toi thieu 10-20 anh moi label de model co ket qua on hon. Neu dataset con nho,
script van train duoc nhung se bo qua buoc chia train/test.

## Cai dependency

```bash
pip install -r requirements.txt
```

Dependency chinh:

```text
opencv-python
numpy
scikit-learn
joblib
```

## Train model

Chay tu thu muc goc project:

```bash
python backend/ml/train_model.py
```

Ket qua sau khi train:

```text
backend/ml/models/filter_model.pkl
```

File `.pkl` nay la model bundle gom:

- model RandomForestClassifier da train
- danh sach label
- thu tu feature
- phien ban scikit-learn
- thoi diem tao model

## Test prediction

```bash
python backend/ml/predict_filter.py path/to/test-image.jpg
```

Output mau:

```json
{
  "success": true,
  "recommended_filter": "warm_gold",
  "confidence": 0.86,
  "message": "Warm Gold is recommended because the image can benefit from a brighter and warmer tone."
}
```

## Ghi chu cho GitHub

- Co the push `backend/ml/models/filter_model.pkl` de team keo ve dung.
- Khong nen push dataset that neu dung luong lon hoac anh khong duoc phep chia se.
- Code predict can giu cung thu tu feature voi luc train, vi vay khong nen sua `FEATURE_NAMES` sau khi da train.

## Tich hop Flask sau nay

Backend Flask chi can nhan file upload, luu tam anh, roi goi:

```python
from backend.ml.predict_filter import predict_filter

result = predict_filter(image_path)
```

Sau do tra `result` ve frontend bang JSON.

