import type { Metadata } from "next";
import { createClient as createPublicSupabaseClient } from "@supabase/supabase-js";

import { Header } from "@/components/Header";
import { CastHeadingSignature } from "@/components/PublicBrandImages";
import { PublicResponsiveImage } from "@/components/PublicResponsiveImage";

export const metadata: Metadata = {
  title: { absolute: "桜春之丞｜劇団花吹雪｜劇団員紹介" },
  description: "桜春之丞が座長を務める劇団花吹雪の劇団員紹介。桜春之丞を中心に、劇団員のプロフィールをご紹介します。",
  alternates: { canonical: "/cast" },
};

export const revalidate = 300;

function getCastRoleRank(roleName: string | null | undefined) {
  const role = roleName ?? "";

  if (role.includes("座長")) return 0;
  if (role.includes("花形")) return 1;
  if (role.includes("劇団員")) return 2;
  if (role.includes("サポート")) return 3;
  if (role.includes("裏方")) return 4;

  return 99;
}

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "桜春之丞",
  alternateName: "春之丞",
  jobTitle: "座長",
  description: "劇団花吹雪 座長・桜春之丞。大衆演劇の役者として活動。",
  url: "https://www.gekidan-hanafubuki.com/cast",
  sameAs: [
    "https://twitcasting.tv/oresama5776",
    "https://x.com/oresama5776",
    "https://www.instagram.com/sakura_harunojo/",
  ],
  worksFor: {
    "@type": "Organization",
    name: "劇団花吹雪",
    url: "https://www.gekidan-hanafubuki.com",
  },
};

export default async function CastPage() {
  const supabase = createPublicSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );

  const { data: members } = await supabase
    .from("members")
    .select("*,photo_path")
    .eq("is_public", true)
    .order("sort_order");

  const castMembers = (
    members && members.length > 0
      ? members
      : [
          {
            id: "fallback-harunojo",
            role_name: "劇団花吹雪 座長",
            stage_name: "桜春之丞",
            profile: "劇団花吹雪 座長",
            photo_path: null,
          },
        ]
  )
    .slice()
    .sort(
      (a, b) =>
        getCastRoleRank(a.role_name) - getCastRoleRank(b.role_name)
    );

  const featuredMember =
    castMembers.find((member) => member.stage_name === "桜春之丞") ??
    castMembers[0];

  const otherMembers = castMembers.filter(
    (member) => member.id !== featuredMember?.id
  );

  const renderMemberCard = (
    member: (typeof castMembers)[number],
    featured = false
  ) => (
    <article
      className={`card member-card${featured ? " member-card-featured" : ""}`}
      key={member.id}
    >
      {member.photo_path ? (
        <PublicResponsiveImage
          src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/gallery/${member.photo_path}`}
          alt={`${member.stage_name}の写真`}
          variant="member"
        />
      ) : null}

      <small>{member.role_name}</small>
      <h3>{member.stage_name}</h3>

      {member.profile && member.profile !== "プロフィール準備中" ? (
        <p>{member.profile}</p>
      ) : null}
    </article>
  );

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      <main>
        <section className="section">
          <p className="eyebrow">CAST</p>

          <div className="cast-heading-with-signature">
            <h1>劇団員紹介</h1>
            <CastHeadingSignature />
          </div>

          <div className="members-layout">
            {featuredMember ? renderMemberCard(featuredMember, true) : null}

            <div className="members-rest-grid">
              {otherMembers.map((member) => renderMemberCard(member))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
