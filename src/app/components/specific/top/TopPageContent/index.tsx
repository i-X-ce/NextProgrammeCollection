"use client";
// import styles from './style.module.css';

import TopContent from "@/app/components/common/TopContent";
import ProgramCardsSection from "../ProgramCardsSection";
import { useSearchParams } from "next/navigation";
import CopyrightFooter from "@/app/components/common/CopyrightFooter";

export default function TopPageContent() {
  const searchParams = useSearchParams();
  const user = searchParams.get("name") || "ア▶イス";

  return (
    <div>
      <TopContent
        title={user}
        subTitle="programme-collection"
        description="どうもこんにちは。丹精込めて作ったプロダクト達です。"
      />
      <ProgramCardsSection />
      <CopyrightFooter year={2025} />
    </div>
  );
}
