"use client";
import React, { useState } from "react";
import { Database, RefreshCw, CheckCircle2, ArrowUpRight, Zap, ShieldCheck } from "lucide-react";

export default function CRMPage() {
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState("Operational");

  const handleManualSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setSyncStatus("Synchronized just now (142 contacts, 28 video activities)");
    }, 1200);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white">CRM Systems Integration</h1>
          <p className="text-xs text-gray-400 mt-1">Bi-directional synchronization of video leads, viewer engagement, and deal tracking</p>
        </div>
        <button
          onClick={handleManualSync}
          disabled={syncing}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
          <span>{syncing ? "Syncing..." : "Sync All CRMs"}</span>
        </button>
      </div>

      {/* Sync Status Banner */}
      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs text-emerald-400">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span className="font-semibold">{syncStatus}</span>
        </div>
        <span className="text-gray-400">Low-latency event streaming active</span>
      </div>

      {/* CRM Connectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            name: "HubSpot CRM",
            desc: "Pushes clip analytics as marketing activities and enriches contacts with video retention metrics.",
            status: "Connected",
            tag: "Active",
            color: "border-orange-500/20"
          },
          {
            name: "Salesforce Media Cloud",
            desc: "Bi-directional event stream for leads, deals, and automated campaign triggering upon viral threshold reach.",
            status: "Connected",
            tag: "Active",
            color: "border-blue-500/20"
          },
          {
            name: "Zoho CRM",
            desc: "Syncs customer interaction touchpoints and schedules follow-up tasks when contacts view clips.",
            status: "Ready to Connect",
            tag: "Available",
            color: "border-emerald-500/20"
          },
          {
            name: "Custom Realtime Webhook",
            desc: "Send instant JSON payloads to your backend / Zapier / Make.com upon clip generation and publishing.",
            status: "Active (200 OK)",
            tag: "Low-Latency",
            color: "border-purple-500/20"
          }
        ].map((crm, i) => (
          <div key={i} className={`p-6 rounded-2xl bg-[#0f0f15] border ${crm.color} space-y-4 hover:border-gray-600 transition-colors`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Database className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-white text-base">{crm.name}</h3>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {crm.tag}
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">{crm.desc}</p>
            <div className="pt-2 flex items-center justify-between text-xs">
              <span className="text-emerald-400 font-semibold">{crm.status}</span>
              <button className="text-gray-400 hover:text-white flex items-center gap-1 font-semibold">
                <span>Configure</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
