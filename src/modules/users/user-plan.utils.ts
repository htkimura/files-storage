export const USER_TIER = {
  FREE: 'free',
} as const;

export type UserTier = (typeof USER_TIER)[keyof typeof USER_TIER];

export const DEFAULT_USER_TIER = USER_TIER.FREE;

export interface PlanDetails {
  storageLimit: number;
}

export const planDetailsMap: Record<UserTier, PlanDetails> = {
  [USER_TIER.FREE]: { storageLimit: 5_368_709_120 },
};

export function getPlanDetails(tier: string): PlanDetails {
  return planDetailsMap[tier as UserTier] ?? planDetailsMap[DEFAULT_USER_TIER];
}
