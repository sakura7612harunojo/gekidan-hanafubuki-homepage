import { ImageResponse } from "next/og";
export const alt="劇団花吹雪｜大衆演劇 公式サイト"; export const size={width:1200,height:630}; export const contentType="image/png";
export default function Image(){return new ImageResponse(
<div style={{width:"100%",height:"100%",display:"flex",flexDirection:"column",justifyContent:"space-between",background:"radial-gradient(circle at 78% 30%, #4b2d10 0%, #171008 30%, #050505 68%)",color:"#f7f1e7",padding:"72px 82px",fontFamily:"sans-serif"}}>
<div style={{display:"flex",fontSize:24,letterSpacing:".34em",color:"#d9ad3f",fontWeight:700}}>GEKIDAN HANAFUBUKI</div>
<div style={{display:"flex",flexDirection:"column"}}><div style={{display:"flex",fontSize:102,fontWeight:700,letterSpacing:".04em"}}>劇団 花吹雪</div><div style={{display:"flex",marginTop:30,fontSize:34,color:"#dfd5c4"}}>大衆演劇｜公演情報・劇団員・演目</div></div>
<div style={{display:"flex",justifyContent:"space-between",borderTop:"2px solid #b88b2d",paddingTop:28,fontSize:25}}><div style={{display:"flex",color:"#d9ad3f",fontWeight:700}}>OFFICIAL WEBSITE</div><div style={{display:"flex",color:"#cfc6b7"}}>www.gekidan-hanafubuki.com</div></div>
</div>,size)}
