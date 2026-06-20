"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { campaignsApi } from "@/lib/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants";

export function useCampaigns(params?: { status?: string; platform?: string }) {
  return useQuery({
    queryKey: ["campaigns", params],
    queryFn:  () => campaignsApi.list(params).then((r) => r.data.data),
  });
}

export function useCampaign(id: string) {
  return useQuery({
    queryKey: ["campaign", id],
    queryFn:  () => campaignsApi.get(id).then((r) => r.data.data),
    enabled:  !!id,
  });
}

export function useCreateCampaign() {
  const qc = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (data: unknown) => campaignsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["campaigns"] });
      toast.success("Campaign posted successfully!");
      router.push(ROUTES.brand.campaigns);
    },
    onError: () => toast.error("Failed to create campaign"),
  });
}
