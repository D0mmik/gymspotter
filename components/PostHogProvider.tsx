"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";
import { useEffect, createContext, useContext, useState, ReactNode, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Initialize PostHog
if (typeof window !== "undefined") {
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (posthogKey) {
    posthog.init(posthogKey, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com",
      person_profiles: "identified_only",
      capture_pageview: false, // We'll capture manually
      capture_pageleave: true,
      persistence: "localStorage",
    });
  }
}

// Page view tracker component
function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthogClient = usePostHog();

  useEffect(() => {
    if (pathname && posthogClient) {
      let url = window.origin + pathname;
      if (searchParams.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      posthogClient.capture("$pageview", { $current_url: url });
    }
  }, [pathname, searchParams, posthogClient]);

  return null;
}

// Feature flags context
type FeatureFlagsContextType = {
  isFeatureEnabled: (flag: string) => boolean;
  isLoading: boolean;
};

const FeatureFlagsContext = createContext<FeatureFlagsContextType>({
  isFeatureEnabled: () => false,
  isLoading: true,
});

export function useFeatureFlag(flag: string): boolean {
  const { isFeatureEnabled, isLoading } = useContext(FeatureFlagsContext);
  // Return false while loading to be safe
  if (isLoading) return false;
  return isFeatureEnabled(flag);
}

export function useFeatureFlags() {
  return useContext(FeatureFlagsContext);
}

// Feature flags provider that waits for flags to load
function FeatureFlagsProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [flags, setFlags] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Check if PostHog is initialized
    if (typeof window === "undefined" || !process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      setIsLoading(false);
      return;
    }

    // Wait for feature flags to load
    posthog.onFeatureFlags(() => {
      const allFlags = posthog.featureFlags.getFlagVariants();
      const booleanFlags: Record<string, boolean> = {};
      
      for (const [key, value] of Object.entries(allFlags || {})) {
        booleanFlags[key] = !!value;
      }
      
      setFlags(booleanFlags);
      setIsLoading(false);
    });

    // Fallback timeout in case flags never load
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  const isFeatureEnabled = (flag: string): boolean => {
    return flags[flag] ?? false;
  };

  return (
    <FeatureFlagsContext.Provider value={{ isFeatureEnabled, isLoading }}>
      {children}
    </FeatureFlagsContext.Provider>
  );
}

// Main provider
export function PostHogProvider({ children }: { children: ReactNode }) {
  // If no PostHog key, just render children
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return (
      <FeatureFlagsContext.Provider value={{ isFeatureEnabled: () => false, isLoading: false }}>
        {children}
      </FeatureFlagsContext.Provider>
    );
  }

  return (
    <PHProvider client={posthog}>
      <FeatureFlagsProvider>
        <Suspense fallback={null}>
          <PostHogPageView />
        </Suspense>
        {children}
      </FeatureFlagsProvider>
    </PHProvider>
  );
}

// Export posthog for direct event tracking
export { posthog };
