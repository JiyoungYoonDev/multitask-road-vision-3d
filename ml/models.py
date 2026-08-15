from pathlib import Path

import torch
import torch.nn as nn

HOMEWORK_DIR = Path(__file__).resolve().parent
INPUT_MEAN = [0.2788, 0.2657, 0.2629]
INPUT_STD = [0.2064, 0.1944, 0.2252]


class Classifier(nn.Module):
    def __init__(
        self,
        in_channels: int = 3,
        num_classes: int = 6,
        kernel_size: int = 3,
        layers = [16, 32, 64]
    ):
        """
        A convolutional network for image classification.

        Args:
            in_channels: int, number of input channels
            num_classes: int
        """
        super().__init__()

        self.register_buffer("input_mean", torch.as_tensor(INPUT_MEAN))
        self.register_buffer("input_std", torch.as_tensor(INPUT_STD))

        # TODO: implement
        cnn_layers = []
        c1 = in_channels

        for c2 in layers:
            cnn_layers.append(nn.Conv2d(c1, c2, kernel_size, 2, (kernel_size - 1) // 2))
            cnn_layers.append(nn.ReLU())
            c1 = c2
        self.net = nn.Sequential(*cnn_layers)
        self.flatten = nn.Flatten()
        self.classifier = nn.Linear(64*8*8, num_classes)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """
        Args:
            x: tensor (b, 3, h, w) image

        Returns:
            tensor (b, num_classes) logits - b is the batch size
        """
        # optional: normalizes the input
        z = (x - self.input_mean[None, :, None, None]) / self.input_std[None, :, None, None]

        # TODO: replace with actual forward pass
        z = self.net(z)
        z = self.flatten(z)
        logits = self.classifier(z)

        return logits

    def predict(self, x: torch.Tensor) -> torch.Tensor:
        """
        Used for inference, returns class labels
        This is what the AccuracyMetric uses as input (this is what the grader will use!).
        You should not have to modify this function.

        Args:
            x (torch.FloatTensor): image with shape (b, 3, h, w) and vals in [0, 1]

        Returns:
            pred (torch.LongTensor): class labels {0, 1, ..., 5} with shape (b, h, w)
        """
        return self(x).argmax(dim=1)


class Detector(torch.nn.Module):
    def __init__(
        self,
        in_channels: int = 3,
        num_classes: int = 3,
    ):
        """
        A single model that performs segmentation and depth regression

        Args:
            in_channels: int, number of input channels
            num_classes: int
        """
        super().__init__()

        self.register_buffer("input_mean", torch.as_tensor(INPUT_MEAN))
        self.register_buffer("input_std", torch.as_tensor(INPUT_STD))

        # TODO: implement
        down_1 = []
        down_2 = []
        down_3 = []

        # DOWN_1
        down_1.append(nn.Conv2d(in_channels, 16, 3, 2, (3 - 1)// 2))
        down_1.append(nn.BatchNorm2d(16))
        down_1.append(nn.ReLU())

        down_1.append(nn.Conv2d(16, 16, 3, padding=1))
        down_1.append(nn.BatchNorm2d(16))
        down_1.append(nn.ReLU())
        self.down1 = nn.Sequential(*down_1)

        # DOWN_2
        down_2.append(nn.Conv2d(16, 32, 3, 2, (3 - 1)// 2))
        down_2.append(nn.BatchNorm2d(32))
        down_2.append(nn.ReLU())

        down_2.append(nn.Conv2d(32, 32, 3, padding=1))
        down_2.append(nn.BatchNorm2d(32))
        down_2.append(nn.ReLU())
        self.down2 = nn.Sequential(*down_2)

        # DOWN_3
        down_3.append(nn.Conv2d(32, 64, 3, 2, (3 - 1)// 2))
        down_3.append(nn.BatchNorm2d(64))
        down_3.append(nn.ReLU())

        down_3.append(nn.Conv2d(64, 64, 3, padding=1))
        down_3.append(nn.BatchNorm2d(64))
        down_3.append(nn.ReLU())
        self.down3 = nn.Sequential(*down_3)

        seg_up_1 = []
        seg_up_2 = []
        seg_refine_1 = []
        seg_refine_2 = []

        # SEG UP 1
        seg_up_1.append(nn.ConvTranspose2d(64, 32, 3, 2, 1, 1))
        seg_up_1.append(nn.BatchNorm2d(32))
        seg_up_1.append(nn.ReLU())
        self.seg_up1 = nn.Sequential(*seg_up_1)

        # SEG REFINE 1
        seg_refine_1.append(nn.Conv2d(32, 32, 3, padding=1))
        seg_refine_1.append(nn.BatchNorm2d(32))
        seg_refine_1.append(nn.ReLU())
        self.seg_refine1 = nn.Sequential(*seg_refine_1)

        # SEG UP 2
        seg_up_2.append(nn.ConvTranspose2d(32, 16, 3, 2, 1, 1))
        seg_up_2.append(nn.BatchNorm2d(16))
        seg_up_2.append(nn.ReLU())
        self.seg_up2 = nn.Sequential(*seg_up_2)

        # SEG REFINE 2
        seg_refine_2.append(nn.Conv2d(16, 16, 3, padding=1))
        seg_refine_2.append(nn.BatchNorm2d(16))
        seg_refine_2.append(nn.ReLU())
        self.seg_refine2 = nn.Sequential(*seg_refine_2)

        # SEG OUTPUT
        self.seg_output = nn.ConvTranspose2d(
        16,
        num_classes,
        kernel_size=3,
        stride=2,
        padding=1,
        output_padding=1,
        )

        #---------------------------------------------------#
        depth_up_1 = []
        depth_up_2 = []
        depth_refine_1 = []
        depth_refine_2 = []
        
        # DEPTH UP 1
        depth_up_1.append(nn.ConvTranspose2d(64, 32, 3, 2, 1, 1))
        depth_up_1.append(nn.BatchNorm2d(32))
        depth_up_1.append(nn.ReLU())
        self.depth_up1 = nn.Sequential(*depth_up_1)

        # DEPTH REFINE 1
        depth_refine_1.append(nn.Conv2d(32, 32, 3, padding=1))
        depth_refine_1.append(nn.BatchNorm2d(32))
        depth_refine_1.append(nn.ReLU())
        self.depth_refine1 = nn.Sequential(*depth_refine_1)

        # DEPTH UP 2
        depth_up_2.append(nn.ConvTranspose2d(32, 16, 3, 2, 1, 1))
        depth_up_2.append(nn.BatchNorm2d(16))
        depth_up_2.append(nn.ReLU())
        self.depth_up2 = nn.Sequential(*depth_up_2)

        # DEPTH REFINE 2
        depth_refine_2.append(nn.Conv2d(16, 16, 3, padding=1))
        depth_refine_2.append(nn.BatchNorm2d(16))
        depth_refine_2.append(nn.ReLU())
        self.depth_refine2 = nn.Sequential(*depth_refine_2)

        # DEPTH OUTPUT
        self.depth_output = nn.ConvTranspose2d(
            16,
            1,
            kernel_size=3,
            stride=2,
            padding=1,
            output_padding=1,
        )

        self.relu = nn.ReLU()
        pass

    def forward(self, x: torch.Tensor) -> tuple[torch.Tensor, torch.Tensor]:
        """
        Used in training, takes an image and returns raw logits and raw depth.
        This is what the loss functions use as input.

        Args:
            x (torch.FloatTensor): image with shape (b, 3, h, w) and vals in [0, 1]

        Returns:
            tuple of (torch.FloatTensor, torch.FloatTensor):
                - logits (b, num_classes, h, w)
                - depth (b, h, w)
        """
        # optional: normalizes the input
        z = (x - self.input_mean[None, :, None, None]) / self.input_std[None, :, None, None]
        # TODO: replace with actual forward pass

        # Encoder
        feature1 = self.down1(z)
        # [B, 16, 32, 32]

        feature2 = self.down2(feature1)
        # [B, 32, 16, 16]

        feature3 = self.down3(feature2)
        # [B, 64, 8, 8]

        # Segmentation decoder
        seg_feature = self.seg_up1(feature3)
        # [B, 32, 16, 16]

        seg_feature = self.relu(seg_feature + feature2)
        seg_feature = self.seg_refine1(seg_feature)

        seg_feature = self.seg_up2(seg_feature)
        # [B, 16, 32, 32]

        seg_feature = self.relu(seg_feature + feature1)
        seg_feature = self.seg_refine2(seg_feature)

        logits = self.seg_output(seg_feature)
        # [B, 3, 64, 64]

        # Depth decoder
        depth_feature = self.depth_up1(feature3)
        # [B, 32, 16, 16]

        depth_feature = self.relu(depth_feature + feature2)
        depth_feature = self.depth_refine1(depth_feature)

        depth_feature = self.depth_up2(depth_feature)
        # [B, 16, 32, 32]

        depth_feature = self.relu(depth_feature + feature1)
        depth_feature = self.depth_refine2(depth_feature)

        raw_depth = self.depth_output(depth_feature)
        # [B, 1, 64, 64]

        raw_depth = torch.sigmoid(raw_depth).squeeze(dim=1)
        # [B, 64, 64]

        return logits, raw_depth

    def predict(self, x: torch.Tensor) -> tuple[torch.Tensor, torch.Tensor]:
        """
        Used for inference, takes an image and returns class labels and normalized depth.
        This is what the metrics use as input (this is what the grader will use!).

        Args:
            x (torch.FloatTensor): image with shape (b, 3, h, w) and vals in [0, 1]

        Returns:
            tuple of (torch.LongTensor, torch.FloatTensor):
                - pred: class labels {0, 1, 2} with shape (b, h, w)
                - depth: normalized depth [0, 1] with shape (b, h, w)
        """
        logits, raw_depth = self(x)
        pred = logits.argmax(dim=1)

        # Optional additional post-processing for depth only if needed
        depth = raw_depth

        return pred, depth


MODEL_FACTORY = {
    "classifier": Classifier,
    "detector": Detector,
}


def load_model(
    model_name: str,
    with_weights: bool = False,
    **model_kwargs,
) -> torch.nn.Module:
    """
    Called by the grader to load a pre-trained model by name
    """
    m = MODEL_FACTORY[model_name](**model_kwargs)

    if with_weights:
        model_path = HOMEWORK_DIR / f"{model_name}.th"
        assert model_path.exists(), f"{model_path.name} not found"

        try:
            m.load_state_dict(torch.load(model_path, map_location="cpu"))
        except RuntimeError as e:
            raise AssertionError(
                f"Failed to load {model_path.name}, make sure the default model arguments are set correctly"
            ) from e

    # limit model sizes since they will be zipped and submitted
    model_size_mb = calculate_model_size_mb(m)

    if model_size_mb > 20:
        raise AssertionError(f"{model_name} is too large: {model_size_mb:.2f} MB")

    return m


def save_model(model: torch.nn.Module) -> str:
    """
    Use this function to save your model in train.py
    """
    model_name = None

    for n, m in MODEL_FACTORY.items():
        if type(model) is m:
            model_name = n

    if model_name is None:
        raise ValueError(f"Model type '{str(type(model))}' not supported")

    output_path = HOMEWORK_DIR / f"{model_name}.th"
    torch.save(model.state_dict(), output_path)

    return output_path


def calculate_model_size_mb(model: torch.nn.Module) -> float:
    """
    Args:
        model: torch.nn.Module

    Returns:
        float, size in megabytes
    """
    return sum(p.numel() for p in model.parameters()) * 4 / 1024 / 1024


def debug_model(batch_size: int = 1):
    """
    Test your model implementation

    Feel free to add additional checks to this function -
    this function is NOT used for grading
    """
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    sample_batch = torch.rand(batch_size, 3, 64, 64).to(device)

    print(f"Input shape: {sample_batch.shape}")

    model = load_model("classifier", in_channels=3, num_classes=6).to(device)
    output = model(sample_batch)

    # should output logits (b, num_classes)
    print(f"Output shape: {output.shape}")


if __name__ == "__main__":
    debug_model()
