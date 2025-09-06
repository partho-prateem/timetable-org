import { DemoResponse } from "@shared/api";
import { useEffect, useState } from "react";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-sky-50 to-white">
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-sky-400" />
        <div className="font-extrabold text-xl">ChronoSlate</div>
        <div className="ml-auto space-x-3">
          <a className="text-sm text-muted-foreground hover:text-foreground" href="/login">Login</a>
          <a className="inline-flex items-center justify-center rounded-md bg-foreground text-background px-3 py-1.5 text-sm font-medium" href="/dashboard">Open App</a>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Timetable scheduling,
            <span className="bg-gradient-to-r from-violet-600 to-sky-600 bg-clip-text text-transparent"> made simple</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-prose">
            Build conflict-free schedules with drag-and-drop, compare alternatives side-by-side, and let AI suggest optimal arrangements.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a className="inline-flex items-center justify-center rounded-md bg-foreground text-background px-4 py-2 text-sm font-medium" href="/dashboard">Get started</a>
            <a className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium" href="/timetables">See timetable</a>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-4 text-sm">
            <Feature title="Drag-and-drop" desc="Move classes across the grid seamlessly" />
            <Feature title="AI Suggestions" desc="One-click rearrangement ideas" />
            <Feature title="Admin Control" desc="Approve or reject submissions" />
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-violet-200/40 to-sky-200/40 blur-2xl" />
          <div className="relative rounded-2xl border bg-card shadow">
            <img src="/placeholder.svg" alt="timetable preview" className="w-full rounded-2xl" />
          </div>
        </div>
      </main>
    </div>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div>
      <div className="font-semibold">{title}</div>
      <div className="text-muted-foreground">{desc}</div>
    </div>
  );
}
