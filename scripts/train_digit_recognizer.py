"""Trains the tiny MLP baked into src/data/digitWeights.ts.

Offline only: sklearn.datasets.load_digits ships 1797 8x8 handwritten
digits with the scikit-learn package itself, no download. Requires
numpy + scikit-learn (dev-only, not a runtime dependency of the site):

    python3 -m venv .venv && .venv/bin/pip install numpy scikit-learn
    .venv/bin/python scripts/train_digit_recognizer.py

Data augmentation (shift/dilate/erode) simulates the off-center,
variable-thickness input a freehand canvas produces — the raw dataset
is tightly cropped and centered, which a naively-trained model overfits
to. Training uses Adam + early stopping on a held-out validation split
so epoch count is picked by measured generalization, not a fixed guess.
"""

import json
import os

import numpy as np
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split

rng = np.random.default_rng(0)


def shift(img, dx, dy):
    out = np.zeros_like(img)
    src_y0, src_y1 = max(0, -dy), 8 - max(0, dy)
    dst_y0, dst_y1 = max(0, dy), 8 - max(0, -dy)
    src_x0, src_x1 = max(0, -dx), 8 - max(0, dx)
    dst_x0, dst_x1 = max(0, dx), 8 - max(0, -dx)
    out[dst_y0:dst_y1, dst_x0:dst_x1] = img[src_y0:src_y1, src_x0:src_x1]
    return out


def dilate(img):
    padded = np.pad(img, 1, constant_values=0)
    out = np.zeros_like(img)
    for i in range(8):
        for j in range(8):
            out[i, j] = padded[i : i + 3, j : j + 3].max()
    return out


def erode(img):
    padded = np.pad(img, 1, constant_values=16)
    out = np.zeros_like(img)
    for i in range(8):
        for j in range(8):
            out[i, j] = padded[i : i + 3, j : j + 3].min()
    return out


def augment(X, y):
    imgs = X.reshape(-1, 8, 8)
    # cross product of pen-thickness (freehand strokes vary a lot more than
    # the dataset's own scans) and off-center shift covers the actual gap:
    # a canvas drawing is thicker/off-center, not just noisier
    # double-dilate was here too, but at 8x8 it seals shut any digit with an
    # enclosed loop (0, 6, 8, 9) into a solid blob — training on a "0" that
    # no longer has a hole teaches the network the wrong prototype for it
    thicknesses = [imgs, np.array([dilate(im) for im in imgs]), np.array([erode(im) for im in imgs])]
    offsets = [(0, 0), (-1, 0), (1, 0), (0, -1), (0, 1)]
    variants = []
    labels = []
    for base in thicknesses:
        for dx, dy in offsets:
            variants.append(np.array([shift(im, dx, dy) for im in base]))
            labels.append(y)
    return np.concatenate(variants).reshape(-1, 64), np.concatenate(labels)


data = load_digits()
X_all = data.data
y_all = data.target

# held-out test set, carved out before any augmentation touches the data
X_trainfull, X_test, y_trainfull, y_test = train_test_split(
    X_all, y_all, test_size=0.2, random_state=0, stratify=y_all
)
# validation split for early stopping, also from clean (unaugmented) images
X_train2, X_val, y_train2, y_val = train_test_split(
    X_trainfull, y_trainfull, test_size=0.15, random_state=0, stratify=y_trainfull
)

X_train, y_train = augment(X_train2, y_train2)
X_train, X_val, X_test = X_train / 16.0, X_val / 16.0, X_test / 16.0

n_in, n_hidden, n_out = 64, 128, 10


def one_hot(y, n):
    oh = np.zeros((len(y), n))
    oh[np.arange(len(y)), y] = 1
    return oh


Y_train = one_hot(y_train, n_out)
Y_val = one_hot(y_val, n_out)

W1 = rng.normal(0, np.sqrt(2 / n_in), (n_in, n_hidden))
b1 = np.zeros(n_hidden)
W2 = rng.normal(0, np.sqrt(2 / n_hidden), (n_hidden, n_out))
b2 = np.zeros(n_out)

