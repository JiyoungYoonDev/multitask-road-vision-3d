import json
import time
from pathlib import Path

import numpy as np
import torch

from models import Detector, save_model
from datasets.road_dataset import load_data
from metrics import DetectionMetric


def train(num_epoch: int = 20, lr: float = 1e-3, batch_size: int = 128, seed: int = 2024):
    if torch.cuda.is_available():
        device = torch.device("cuda")
    elif torch.backends.mps.is_available():
        device = torch.device("mps")
    else:
        device = torch.device("cpu")
    print("device:", device)

    torch.manual_seed(seed)
    np.random.seed(seed)

    model = Detector().to(device)
    model.train()

    train_data = load_data("drive_data/train", shuffle=True, batch_size=batch_size, num_workers=2)
    val_data = load_data("drive_data/val", shuffle=False)

    class_weights = torch.tensor([1.0, 10.0, 10.0], dtype=torch.float32, device=device)
    loss_func = torch.nn.CrossEntropyLoss(weight=class_weights)
    regres_func = torch.nn.MSELoss()

    optimizer = torch.optim.AdamW(model.parameters(), lr=lr, weight_decay=1e-4)

    best_iou = float("-inf")
    val_metric = DetectionMetric(num_classes=3)
    curve = []

    for epoch in range(num_epoch):
        t0 = time.time()
        model.train()
        for batch in train_data:
            img = batch["image"].to(device)
            track = batch["track"].to(device)
            depth = batch["depth"].to(device)

            logits, raw_depth = model(img)
            loss = loss_func(logits, track) + regres_func(raw_depth, depth)

            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

        model.eval()
        val_metric.reset()
        with torch.no_grad():
            for batch in val_data:
                img = batch["image"].to(device)
                track = batch["track"].to(device)
                depth = batch["depth"].to(device)

                pred, depth_pred = model.predict(img)
                val_metric.add(pred, track, depth_pred, depth)

        metrics = val_metric.compute()
        print(f"epoch {epoch+1}/{num_epoch}  iou={metrics['iou']:.4f}  "
              f"depth_error={metrics['abs_depth_error']:.4f}  "
              f"tp_depth_error={metrics['tp_depth_error']:.4f}  "
              f"({time.time()-t0:.1f}s)")

        curve.append({"epoch": epoch + 1, "iou": metrics["iou"]})

        if metrics["iou"] > best_iou:
            best_iou = metrics["iou"]

    torch.save(model.state_dict(), "detector_weighted_20ep.th")
    with open("../web/public/data/weighted-curve.json", "w") as f:
        json.dump(curve, f)
    print("saved detector_weighted_20ep.th, best val iou:", best_iou)


if __name__ == "__main__":
    train()
