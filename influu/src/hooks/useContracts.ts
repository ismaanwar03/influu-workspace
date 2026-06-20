"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contractsApi } from "@/lib/api";
import toast from "react-hot-toast";

export function useContracts(params?: { status?: string }) {
  return useQuery({
    queryKey: ["contracts", params],
    queryFn:  () => contractsApi.list(params).then((r) => r.data.data),
  });
}

export function useContract(id: string) {
  return useQuery({
    queryKey: ["contract", id],
    queryFn:  () => contractsApi.get(id).then((r) => r.data.data),
    enabled:  !!id,
  });
}

export function useReviewDraft() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      contractId, draftId, decision, feedback,
    }: { contractId: string; draftId: string; decision: "approve" | "request_revision"; feedback?: string }) =>
      contractsApi.reviewDraft(contractId, draftId, decision, feedback),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["contracts"] });
      toast.success("Decision submitted");
    },
    onError: () => toast.error("Something went wrong"),
  });
}

export function useSubmitDraft() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ contractId, data }: { contractId: string; data: FormData }) =>
      contractsApi.submitDraft(contractId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["contracts"] });
      toast.success("Draft submitted for review!");
    },
    onError: () => toast.error("Upload failed. Please try again."),
  });
}
