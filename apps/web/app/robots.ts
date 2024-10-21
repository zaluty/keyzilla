import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
    return {
        // Adding comments to the robots.txt output
        
        rules: {
            userAgent:  "*",
            // allow all
            allow: "/",
            disallow: "/api/",
        },
        sitemap: `${siteConfig.url}/sitemap.xml`,
    };
}
