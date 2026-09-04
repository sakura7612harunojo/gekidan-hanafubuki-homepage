import Image from "next/image";

export function HeroTitleMark() {
  return (
    <Image
      className="hero-title-mark"
      src="/images/hanabuki-haru-mark.png"
      alt="春"
      width={1124}
      height={1124}
      sizes="(max-width: 760px) 72px, 120px"
      priority
    />
  );
}

export function CastHeadingSignature() {
  return (
    <Image
      className="cast-heading-signature"
      src="/images/harunojo-signature.png"
      alt="桜春之丞 サイン"
      width={1300}
      height={800}
      sizes="(max-width: 760px) min(72vw, 260px), min(36vw, 360px)"
      loading="lazy"
    />
  );
}
