import { Skeleton } from '@/components/ui/skeleton'

export default function ProductLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="flex flex-col gap-4">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-20 rounded-md" />
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="mt-1 h-4 w-24" />

          <div className="mt-4">
            <Skeleton className="h-8 w-32" />
          </div>

          <div className="my-6 h-px bg-zinc-200" />

          <div className="space-y-4">
            <div>
              <Skeleton className="mb-2 h-4 w-16" />
              <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-16 rounded-md" />
                ))}
              </div>
            </div>
          </div>

          <div className="my-6 h-px bg-zinc-200" />

          <Skeleton className="h-12 w-full rounded-md" />

          <div className="my-6 h-px bg-zinc-200" />

          <div className="space-y-2">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    </div>
  )
}
