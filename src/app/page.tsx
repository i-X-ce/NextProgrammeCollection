import { Suspense } from "react";
import TopPageContent from "./components/specific/top/TopPageContent";

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TopPageContent />
    </Suspense>
  );
}
