import Image from "next/image";
import SceneExplorer from "./components/SceneExplorer";
import FailureGallery from "./components/FailureGallery";
import ClassImbalance from "./components/ClassImbalance";
import ClassWeightComparison from "./components/ClassWeightComparison";
import ArchitectureExplorer from "./components/ArchitectureExplorer";
import Footer from "./components/Footer";
import PerformanceBadges from "./components/PerformanceBadges";
import Header from "./components/Header";

function Section({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: React.ReactNode;
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
      {/* 01 — Hero: full-bleed frame + the question the rest of the page answers */}
      <section className="relative flex min-h-[85vh] w-full items-end justify-center overflow-hidden">
        <Header />
        <Image
          src="/images/sample-input.png"
          alt="a racing-kart camera frame"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
        <div className="relative flex w-full max-w-4xl flex-col gap-4 px-6 pb-20 text-center sm:text-left">
          <h1 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
            Can a CNN understand both what something is and where it is?
          </h1>
          <p className="text-lg text-zinc-300">Find out ↓</p>
        </div>
      </section>

      <main className="flex w-full max-w-4xl flex-1 flex-col px-6">
        {/* 02+03+04 — What does the model see / touch a pixel / step into the scene, unified */}
        <Section
          eyebrow="What does the model see?"
          title="One frame, four ways to look at it"
        >
          <SceneExplorer />
        </Section>

        <p className="max-w-2xl border-t border-zinc-200 pt-10 text-lg leading-7 text-zinc-500 italic dark:border-zinc-900 dark:text-zinc-500">
          But both answers — what, and how far — came from the same shared
          visual features. One encoder, not two.
        </p>

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
          description={
            <>
              Training both tasks together is cheaper than training two
              separate models, and each task nudges the shared features to
              be more useful for the other. Optimized jointly on{" "}
              <span className="font-mono italic">
                𝓛<sub>total</sub> = 𝓛<sub>seg</sub> + λ·𝓛<sub>depth</sub>
              </span>{" "}
              (λ = 1).
            </>
          }
        >
          <ArchitectureExplorer />
          <PerformanceBadges />
        </Section>

        {/* 09 — What I learned */}
        <Section eyebrow="What I learned" title="Reflection">
          <div className="flex flex-col gap-4">
            {[
              {
                tag: "Surprise",
                headline: "A filter learned to find my own kart — unprompted.",
                body: (
                  <>
                    One <code className="font-mono">down3</code> channel lit
                    up almost exactly on the kart, while{" "}
                    <code className="font-mono">down1</code> filters were
                    broad, generic edge detectors. Watching that shift —
                    edge detector to object locator, across three
                    downsampling steps — made the encoder feel less like a
                    black box.
                  </>
                ),
              },
              {
                tag: "Lesson",
                headline:
                  "Class imbalance slows down when the model learns minority classes — not whether it does.",
                body: (
                  <>
                    I expected training without{" "}
                    <code className="font-mono">class_weights=[1,10,10]</code>{" "}
                    to just fail on the boundary classes. It didn&apos;t —
                    it eventually caught up, and even edged ahead by epoch
                    20. What weighting actually bought was a faster, safer
                    start (see the convergence chart above).
                  </>
                ),
              },
              {
                tag: "Next",
                headline: "Depth-ablation, and a second test image.",
                body: (
                  <>
                    Train shallower encoders (one or two down-blocks instead
                    of three) to see how much the third downsampling stage
                    actually buys, and extend the pixel inspector past one
                    static frame.
                  </>
                ),
              },
            ].map((item) => (
              <div
                key={item.tag}
                className="flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <span className="w-fit rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                  {item.tag}
                </span>
                <p className="text-lg font-semibold leading-snug text-zinc-950 dark:text-zinc-50">
                  {item.headline}
                </p>
                <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <div className="h-16" />
      </main>

      <Footer />
    </div>
  );
}
