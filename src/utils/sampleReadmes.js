export const initialReadmes = [
  {
    id: "cian-xerox-setup",
    title: "Cian Healthcare - Xerox PostScript Printer Setup",
    filename: "README_Cian_Xerox_PostScript_Setup.md",
    category: "Hardware & Setup",
    tags: ["Windows 11", "Printer", "Setup", "Healthcare"],
    favorite: true,
    createdAt: "2026-08-12T10:00:00.000Z",
    content: `# Cian Healthcare -- Xerox PostScript Printer Setup

## Purpose

This document is for setting up the PostScript printer required by the
Cian Healthcare Purchase Module for PDF report generation on Windows 11.

The error this setup fixes is:

> Postscript Printer is not set up properly, can not create the PDF report.

---

## 1. Required Configuration

-   Operating System: Windows 11 64-bit
-   Printer Driver: **Xerox Global Print Driver PS**
-   Driver Type: **x64, Type 3 -- User Mode**
-   Printer Name: **Xerox Global Print Driver PS**
-   Cian Setup Module → Server Post Script Printer Name: **Xerox Global Print Driver PS**

> [!IMPORTANT]
> Select the **PS** driver. Do not select PCL, PCL6, Microsoft Print to PDF, or another non-PostScript driver.

---

## 2. Open Print Server Properties

Press: **Win + R**

Enter:
\`\`\`text
printui.exe /s /t2
\`\`\`

Press **Enter**. This opens **Print Server Properties**. Go to the **Drivers** tab.

---

## 3. Install Xerox PostScript Driver

1. Click **Add...**
2. The **Add Printer Driver Wizard** opens.
3. Select **x64** processor.
4. Click **Next**.
5. Manufacturer: **Xerox**
6. Select:
\`\`\`text
Xerox Global Print Driver PS
\`\`\`
7. Click **Next**.
8. Finish the Add Printer Driver Wizard.

If Windows asks: **Which version of the driver do you want to use?**
Select: **Use the driver that is currently installed (recommended)** and click **Next**.

---

## 4. Verify the Driver

Open **PowerShell as Administrator** and run:

\`\`\`powershell
Get-PrinterDriver | Where-Object {$_.Name -like "*Xerox*"} | Format-Table Name,Manufacturer,MajorVersion,DriverVersion
\`\`\`

Expected result should contain:
\`\`\`text
Xerox Global Print Driver PS
\`\`\`

---

## 5. Create the Printer Queue

Installing the driver alone is not enough. A printer queue must also be created.

1. Press **Win + R**
2. Enter \`control printers\`
3. Click **Add printer**.
4. Select **Add a local printer or network printer with manual settings**
5. Select port: \`FILE: (Print to File)\`
6. Select driver: \`Xerox Global Print Driver PS\`
7. Set printer name exactly to: \`Xerox Global Print Driver PS\`

---

## 6. Verify the Printer Queue

Open Administrator PowerShell and run:

\`\`\`powershell
Get-Printer | Where-Object {$_.Name -like "*Xerox*"} | Format-Table Name,DriverName,PortName -AutoSize
\`\`\`

---

## 7. Configure Cian Healthcare

Open **Setup Module → Server Post Script Printer Preference** and set:
\`\`\`text
Server Post Script Printer Name: Xerox Global Print Driver PS
\`\`\`

Click **Save → Exit** and restart Cian.

---

## 8. Quick Checklist

- [x] Windows 11 64-bit confirmed
- [x] Installed Xerox Global Print Driver PS
- [x] Created printer queue with exact name
- [x] Configured Cian Setup Module
- [ ] Tested PDF generation in Purchase Module
`
  },
  {
    id: "nexus-engine-readme",
    title: "Nexus Core Framework - Next Gen Fullstack Engine",
    filename: "README.md",
    category: "Developer Guide",
    tags: ["React", "TypeScript", "Node.js", "Architecture"],
    favorite: true,
    createdAt: "2026-08-11T14:30:00.000Z",
    content: `# 🚀 Nexus Core Framework

> High-performance, reactive engine designed for real-time web applications & distributed microservices.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-2.4.0-emerald.svg)
![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)
![Coverage](https://img.shields.io/badge/coverage-98%25-green.svg)

---

## ✨ Features

- **⚡ Lightning Fast Engine**: Zero-dependency runtime pipeline with under 2ms cold start times.
- **🎨 Reactive UI Binding**: State synchronization across edge servers and local clients.
- **🔒 Zero-Trust Security**: End-to-end payload signing with AES-256 encryption.
- **📦 Modular Plugins**: Plug-and-play middleware for analytics, state persistence, and auth.

> [!NOTE]
> Nexus Core v2.4 introduces full native WebAssembly binding for crypto calculations.

> [!TIP]
> Use the \`--turbo\` flag during initialization to enable memory pre-allocation.

---

## 🛠️ Quick Installation

Install Nexus Core via your favorite package manager:

\`\`\`bash
# Using npm
npm install @nexus/core @nexus/react

# Using pnpm
pnpm add @nexus/core @nexus/react
\`\`\`

---

## 💻 Usage Example

Here is how easily you can initialize a client instance and bind real-time event listeners:

\`\`\`typescript
import { createEngine, EventType } from '@nexus/core';

// Initialize core engine
const engine = createEngine({
  clusterId: 'eu-central-1',
  heartbeatMs: 5000,
  autoReconnect: true,
});

// Subscribe to real-time streams
engine.subscribe(EventType.DATA_STREAM, (payload) => {
  console.log('Received payload:', payload.id, payload.timestamp);
});

await engine.connect();
\`\`\`

---

## 📊 Performance Benchmark

| Metric | Nexus v2.4 | Legacy Engine | Improvement |
| :--- | :--- | :--- | :--- |
| **Cold Start** | 1.8ms | 14.5ms | **800% faster** |
| **Memory footprint** | 12.4 MB | 84.2 MB | **85% reduction** |
| **Throughput** | 120k req/s | 24k req/s | **5x higher** |

---

## 🗺️ Roadmap & Checklist

- [x] Initial WASM crypto binding
- [x] Reactive state synchronization
- [x] Multi-region failover cluster
- [ ] Native Mobile SDKs (iOS / Android)
- [ ] GraphQL auto-subscriptions generator
`
  },
  {
    id: "api-reference-guide",
    title: "Quantum REST & GraphQL API Specification",
    filename: "API_REFERENCE.md",
    category: "Documentation",
    tags: ["API", "REST", "GraphQL", "Endpoints"],
    favorite: false,
    createdAt: "2026-08-10T09:15:00.000Z",
    content: `# 🛰️ Quantum API Reference Guide

Welcome to the Quantum Platform REST & GraphQL API documentation. This API allows external services to query metrics, manage workflows, and receive webhooks.

## 🔐 Base URL & Authentication

All API requests must be made over \`HTTPS\` to the following base endpoint:

\`\`\`text
https://api.quantum-cloud.io/v1/
\`\`\`

Provide your API key in the authorization header:

\`\`\`http
Authorization: Bearer qk_live_9f83ac1278104e1a
Content-Type: application/json
\`\`\`

> [!WARNING]
> Never expose your live secret API key in client-side code or public repositories!

---

## 📡 Endpoints Overview

### 1. Fetch Metrics Summary

\`\`\`http
GET /v1/analytics/summary?period=30d
\`\`\`

#### Response:

\`\`\`json
{
  "status": "success",
  "data": {
    "total_requests": 1420500,
    "active_nodes": 42,
    "uptime_percentage": 99.994,
    "latency_p99_ms": 14.2
  }
}
\`\`\`

---

### 2. Create Webhook Trigger

\`\`\`http
POST /v1/webhooks
\`\`\`

#### Request Body:

\`\`\`json
{
  "target_url": "https://myapp.com/hooks/quantum",
  "events": ["dataset.updated", "node.alert"],
  "secret": "whsec_x8931a"
}
\`\`\`

> [!CAUTION]
> Deleting a webhook endpoint is immediate and will fail any pending event retries.
`
  }
];
