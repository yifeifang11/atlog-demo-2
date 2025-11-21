import { Suspense } from "react";
import ConfirmationCard from "../consent/ConfirmationCard";

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm text-sm text-slate-600">
          Loading confirmation...
        </div>
      }
    >
      <ConfirmationCard />
    </Suspense>
  );
}
