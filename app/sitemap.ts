import type { MetadataRoute } from "next";
const U="https://www.gekidan-hanafubuki.com";
export default function sitemap():MetadataRoute.Sitemap{const d=new Date();return[
{url:`${U}/`,lastModified:d,changeFrequency:"daily",priority:1},
{url:`${U}/performances`,lastModified:d,changeFrequency:"daily",priority:.9},
{url:`${U}/news`,lastModified:d,changeFrequency:"weekly",priority:.8}
]}
