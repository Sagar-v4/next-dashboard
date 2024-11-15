import { Card } from "@/components/ui/card";
import { SearchCardForm } from "@/components/search-card";
import { LiveWatchListCard } from "@/components/liveSideWatchList/live-watchlist-card";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <section className="container flex w-screen gap-2 border-2 border-red-500">
        <div className="my-2 w-[25%] p-1 pb-1">
          <SearchCardForm />
          <LiveWatchListCard />
        </div>
        <div className="my-2 w-[75%] p-1 pb-1">
          <Card className="h-[calc(100vh-89px)] overflow-auto rounded-sm shadow-none">
            {children}
          </Card>
        </div>
      </section>
    </main>
  );
}
