"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

// Public workspace ID, inlined at build time. Unset → the widget is skipped.
const INTERCOM_APP_ID = process.env.NEXT_PUBLIC_INTERCOM_APP_ID;

declare global {
  interface Window {
    Intercom?: (command: string, ...args: unknown[]) => void;
  }
}

/**
 * Intercom messenger. Loads the widget once for the whole site, boots it for
 * anonymous visitors, and pings `update` on every client-side route change so
 * the messenger can show the latest messages for the current URL.
 */
export default function Intercom() {
  const pathname = usePathname();

  useEffect(() => {
    window.Intercom?.("update");
  }, [pathname]);

  if (!INTERCOM_APP_ID) return null;

  return (
    <Script id="intercom-messenger" strategy="afterInteractive">
      {`(function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/${INTERCOM_APP_ID}';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(document.readyState==='complete'){l();}else if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();
window.Intercom("boot",{api_base:"https://api-iam.intercom.io",app_id:"${INTERCOM_APP_ID}"});`}
    </Script>
  );
}