params = {"W1": W1, "b1": b1, "W2": W2, "b2": b2}
adam_m = {k: np.zeros_like(v) for k, v in params.items()}
adam_v = {k: np.zeros_like(v) for k, v in params.items()}
beta1, beta2, eps = 0.9, 0.999, 1e-8
lr = 1e-3
weight_decay = 1e-4
batch_size = 64
max_epochs = 2000
patience = 100


def forward(X, p):
    z1 = X @ p["W1"] + p["b1"]
    a1 = np.maximum(0, z1)
    z2 = a1 @ p["W2"] + p["b2"]
    z2 = z2 - z2.max(axis=1, keepdims=True)
    exp = np.exp(z2)
    probs = exp / exp.sum(axis=1, keepdims=True)
    return z1, a1, probs


def accuracy(X, y, p):
    _, _, probs = forward(X, p)
    return (probs.argmax(axis=1) == y).mean()


best_val_acc = -1
best_params = None
epochs_without_improvement = 0
t = 0
n = len(X_train)

for epoch in range(max_epochs):
    order = rng.permutation(n)
    for start in range(0, n, batch_size):
        idx = order[start : start + batch_size]
        xb, yb = X_train[idx], Y_train[idx]

        z1, a1, probs = forward(xb, params)
        dz2 = (probs - yb) / len(idx)
        grads = {
            "W2": a1.T @ dz2 + weight_decay * params["W2"],
            "b2": dz2.sum(axis=0),
        }
        da1 = dz2 @ params["W2"].T
        dz1 = da1 * (z1 > 0)
        grads["W1"] = xb.T @ dz1 + weight_decay * params["W1"]
        grads["b1"] = dz1.sum(axis=0)

        t += 1
        for k in params:
            adam_m[k] = beta1 * adam_m[k] + (1 - beta1) * grads[k]
            adam_v[k] = beta2 * adam_v[k] + (1 - beta2) * (grads[k] ** 2)
            m_hat = adam_m[k] / (1 - beta1**t)
            v_hat = adam_v[k] / (1 - beta2**t)
            params[k] -= lr * m_hat / (np.sqrt(v_hat) + eps)

    val_acc = accuracy(X_val, y_val, params)
    if val_acc > best_val_acc:
        best_val_acc = val_acc
        best_params = {k: v.copy() for k, v in params.items()}
        epochs_without_improvement = 0
    else:
        epochs_without_improvement += 1
        if epochs_without_improvement >= patience:
            print(f"early stop at epoch {epoch}, best val accuracy {best_val_acc:.4f}")
            break

test_acc = accuracy(X_test, y_test, best_params)
print("held-out test accuracy:", test_acc)

weights = {
    "W1": best_params["W1"].round(5).tolist(),
    "b1": best_params["b1"].round(5).tolist(),
    "W2": best_params["W2"].round(5).tolist(),
    "b2": best_params["b2"].round(5).tolist(),
    "meta": {
        "accuracy": round(float(test_acc), 4),
        "trainedOn": "sklearn.datasets.load_digits (8x8, 1797 samples) + shift/dilate/erode augmentation",
    },
}

out_path = os.path.join(os.path.dirname(__file__), "..", "src", "data", "digitWeights.ts")
ts = f"""// trained offline on sklearn.datasets.load_digits (8x8, 1797 samples, no
// internet fetch, no paid API) with shift/dilate/erode augmentation to
// generalize to freehand canvas input — see scripts/train_digit_recognizer.py.
// held-out test accuracy: {weights["meta"]["accuracy"]}
export const digitWeights = {{
  W1: {json.dumps(weights["W1"])},
  b1: {json.dumps(weights["b1"])},
  W2: {json.dumps(weights["W2"])},
  b2: {json.dumps(weights["b2"])},
  meta: {json.dumps(weights["meta"])},
}} as const;
"""
with open(out_path, "w") as f:
    f.write(ts)
print("wrote", out_path)
