import Image from "next/image";
import Architecture from "./components/Architecture";
import PointCloud from "./components/PointCloudLoader";
import PixelInspector from "./components/PixelInspector";
import FailureGallery from "./components/FailureGallery";
import ClassImbalance from "./components/ClassImbalance";
import ClassWeightComparison from "./components/ClassWeightComparison";

const panels = [
  {
    src: "/images/sample-input.png",
    label: "Input",
    caption: "raw camera frame",
  },
  {
    src: "/images/sample-segmentation.png",
    label: "Segmentation",
    caption: "road vs. track boundary, per pixel",
  },
  {
    src: "/images/sample-depth.png",
    label: "Depth",
    caption: "predicted distance, per pixel",
  },
];

function Section({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex w-full max-w-4xl flex-col gap-8 border-t border-zinc-200 py-20 first:border-t-0 dark:border-zinc-900">
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          {eyebrow}
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="max-w-2xl text-lg leading-7 text-zinc-600 dark:text-zinc-400">
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 dark:bg-black">
      <main className="flex w-full max-w-4xl flex-1 flex-col px-6">
        {/* 01 — Hero */}
        <section className="flex min-h-[70vh] w-full flex-col justify-center gap-4 py-24">
          <p className="text-sm font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            Multitask Road Vision
          </p>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-5xl">
            One CNN. Two questions about every pixel.
          </h1>
          <p className="max-w-xl text-lg leading-7 text-zinc-600 dark:text-zinc-400">
            A single convolutional network that looks at one racing-kart
            camera frame and answers, for every pixel: what is this (road,
            boundary, background), and how far away is it.
          </p>
        </section>

        {/* 02 — What does the model see */}
        <Section
          eyebrow="What does the model see?"
          title="RGB → Segmentation → Depth"
          description="Same input, two decoder heads, two very different questions answered from the same shared features."
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {panels.map((panel) => (
              <div
                key={panel.label}
                className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900">
                  <Image
                    src={panel.src}
                    alt={panel.label}
                    width={640}
                    height={480}
                    className="h-auto w-full"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                    {panel.label}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {panel.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* 03 — Touch a pixel */}
        <Section
          eyebrow="Touch a pixel"
          title="Pixel Inspector"
          description="Hover anywhere on the frame to read out that exact pixel's predicted class and depth — the same two numbers every pixel in the image above was reduced to."
        >
          <PixelInspector />
        </Section>

        {/* 04 — Step into the scene */}
        <Section
          eyebrow="Step into the scene"
          title="Segmentation + depth → a 3D scene"
          description="Every pixel's predicted depth pushes it back in space; its original color comes along for the ride. Drag to orbit, scroll to zoom — this is one predicted frame, reconstructed from a single 2D image."
        >
          <div className="h-[480px] w-full overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950">
            <PointCloud />
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Note: depth is relative, not metric — there&apos;s no camera
            calibration here, so treat the 3D shape as illustrative rather
            than measured.
          </p>
        </Section>

        {/* 05 — Break the model */}
        <Section
          eyebrow="Break the model"
          title="Where segmentation fails"
          description="Ranked the full validation split by per-frame IoU. These are the three worst frames (plus one strong frame for contrast) — the model confuses boundary pixels for background most often at sharp turns and low contrast."
        >
          <FailureGallery />
        </Section>

        {/* 06 — Why did it fail */}
        <Section
          eyebrow="Why did it fail?"
          title="Class imbalance"
          description="One likely cause: the three classes are wildly unbalanced in the training data itself."
        >
          <ClassImbalance />
        </Section>

        {/* 07 — Fix the training */}
        <Section
          eyebrow="Fix the training"
          title="Before / after class weights"
          description="Trained a second Detector from scratch, identical setup, but with plain CrossEntropyLoss instead of the weighted [1, 10, 10] version. Same validation split, per-class IoU."
        >
          <ClassWeightComparison />
        </Section>

        {/* 08 — Two brains, one network */}
        <Section
          eyebrow="Two brains, one network"
          title="A shared encoder, two decoder heads"
          description="The encoder (down1 → down3) is reused for both tasks. Only the last few layers branch off into a segmentation head and a depth head — training both together is cheaper than training two separate models, and each task nudges the shared features to be more useful."
        >
          <Architecture />
        </Section>

        {/* 09 — What I learned */}
        <Section eyebrow="What I learned" title="Reflection">
          <div className="flex max-w-2xl flex-col gap-4 text-lg leading-7 text-zinc-600 dark:text-zinc-400">
            <p>
              The most surprising moment was running a single channel from{" "}
              <code className="font-mono text-sm">down3</code> back through
              the network and seeing it light up almost exactly on top of my
              own kart in the frame — nobody labeled &quot;find the kart&quot;
              anywhere in training, the network just found that a useful
              thing to track on its own. Earlier layers were the opposite:
              broad, edge-like responses everywhere, some channels dead for a
              given image, some blurry. Watching that shift from
              &quot;generic edge detector&quot; to &quot;specific object
              locator&quot; across three downsampling steps made the encoder
              feel a lot less like a black box.
            </p>
            <p>
              Class imbalance taught me to be more careful with my own
              intuition. I expected training without{" "}
              <code className="font-mono text-sm">class_weights=[1,10,10]</code>{" "}
              to just fail on the boundary classes. It didn&apos;t — given 20
              epochs it got close to the weighted model&apos;s final IoU. What
              the weighting actually fixed was the first several epochs,
              where the unweighted model was stuck only predicting
              background. So the real lesson wasn&apos;t &quot;imbalance
              breaks the model,&quot; it was &quot;imbalance slows down
              *when* the model finds the minority classes&quot; — a smaller
              effect than I assumed, but a real one, and one I only found
              because I ran the comparison instead of trusting my guess.
            </p>
            <p>
              Next I&apos;d want to try the depth-ablation idea I scoped
              earlier but didn&apos;t build — training shallower encoders
              (one or two down-blocks instead of three) to see how much
              detail that third downsampling stage is actually buying, and
              extending the pixel inspector to a second image so the failure
              cases aren&apos;t just static screenshots.
            </p>
          </div>
        </Section>

        <div className="h-16" />
      </main>
    </div>
  );
}
