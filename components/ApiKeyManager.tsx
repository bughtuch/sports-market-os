"use client";

/**
 * ApiKeyManager — Create, view, and revoke API keys.
 * Plaintext key is shown exactly once at creation and then discarded.
 */

import { useEffect, useState, useRef } from "react";
import type { ApiKeySafe, ApiKeyCreated } from "@/lib/apiKeys/apiKeyTypes";
import { STATUS_COLOR, STATUS_DOT } from "@/lib/apiKeys/apiKeyTypes";

type CreateState = "idle" | "creating" | "error";

export default function ApiKeyManager() {
  const [keys, setKeys]           = useState<ApiKeySafe[]>([]);
  const [loading, setLoading]     = useState(true);
  const [createState, setCreate]  = useState<CreateState>("idle");
  const [newName, setNewName]     = useState("");
  const [revealed, setRevealed]   = useState<ApiKeyCreated | null>(null);
  const [copied, setCopied]       = useState(false);
  const [revoking, setRevoking]   = useState<string | null>(null);
  const inputRef                  = useRef<HTMLInputElement>(null);

  // ─── Load keys ─────────────────────────────────────────────────────────────

  async function loadKeys() {
    setLoading(true);
    try {
      const res = await fetch("/api/keys");
      if (!res.ok) throw new Error();
      const json = await res.json() as { keys: ApiKeySafe[] };
      setKeys(json.keys);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadKeys(); }, []);

  // ─── Create ────────────────────────────────────────────────────────────────

  async function handleCreate() {
    const name = newName.trim();
    if (!name) { inputRef.current?.focus(); return; }

    setCreate("creating");
    try {
      const res  = await fetch("/api/keys", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ name }),
      });
      if (!res.ok) { setCreate("error"); return; }
      const created = await res.json() as ApiKeyCreated;
      setRevealed(created);
      setNewName("");
      setCreate("idle");
      await loadKeys();
    } catch {
      setCreate("error");
    }
  }

  // ─── Copy ──────────────────────────────────────────────────────────────────

  async function handleCopy(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // ─── Revoke ────────────────────────────────────────────────────────────────

  async function handleRevoke(id: string) {
    setRevoking(id);
    try {
      await fetch(`/api/keys/${id}`, { method: "DELETE" });
      await loadKeys();
    } finally {
      setRevoking(null);
    }
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">

      {/* Revealed key — show once banner */}
      {revealed && (
        <div className="border border-emerald-500/30 rounded-sm bg-emerald-950/20 p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <p className="text-emerald-400 text-[10px] font-mono uppercase tracking-widest">
              Key created — copy now. This will not be shown again.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-[11px] font-mono text-zinc-200 bg-zinc-900 rounded-sm px-3 py-2 overflow-x-auto whitespace-nowrap border border-zinc-800">
              {revealed.key}
            </code>
            <button
              onClick={() => void handleCopy(revealed.key)}
              className="shrink-0 text-[10px] font-mono px-3 py-2 rounded-sm border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <p className="text-zinc-600 text-[9px] font-mono mt-2">
            Name: {revealed.safe.name} · Prefix: {revealed.safe.key_prefix}
          </p>
          <button
            onClick={() => setRevealed(null)}
            className="mt-3 text-[9px] font-mono text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            Dismiss ×
          </button>
        </div>
      )}

      {/* Create form */}
      <div className="border border-zinc-800/60 rounded-sm bg-zinc-950 p-4">
        <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-3">
          Create new key
        </p>
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") void handleCreate(); }}
            placeholder="Key name (e.g. Production Server)"
            maxLength={60}
            className="flex-1 text-[11px] font-mono bg-zinc-900 border border-zinc-800 rounded-sm px-3 py-2 text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-zinc-600"
          />
          <button
            onClick={() => void handleCreate()}
            disabled={createState === "creating" || !newName.trim()}
            className="shrink-0 text-[10px] font-mono px-4 py-2 rounded-sm bg-white text-black hover:bg-zinc-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {createState === "creating" ? "Creating…" : "Create"}
          </button>
        </div>
        {createState === "error" && (
          <p className="text-red-400 text-[9px] font-mono mt-2">Failed to create key. Try again.</p>
        )}
      </div>

      {/* Key list */}
      <div className="border border-zinc-800/60 rounded-sm bg-zinc-950 overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-900/60 flex items-center justify-between">
          <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
            API Keys
          </p>
          <p className="text-zinc-700 text-[9px] font-mono">
            {keys.length} key{keys.length !== 1 ? "s" : ""}
          </p>
        </div>

        {loading ? (
          <div className="px-4 py-6 text-zinc-700 text-[10px] font-mono">Loading…</div>
        ) : keys.length === 0 ? (
          <div className="px-4 py-6 text-zinc-600 text-[10px] font-mono">
            No keys yet. Create one above.
          </div>
        ) : (
          <div className="divide-y divide-zinc-900/60">
            {keys.map((k) => (
              <div key={k.id} className="px-4 py-3 flex items-center gap-3 flex-wrap">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${STATUS_DOT[k.status]}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-zinc-200 text-[11px] font-medium truncate">{k.name}</p>
                  <p className="text-zinc-600 text-[9px] font-mono mt-0.5">{k.key_prefix}…</p>
                </div>
                <span className={`text-[9px] font-mono ${STATUS_COLOR[k.status]}`}>
                  {k.status}
                </span>
                <p className="text-zinc-700 text-[9px] font-mono shrink-0">
                  {k.last_used_at
                    ? new Date(k.last_used_at).toLocaleDateString()
                    : "never used"}
                </p>
                {k.status === "active" && (
                  <button
                    onClick={() => void handleRevoke(k.id)}
                    disabled={revoking === k.id}
                    className="text-[9px] font-mono text-zinc-600 hover:text-red-400 transition-colors disabled:opacity-40"
                  >
                    {revoking === k.id ? "Revoking…" : "Revoke"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Security note */}
      <p className="text-zinc-700 text-[9px] font-mono leading-relaxed">
        Keys authenticate requests to /api/v1/* via the x-smo-api-key header.
        Revoked keys are permanently disabled and cannot be re-activated.
        Store keys in environment variables — never commit them to source control.
      </p>
    </div>
  );
}
