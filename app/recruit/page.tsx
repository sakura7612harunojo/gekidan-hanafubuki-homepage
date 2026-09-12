import type { Metadata } from "next";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "座員募集｜劇団花吹雪",
  description:
    "劇団花吹雪では、共に舞台を創る役者・裏方・スタッフを募集しています。未経験の方も応募いただけます。",
  alternates: { canonical: "/recruit" },
};

export default function RecruitPage() {
  return (
    <>
      <Header />

      <main>
        <section className="schedule-hero">
          <p className="eyebrow">RECRUIT</p>
          <h1>座員募集</h1>
          <p>
            劇団花吹雪では、共に舞台を創る仲間を募集しています。
          </p>
        </section>

        <section className="section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">MEMBERS</p>
              <h2>募集職種</h2>
            </div>
          </div>

          <div className="grid">
            <article className="card">
              <h3>◆ 役者</h3>
              <p>
                経験・年齢不問。舞台に立ちたい気持ちのある方、大歓迎です。
                未経験の方には基礎からお教えします。
              </p>
            </article>

            <article className="card">
              <h3>◆ 裏方・スタッフ</h3>
              <p>
                音響・照明・大道具・衣装など、舞台を支える仕事です。
                こちらも未経験の方から始められます。
              </p>
            </article>
          </div>
        </section>

        <section className="section">
          <div className="card">
            <p className="eyebrow">REALITY</p>
            <h2>大衆演劇の世界について、正直にお伝えします</h2>
            <p>
              大衆演劇は、決して楽な世界ではありません。
              給料は多くありません。自分の時間も少なく、体力も気力も必要です。
              厳しい世界だということを、まず知っていただきたいと思います。
            </p>
          </div>
        </section>

        <section className="section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">OUR POLICY</p>
              <h2>うちの姿勢</h2>
            </div>
          </div>

          <div className="card">
            <p>
              そのうえで、劇団花吹雪では以下のことをお約束します。
            </p>
            <ul>
              <li>給料からの不当な天引きはしません</li>
              <li>辞めにくくするために道具制作などで縛ることもしません</li>
            </ul>
            <p>
              厳しい世界だからこそ、座員を大切にし、
              正々堂々と向き合いたいと思っています。
            </p>
          </div>
        </section>

        <section className="section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">PROMISE</p>
              <h2>入団にあたっての大切な約束</h2>
            </div>
          </div>

          <div className="grid">
            <article className="card">
              <h3>入団したら3年</h3>
              <p>中途半端な気持ちでの入団はご遠慮ください。</p>
            </article>

            <article className="card">
              <h3>辞める時は3ヶ月前に申し出</h3>
              <p>必ず事前にご相談ください。</p>
            </article>

            <article className="card">
              <h3>辞めた後は3年間、大衆演劇に関わらない</h3>
              <p>これは劇団としての決まりです。</p>
            </article>
          </div>

          <div className="card">
            <p>
              長く責任を持って舞台を共に作る仲間として関わっていただきたい、
              という思いからのルールです。
            </p>
          </div>
        </section>

        <section className="section">
          <div className="card">
            <p className="eyebrow">BEFORE APPLYING</p>
            <h2>応募前にご確認ください</h2>
            <p>
              上記の約束事に納得いただけない場合や、
              「とりあえず話だけ聞いてみたい」という段階の方は、
              恐れ入りますが今回はご遠慮ください。
            </p>
            <p>
              面談は、本気で入団を考えている方を対象とさせていただいております。
            </p>
          </div>
        </section>

        <section className="section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">APPLICATION</p>
              <h2>応募方法</h2>
            </div>
          </div>

          <div className="card">
            <p>
              ご興味のある方は、桜春之丞のSNSアカウントのDMまでご連絡ください。
            </p>
            <p>
              見学・体験も随時受け付けています。まずはお気軽にご連絡ください。
            </p>

            <div className="actions">
              <a
                className="btn primary"
                href="https://www.instagram.com/sakura_harunojo"
                target="_blank"
                rel="noopener noreferrer"
              >
                InstagramでDM
              </a>

              <a
                className="btn"
                href="https://x.com/oresama5776"
                target="_blank"
                rel="noopener noreferrer"
              >
                XでDM
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
