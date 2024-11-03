import { ToastProps } from "@/components/ui/toast";

export interface Toast {
  (props: { title?: string; description?: string; variant?: "default" | "destructive" }): void;
}