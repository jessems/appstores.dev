import { StoreCardData } from "@/types/store";
import { StoreCard } from "./StoreCard";

interface StoreGridProps {
  stores: StoreCardData[];
  emptyMessage?: string;
}

export function StoreGrid({
  stores,
  emptyMessage = "No stores found.",
}: StoreGridProps) {
  if (stores.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {stores.map((store) => (
        <StoreCard key={store.id} store={store} />
      ))}
    </div>
  );
}
