import json

import torch

from datasets.road_dataset import load_data
from models import Detector
from metrics import ConfusionMatrix


def per_class_iou(state_path):
    model = Detector()
    model.load_state_dict(torch.load(state_path, map_location="cpu"))
    model.eval()

    data = load_data("drive_data/val", shuffle=False, batch_size=64, num_workers=0)
    cm = ConfusionMatrix(num_classes=3)

    with torch.no_grad():
        for batch in data:
            pred = model.predict(batch["image"])[0]
            cm.add(pred, batch["track"])

    true_pos = cm.matrix.diagonal()
    class_iou = true_pos / (cm.matrix.sum(0) + cm.matrix.sum(1) - true_pos + 1e-5)
    return class_iou.tolist(), cm.compute()


if __name__ == "__main__":
    results = {}
    for name, path in [("with_weights", "detector.th"), ("no_weights", "detector_noweights.th")]:
        class_iou, overall = per_class_iou(path)
        results[name] = {"class_iou": class_iou, "overall": overall}
        print(name, "per-class IoU (bg, boundaryA, boundaryB):", [round(x, 4) for x in class_iou], "overall:", overall)

    with open("../web/public/data/class-weight-comparison.json", "w") as f:
        json.dump(results, f, indent=2)
