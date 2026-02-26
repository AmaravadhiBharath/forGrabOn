export type DiscountType = "percentage" | "flat";

export type Channel =
  | "email"
  | "whatsapp"
  | "push"
  | "glance"
  | "payu"
  | "instagram";

export type VariantKind = "urgency" | "value" | "social_proof";

export type Language = "en" | "hi" | "te";

export interface DealInput {
  merchant_id: string;
  category: string;
  discount_value: number;
  discount_type: DiscountType;
  expiry_timestamp: string;
  min_order_value: number;
  max_redemptions: number;
  exclusive_flag: boolean;
}

export interface CopyVariant {
  channel: Channel;
  variant: VariantKind;
  language: Language;
  text: string;
}

export type DeliveryStatus = "delivered" | "failed" | "pending";

export interface DeliveryLogEntry {
  id: string;
  channel: Channel;
  language: Language;
  variant: VariantKind;
  attempt: number;
  status: DeliveryStatus;
  timestamp: string;
  error: string | undefined;
}

export interface ChannelSuccessSummary {
  channel: Channel;
  successRate: number;
  delivered: number;
  failed: number;
  total: number;
}

export interface DistributeDealResult {
  deal: DealInput;
  variants: CopyVariant[];
  deliveryLogs: DeliveryLogEntry[];
  channelSummary: ChannelSuccessSummary[];
  processingTimeMs?: number;
  deliveryDuration?: string;
  generationMethod?: "Claude AI (Dynamic)" | "Native Engine (Deterministic Simulation)";
}

