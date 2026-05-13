"use client";

import SignalCard, { type SignalCardData } from "@/components/SignalCard";
import SaveToWatchlistButton from "@/components/SaveToWatchlistButton";

interface Props {
  cards: SignalCardData[];
}

export default function SignalFeed({ cards }: Props) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
      {cards.map((card, i) => (
        <div key={i} className="relative">
          <SignalCard {...card} />
          {/* Save button overlaid in the footer area */}
          <div className="absolute bottom-[14px] right-[14px]">
            <SaveToWatchlistButton
              sport={card.sport}
              marketName={card.title}
              marketType={card.type}
              source={card.exchange}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
