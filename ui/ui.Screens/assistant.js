// ui/ui.Screens/assistant.js
// Handles UI initialization + PWA mode detection + update notifications

window.addEventListener("load", () => {
  console.log("assistant.js loaded");

  // Detect if running as an installed PWA
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  console.log("Display mode:", isStandalone ? "standalone" : "browser");

  if (isStandalone) {
    document.body.classList.add("pwaMode");
    console.log("PWA mode UI enabled");
  }

  // 🌸 UPDATE NOTIFICATION
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistration().then(reg => {
      if (!reg) return;

      // Listen for a new service worker waiting to activate
      if (reg.waiting) {
        showUpdateBanner(reg.waiting);
      }

      // Listen for new service worker updates
      reg.addEventListener("updatefound", () => {
        const newWorker = reg.installing;
        if (!newWorker) return;

        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            showUpdateBanner(newWorker);
          }
        });
      });
    });
  }
});

// 🌸 UI Banner for Updates
function showUpdateBanner(worker) {
  console.log("New version of Lotus Assistant available!");

  const banner = document.createElement("div");
  banner.id = "updateBanner";
  banner.style.position = "fixed";
  banner.style.bottom = "20px";
  banner.style.left = "50%";
  banner.style.transform = "translateX(-50%)";
  banner.style.background = "#222";
  banner.style.color = "#fff";
  banner.style.padding = "12px 20px";
  banner.style.borderRadius = "8px";
  banner.style.boxShadow = "0 0 10px rgba(0,0,0,0.4)";
  banner.style.fontSize = "15px";
  banner.style.zIndex = "9999";
  banner.style.cursor = "pointer";
  banner.textContent = "A new version of Lotus Assistant is available — tap to update";

  banner.onclick = () => {
    worker.postMessage("skipWaiting");
    window.location.reload();
  };

  document.body.appendChild(banner);
}
