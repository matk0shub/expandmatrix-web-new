import { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export const useCalEmbed = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (async function () {
        try {
          const cal = await getCalApi({
            namespace: "strategy",
            embedLibUrl: "https://meet.expandmatrix.com/embed/embed.js"
          });
          cal("ui", {
            hideEventTypeDetails: false,
            layout: "month_view",
            theme: "dark",
            colorScheme: "dark",
            styles: {
              branding: {
                brandColor: "#00d76b"
              },
              body: {
                background: "#050505"
              },
              eventTypeListItem: {
                background: "rgba(8, 8, 8, 0.85)",
                color: "#f0f8f5"
              },
              enabledDateButton: {
                background: "#00d76b",
                color: "#051b12"
              },
              disabledDateButton: {
                background: "rgba(20, 20, 20, 0.6)",
                color: "rgba(255, 255, 255, 0.24)"
              },
              availabilityDatePicker: {
                background: "#050505",
                color: "#e8f2ee"
              }
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
                "--cal-font-family": "var(--font-lato, 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif)"
              }
            }
          });
        } catch (error) {
          console.warn('Cal.com embed failed to load:', error);
        }
      })();
    }
  }, []);
};
