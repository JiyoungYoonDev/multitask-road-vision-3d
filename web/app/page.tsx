import Image from "next/image";
import SceneExplorer from "./components/SceneExplorer";
import FailureGallery from "./components/FailureGallery";
import ClassImbalance from "./components/ClassImbalance";
import ClassWeightComparison from "./components/ClassWeightComparison";
import ArchitectureExplorer from "./components/ArchitectureExplorer";
import Footer from "./components/Footer";

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
      {/* 01 — Hero: full-bleed frame + the question the rest of the page answers */}
      <section className="relative flex min-h-[85vh] w-full items-end justify-center overflow-hidden">
        <Image
          src="/images/sample-input.png"
          alt="a racing-kart camera frame"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
        <div className="relative flex w-full max-w-4xl flex-col gap-4 px-6 pb-20 text-center sm:text-left">
          <p className="text-sm font-medium uppercase tracking-widest text-zinc-300">
            Multitask Road Vision
          </p>
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
          description="Training both tasks together is cheaper than training two separate models, and each task nudges the shared features to be more useful for the other."
        >
          <ArchitectureExplorer />
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

      <Footer />
    </div>
  );
}
