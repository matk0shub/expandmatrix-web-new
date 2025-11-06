import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const CAL_NAMESPACE = "strategy";
const CAL_LINK = "team/em-core/strategy";
const CAL_ORIGIN = "https://meet.expandmatrix.com";
const CAL_EMBED_URL = `${CAL_ORIGIN}/embed/embed.js`;

type CalStatus = "idle" | "preloading" | "ready" | "opening" | "error";

type IdleHandle = number | undefined;

type IdleWindow = Window & {
  requestIdleCallback?: (
    callback: (deadline: { didTimeout: boolean; timeRemaining: () => number }) => void,
    options?: { timeout?: number }
  ) => number;
  cancelIdleCallback?: (handle: number) => void;
};

type CalApiFn = {
  (method: string, ...args: unknown[]): void;
};

type UseCalEmbedOptions = {
  autoPrime?: boolean;
  autoPrimeDelay?: number;
  resourceHintsOnly?: boolean;
};

let calClientPromise: Promise<CalApiFn> | null = null;
let hasPrimedModal = false;
let resourceHintsInjected = false;

const calUiConfig = {
  hideEventTypeDetails: false,
  layout: "month_view" as const,
  theme: "dark" as const,
  colorScheme: "dark",
  styles: {
    branding: {
      brandColor: "#00d76b",
    },
    body: {
      background: "#050505",
    },
    eventTypeListItem: {
      background: "rgba(8, 8, 8, 0.85)",
      color: "#f0f8f5",
    },
    enabledDateButton: {
      background: "#00d76b",
      color: "#051b12",
    },
    disabledDateButton: {
      background: "rgba(20, 20, 20, 0.6)",
      color: "rgba(255, 255, 255, 0.24)",
    },
    availabilityDatePicker: {
      background: "#050505",
      color: "#e8f2ee",
    },
  },
  cssVarsPerTheme: {
    dark: {
      "--cal-border-radius": "22px",
      "--cal-border-color": "rgba(0, 0, 0, 0)",
      "--cal-border": "rgba(0, 0, 0, 0)",
      "--cal-border-muted": "rgba(0, 0, 0, 0)",
      "--cal-border-subtle": "rgba(0, 0, 0, 0)",
      "--cal-border-emphasis": "rgba(0, 0, 0, 0)",
      "--cal-border-booker": "rgba(0, 0, 0, 0)",
      "--cal-border-width": "0px",
      "--cal-text-color": "#f1f6f3",
      "--cal-brand": "#00d76b",
      "--cal-background": "#050505",
      "--cal-modal-box-shadow": "0 40px 120px rgba(0, 0, 0, 0.65)",
      "--cal-shadow": "0 40px 120px rgba(0, 0, 0, 0.65)",
      "--cal-font-family":
        "var(--font-lato, 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif)",
    },
    light: {
      "--cal-border-radius": "22px",
      "--cal-border-color": "rgba(0, 0, 0, 0.08)",
      "--cal-border": "rgba(0, 0, 0, 0.08)",
      "--cal-border-muted": "rgba(0, 0, 0, 0.06)",
      "--cal-border-subtle": "rgba(0, 0, 0, 0.04)",
      "--cal-border-emphasis": "rgba(0, 0, 0, 0.1)",
      "--cal-border-booker": "rgba(0, 0, 0, 0.08)",
      "--cal-border-width": "1px",
      "--cal-text-color": "#1a1a1a",
      "--cal-brand": "#00d76b",
      "--cal-background": "#ffffff",
      "--cal-modal-box-shadow": "0 30px 90px rgba(0, 0, 0, 0.12)",
      "--cal-shadow": "0 30px 90px rgba(0, 0, 0, 0.12)",
      "--cal-font-family":
        "var(--font-lato, 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif)",
    },
  },
};

const ensureResourceHints = () => {
  if (resourceHintsInjected || typeof document === "undefined") {
    return;
  }

  resourceHintsInjected = true;
  const head = document.head;

  const dnsPrefetch = document.createElement("link");
  dnsPrefetch.rel = "dns-prefetch";
  dnsPrefetch.href = CAL_ORIGIN;
  head.appendChild(dnsPrefetch);

  const preconnect = document.createElement("link");
  preconnect.rel = "preconnect";
  preconnect.href = CAL_ORIGIN;
  preconnect.crossOrigin = "anonymous";
  head.appendChild(preconnect);
};

const shouldDeferHeavyWork = () => {
  if (typeof navigator === "undefined") {
    return false;
  }

  const connection = (navigator as Navigator & {
    connection?: { saveData?: boolean };
  }).connection;

  return Boolean(connection?.saveData);
};

