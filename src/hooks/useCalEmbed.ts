import { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export const useCalEmbed = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (async function () {
        try {
          const cal = await getCalApi({
            namespace: "strategy",
            embedJsUrl: "https://meet.expandmatrix.com/embed/embed.js"
          });
          cal("ui", {
            hideEventTypeDetails: false,
            layout: "month_view"
          });
        } catch (error) {
          console.warn('Cal.com embed failed to load:', error);
        }
      })();
    }
  }, []);
};
