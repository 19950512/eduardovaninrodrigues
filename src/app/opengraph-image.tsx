import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#250509",
          padding: "72px",
          color: "#f7f4ef",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 26,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#d06f81",
          }}
        >
          {siteConfig.oab.exibicao}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 66, fontWeight: 600, lineHeight: 1.1 }}>
            {siteConfig.nome}
          </div>
          <div style={{ fontSize: 32, marginTop: 16, color: "#e6a0ac" }}>
            {siteConfig.titulo}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
