import type { ReactNode } from "react";
const data={"@context":"https://schema.org","@type":["Organization","PerformingGroup"],name:"劇団花吹雪",alternateName:"Gekidan Hanafubuki",url:"https://www.gekidan-hanafubuki.com",description:"劇団花吹雪の公式サイト。大衆演劇の公演予定、本日の演目、劇団員、芝居・舞踊演目、お知らせを掲載しています。座長 桜春之丞・櫻京之介。"};
export default function Template({children}:Readonly<{children:ReactNode}>){return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(data)}}/>{children}</>}
