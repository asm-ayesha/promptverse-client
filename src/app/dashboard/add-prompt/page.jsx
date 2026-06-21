"use client";

import { useRouter } from "next/navigation";
import PageHeader from "@/components/dashboard/PageHeader";
import PromptForm from "@/components/dashboard/PromptForm";

export default function AddPromptPage() {
  const router = useRouter();
  return (
    <div>
      <PageHeader
        title="Add a Prompt"
        subtitle="Share your prompt with the community. It will be reviewed before going live."
      />
      <PromptForm onSuccess={() => router.push("/dashboard/my-prompts")} />
    </div>
  );
}
