// Minimal re-implementation of the Grok canvas components used by the Page source,
// so the same App.tsx runs as a static site.
import React, { useState } from "react";
export { useState };

export function useGrokTheme() {
  return {
    bg: { base: "#0b1220", subtle: "#182640" },
    border: { default: "#3d5282" },
    text: { primary: "#eef2f8", secondary: "#b9c4d6", tertiary: "#8d9bb3" },
    font: { family: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" },
    dataviz: { categorical: ["#4cc9f0", "#ff5c5c", "#ffb020", "#7bd88f"], other: "#9aa4b2", areaAlpha: "40" },
  };
}

export function Page({ title, summary, children }: { title: string; summary?: string; width?: string; children: React.ReactNode }) {
  return (
    <div className="page">
      <header className="hero">
        <div className="kicker">STAR WARS: THE OLD REPUBLIC</div>
        <h1>{title}</h1>
        {summary ? <p className="summary">{summary}</p> : null}
      </header>
      <main>{children}</main>
      <footer className="foot">Unofficial fan guide. Star Wars: The Old Republic and its area maps are © Electronic Arts / Lucasfilm / BioWare; map images are used for guide purposes with credit to the sites listed above. Not affiliated with EA or BioWare.</footer>
    </div>
  );
}

export function Section({ heading, id, caption, children }: { heading?: string; id?: string; caption?: string; children?: React.ReactNode }) {
  return (
    <section className="section" id={id}>
      {heading ? <h2>{heading}</h2> : null}
      {caption ? <p className="caption">{caption}</p> : null}
      {children}
    </section>
  );
}
export function Text({ children }: { children?: React.ReactNode }) { return <p className="text">{children}</p>; }
export function Image({ src, alt, ratio }: { src: string; alt: string; ratio?: string; width?: string; fit?: string; height?: string }) {
  const url = src.startsWith("asset:") ? "maps/" + src.slice(6) : src;
  const [w, h] = (ratio ?? "").split("/").map(Number);
  return <img src={url} alt={alt} style={{ display: "block", width: "100%", height: "auto", aspectRatio: w && h ? `${w} / ${h}` : undefined }} loading="lazy" decoding="async" />;
}
export function Callout({ lead, tone, children }: { lead?: string; tone?: string; children?: React.ReactNode }) {
  return <div className={"callout " + (tone ?? "")}>{lead ? <strong>{lead} </strong> : null}{children}</div>;
}
export function BulletList({ items }: { items: string[] }) {
  return <ul className="bullets">{items.map((t, i) => <li key={i}>{t}</li>)}</ul>;
}
export function Grid({ columns, plain, children }: { columns?: number; plain?: boolean; children?: React.ReactNode }) {
  return <div className={"grid c" + (columns ?? 1) + (plain ? " plain" : "")}>{children}</div>;
}
export function Select({ label, options, value, onChange }: { label?: string; options: { value: string; label: string }[]; value: string; onChange: (v: string) => void }) {
  return (
    <label className="field">
      {label ? <span className="flabel">{label}</span> : null}
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}
export function Segmented<T extends string>({ options, value, onChange }: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="seg" role="tablist">
      {options.map((o) => (
        <button key={o.value} role="tab" aria-selected={o.value === value} className={o.value === value ? "on" : ""} onClick={() => onChange(o.value)}>{o.label}</button>
      ))}
    </div>
  );
}
export function Properties({ items }: { items: { label: string; value: string }[] }) {
  return <dl className="props">{items.map((p, i) => <div key={i}><dt>{p.label}</dt><dd>{p.value}</dd></div>)}</dl>;
}
export function LinkCards({ links }: { links: { title: string; site: string; href: string }[] }) {
  return (
    <div className="links">
      {links.map((l, i) => (
        <a key={i} href={l.href} target="_blank" rel="noopener noreferrer"><span className="lt">{l.title}</span><span className="ls">{l.site} ↗</span></a>
      ))}
    </div>
  );
}
export function Table({ columns, rows }: { columns: string[]; rows: (string | number)[][] }) {
  return (
    <div className="tablewrap"><table>
      <thead><tr>{columns.map((c, i) => <th key={i}>{c}</th>)}</tr></thead>
      <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} data-label={columns[j]}>{c}</td>)}</tr>)}</tbody>
    </table></div>
  );
}
export function Legend({ names }: { names: string[] }) {
  const th = useGrokTheme();
  const cols = [th.dataviz.categorical[0], th.dataviz.categorical[1], th.dataviz.categorical[2], th.dataviz.other];
  return <div className="legend">{names.map((n, i) => <span key={i}><i style={{ background: cols[i] }} />{n}</span>)}</div>;
}
export function TableOfContents({ items }: { items: { label: string; id: string }[] }) {
  return <nav className="toc" aria-label="Contents">{items.map((t) => <a key={t.id} href={"#" + t.id}>{t.label}</a>)}</nav>;
}
