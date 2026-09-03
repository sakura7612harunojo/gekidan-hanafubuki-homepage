import Image from "next/image";

type PublicResponsiveImageProps = {
  src: string;
  alt: string;
  variant: "member" | "gallery";
};

const imageSettings = {
  member: {
    width: 1200,
    height: 1500,
    sizes: "(max-width: 760px) calc(100vw - 80px), 29vw",
  },
  gallery: {
    width: 1600,
    height: 1200,
    sizes: "(max-width: 760px) calc(100vw - 64px), 43vw",
  },
} as const;

export function PublicResponsiveImage({
  src,
  alt,
  variant,
}: PublicResponsiveImageProps) {
  const settings = imageSettings[variant];

  return (
    <Image
      src={src}
      alt={alt}
      width={settings.width}
      height={settings.height}
      sizes={settings.sizes}
      loading="lazy"
      style={
        variant === "member"
          ? {
              display: "block",
              width: "100%",
              height: "auto",
              aspectRatio: "4 / 5",
              objectFit: "cover",
              objectPosition: "top center",
              marginBottom: 18,
              border: "1px solid #302b24",
            }
          : {
              display: "block",
              width: "100%",
              height: "auto",
              aspectRatio: "auto 4 / 3",
            }
      }
    />
  );
}
