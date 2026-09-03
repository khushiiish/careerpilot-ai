import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between bg-white px-8 py-16 dark:bg-black sm:items-start sm:px-16 sm:py-24">
        <div className="flex w-full flex-col items-center gap-8 sm:items-start">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />

          <div className="flex flex-col gap-4 text-center sm:text-left">
            <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-black dark:text-zinc-50">
              Welcome to CareerPilot AI
            </h1>

            <p className="max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              Your AI-powered resume and job preparation platform.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              className="flex h-12 items-center justify-center rounded-full bg-black px-6 font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              Get Started
            </button>

            <button
              className="flex h-12 items-center justify-center rounded-full border border-zinc-200 px-6 font-medium text-black hover:bg-zinc-100 dark:border-zinc-800 dark:text-white dark:hover:bg-zinc-900"
            >
              Learn More
            </button>
          </div>
        </div>

        <footer className="mt-16 text-sm text-zinc-500">
          CareerPilot AI
        </footer>
      </main>
    </div>
  );
}