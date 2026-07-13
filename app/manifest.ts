import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Insurance Inventory",
    short_name: "InsInv",
    description: "Inventory system to track valuables for insurance claims, planning, and adjustments.",
    start_url: "/items",
    display: "standalone",
    background_color: "#f5f5f5",
    theme_color: "#f5b800",
    icons: [
      { src: "/logo.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}