const ensureCalClient = async () => {
  if (typeof window === "undefined") {
    throw new Error("Cal embed requires a browser environment.");
  }

  if (calClientPromise) {
    return calClientPromise;
  }

  calClientPromise = import("@calcom/embed-react")
    .then(({ getCalApi }) => {
      return getCalApi({
        namespace: CAL_NAMESPACE,
        embedJsUrl: CAL_EMBED_URL,
      }) as Promise<unknown>;
    })
    .then((cal) => {
      const calFn = cal as CalApiFn;
      calFn("init", { origin: CAL_ORIGIN });
      calFn("ui", calUiConfig);
      return calFn;
    })
    .catch((error) => {
      calClientPromise = null;
      throw error;
    });

  return calClientPromise;
};

const preloadCalModal = async () => {
  const cal = await ensureCalClient();

  if (!hasPrimedModal) {
    try {
      cal("preload", {
        calLink: CAL_LINK,
        type: "modal",
        options: { prerenderIframe: true },
      });
      hasPrimedModal = true;
    } catch (error) {
      console.warn("Cal preloading failed:", error);
    }
  }

  return cal;
};

const openCalModal = async () => {
  const cal = await ensureCalClient();

  cal("modal", {
    calLink: CAL_LINK,
    calOrigin: CAL_ORIGIN,
    config: {
      layout: "month_view",
    },
  });

  return cal;
};

const scheduleIdle = (callback: () => void, timeout = 2000) => {
  if (typeof window === "undefined") {
    return () => {};
  }

  const idleWindow = window as IdleWindow;
  let idleHandle: IdleHandle;
  let timeoutHandle: number | undefined;

  if (typeof idleWindow.requestIdleCallback === "function") {
    idleHandle = idleWindow.requestIdleCallback(
      () => {
        callback();
      },
      { timeout }
    );
  } else {
    timeoutHandle = window.setTimeout(callback, timeout);
  }

  return () => {
    if (idleHandle && typeof idleWindow.cancelIdleCallback === "function") {
      idleWindow.cancelIdleCallback(idleHandle);
    }
    if (timeoutHandle) {
      window.clearTimeout(timeoutHandle);
    }
  };
};

export const useCalEmbed = (options: UseCalEmbedOptions = {}) => {
  const {
    autoPrime = false,
    autoPrimeDelay = 6000,
    resourceHintsOnly = false,
  } = options;
  const [status, setStatus] = useState<CalStatus>("idle");
  const mountedRef = useRef(true);
  const primingRef = useRef(false);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    ensureResourceHints();
  }, []);

  const setSafeStatus = useCallback(
    (next:
      | CalStatus
      | ((current: CalStatus) => CalStatus)) => {
      if (!mountedRef.current) {
        return;
      }

      setStatus((current) =>
        typeof next === "function" ? next(current) : next
      );
    },
    []
  );

  const primeCal = useCallback(async () => {
    if (resourceHintsOnly || shouldDeferHeavyWork() || primingRef.current || status === "ready") {
      return;
    }

    primingRef.current = true;
    setSafeStatus((current) =>
      current === "ready" ? current : "preloading"
    );

    try {
      ensureResourceHints();
      await preloadCalModal();
      setSafeStatus("ready");
    } catch (error) {
      console.warn("Failed to prepare Cal modal:", error);
      setSafeStatus("error");
    } finally {
      primingRef.current = false;
    }
  }, [resourceHintsOnly, setSafeStatus, status]);

  const openCal = useCallback(async () => {
    setSafeStatus("opening");

    try {
      ensureResourceHints();
      if (!hasPrimedModal) {
        await preloadCalModal();
      }
      await openCalModal();
      setSafeStatus("ready");
    } catch (error) {
      console.error("Cal modal failed to open:", error);
      setSafeStatus("error");
    }
  }, [setSafeStatus]);

  useEffect(() => {
    if (!autoPrime || resourceHintsOnly || shouldDeferHeavyWork()) {
      return;
    }

    const cancelIdle = scheduleIdle(() => {
      primeCal().catch(() => {
        /* already logged */
      });
    }, autoPrimeDelay);

    return cancelIdle;
  }, [autoPrime, autoPrimeDelay, primeCal, resourceHintsOnly]);

  const api = useMemo(
    () => ({
      status,
      primeCal,
      openCal,
      calLink: CAL_LINK,
    }),
    [status, primeCal, openCal]
  );

  return api;
};

export type UseCalEmbedReturn = ReturnType<typeof useCalEmbed>;
