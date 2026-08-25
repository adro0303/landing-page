"""Trains the tiny MLP baked into src/data/digitWeights.ts.

Offline only: sklearn.datasets.load_digits ships 1797 8x8 handwritten
digits with the scikit-learn package itself, no download. Requires
numpy + scikit-learn (dev-only, not a runtime dependency of the site):

    python3 -m venv .venv && .venv/bin/pip install numpy scikit-learn
    .venv/bin/python scripts/train_digit_recognizer.py
"""

import json
import os

import numpy as np
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split

rng = np.random.default_rng(0)

data = load_digits()
X = data.data / 16.0  # 0..1
y = data.target

Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, random_state=0, stratify=y)

n_in, n_hidden, n_out = 64, 32, 10


def one_hot(y, n):
    oh = np.zeros((len(y), n))
    oh[np.arange(len(y)), y] = 1
    return oh


W1 = rng.normal(0, np.sqrt(2 / n_in), (n_in, n_hidden))
b1 = np.zeros(n_hidden)
W2 = rng.normal(0, np.sqrt(2 / n_hidden), (n_hidden, n_out))
b2 = np.zeros(n_out)

Ytr = one_hot(ytr, n_out)
lr = 0.5
epochs = 400
n = len(Xtr)

for epoch in range(epochs):
    z1 = Xtr @ W1 + b1
    a1 = np.maximum(0, z1)
    z2 = a1 @ W2 + b2
    z2 -= z2.max(axis=1, keepdims=True)
    exp = np.exp(z2)
    probs = exp / exp.sum(axis=1, keepdims=True)

    dz2 = (probs - Ytr) / n
    dW2 = a1.T @ dz2
    db2 = dz2.sum(axis=0)
    da1 = dz2 @ W2.T
    dz1 = da1 * (z1 > 0)
    dW1 = Xtr.T @ dz1
    db1 = dz1.sum(axis=0)

    W1 -= lr * dW1
    b1 -= lr * db1
    W2 -= lr * dW2
    b2 -= lr * db2


def predict(X):
    a1 = np.maximum(0, X @ W1 + b1)
    z2 = a1 @ W2 + b2
    return z2.argmax(axis=1)


acc = (predict(Xte) == yte).mean()
print("test accuracy:", acc)

weights = {
    "W1": W1.round(5).tolist(),
    "b1": b1.round(5).tolist(),
    "W2": W2.round(5).tolist(),
    "b2": b2.round(5).tolist(),
    "meta": {
        "accuracy": round(float(acc), 4),
        "trainedOn": "sklearn.datasets.load_digits (8x8, 1797 samples)",
    },
}

out_path = os.path.join(os.path.dirname(__file__), "..", "src", "data", "digitWeights.ts")
ts = f"""// trained offline on sklearn.datasets.load_digits (8x8, 1797 samples, no
// internet fetch, no paid API) — see scripts/train_digit_recognizer.py.
// test accuracy: {weights["meta"]["accuracy"]}
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
