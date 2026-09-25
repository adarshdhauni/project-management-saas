const WorkspaceSkeleton = () => {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <section className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <div className="size-12 shrink-0 animate-pulse rounded-xl bg-muted" />

          <div className="min-w-0 space-y-2">
            <div className="h-3 w-20 animate-pulse rounded bg-muted" />
            <div className="h-7 w-48 max-w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-72 max-w-full animate-pulse rounded bg-muted" />
          </div>
        </div>

        <div className="h-9 w-full animate-pulse rounded-md bg-muted sm:w-32" />
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between p-5">
              <div className="space-y-2">
                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                <div className="h-8 w-12 animate-pulse rounded bg-muted" />
                <div className="h-3 w-32 animate-pulse rounded bg-muted" />
              </div>

              <div className="size-10 animate-pulse rounded-lg bg-muted" />
            </div>
          </div>
        ))}
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(300px,0.8fr)]">
        <section className="min-w-0">
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
              <div className="space-y-2">
                <div className="h-4 w-28 animate-pulse rounded bg-muted" />
                <div className="h-3 w-64 max-w-full animate-pulse rounded bg-muted" />
              </div>

              <div className="h-4 w-16 animate-pulse rounded bg-muted" />
            </div>

            <div className="divide-y divide-border">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="px-5 py-4 sm:px-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="size-9 shrink-0 animate-pulse rounded-lg bg-muted" />

                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="h-4 w-36 max-w-[70%] animate-pulse rounded bg-muted" />

                        <div className="h-3 w-64 max-w-full animate-pulse rounded bg-muted" />
                      </div>
                    </div>

                    <div className="size-4 shrink-0 animate-pulse rounded bg-muted" />
                  </div>

                  <div className="mt-3 h-3 w-20 animate-pulse rounded bg-muted" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="min-w-0">
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex items-center gap-3 border-b border-border px-5 py-4 sm:px-6">
              <div className="size-8 shrink-0 animate-pulse rounded-lg bg-muted" />

              <div className="space-y-2">
                <div className="h-4 w-28 animate-pulse rounded bg-muted" />
                <div className="h-3 w-40 animate-pulse rounded bg-muted" />
              </div>
            </div>

            <div className="divide-y divide-border px-5 sm:px-6">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex gap-3 py-4">
                  <div className="size-8 shrink-0 animate-pulse rounded-full bg-muted" />

                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-3 w-full max-w-56 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-12 animate-pulse rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default WorkspaceSkeleton;
