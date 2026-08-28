import type { MetadataRoute } from "next";
const U="https://www.gekidan-hanafubuki.com";
export default function robots():MetadataRoute.Robots{return{rules:[{userAgent:"*",allow:"/",disallow:["/admin/","/auth/","/api/"]}],sitemap:`${U}/sitemap.xml`,host:U}}
