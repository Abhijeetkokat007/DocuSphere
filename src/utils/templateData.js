export const COMMUNITY_TEMPLATES = [
  {
    id: "tpl-saas-starter",
    title: "SaaS Launch Template",
    category: "Fullstack SaaS",
    description: "Production-ready README template for SaaS applications with badges, features grid, env setup, and deployment guides.",
    author: "Community Showcase",
    stars: 480,
    tags: ["SaaS", "React", "Node", "Deployment"],
    content: `# 🚀 [Your SaaS Name]

> The ultimate platform to streamline your workflow and supercharge team productivity.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)
![Coverage](https://img.shields.io/badge/coverage-99%25-green.svg)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

---

## ✨ Features

- **⚡ Lightning Performance**: Sub-second rendering with global edge distribution.
- **🔒 Enterprise Security**: SOC2 compliant auth with role-based access control (RBAC).
- **📊 Real-time Dashboard**: Instant visual metrics and exportable reports.
- **🔌 Webhook Integration**: Trigger real-time notifications to Slack and Discord.

> [!TIP]
> Check out the live demo at [https://demo.yoursaas.io](https://demo.yoursaas.io).

---

## 💻 Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, React Query
- **Backend**: Node.js, Express, Prisma ORM
- **Database**: PostgreSQL & Redis Cache
- **Hosting**: Vercel & AWS S3

---

## 🛠️ Quick Setup

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/username/your-saas.git
   cd your-saas
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Configure Environment Variables**
   Create a \`.env.local\` file in the root directory:
   \`\`\`env
   DATABASE_URL="postgresql://user:password@localhost:5432/saas_db"
   NEXTAUTH_SECRET="your_super_secret_key"
   \`\`\`

4. **Run Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`

---

## 📜 License

Distributed under the MIT License. See \`LICENSE\` for more information.
`
  },
  {
    id: "tpl-cli-tool",
    title: "Modern Node CLI Tool Template",
    category: "Developer Tools",
    description: "Sleek documentation layout for Command Line Interface (CLI) tools with command syntax tables and flags reference.",
    author: "OpenSource Hub",
    stars: 320,
    tags: ["CLI", "Node.js", "Terminal", "DevTools"],
    content: `# ⚡ HyperCLI

> Command-line tool to automate local dev environments and cloud deployments in seconds.

[![npm version](https://img.shields.io/npm/v/hypercli.svg)](https://www.npmjs.com/package/hypercli)
[![Downloads](https://img.shields.io/npm/dm/hypercli.svg)](https://www.npmjs.com/package/hypercli)

---

## 📦 Installation

\`\`\`bash
# Global installation via npm
npm install -g hypercli

# Or run instantly via npx
npx hypercli init
\`\`\`

---

## 🎯 Usage & Command Reference

\`\`\`text
Usage: hypercli [command] [options]

Commands:
  init          Initialize a new workspace config
  deploy        Deploy application to production edge
  logs          Stream live server tail logs
  status        Check health of connected microservices
\`\`\`

| Command | Flags | Description |
| :--- | :--- | :--- |
| \`hypercli init\` | \`--template=react\` | Scaffolds a new project structure |
| \`hypercli deploy\` | \`--env=prod\` | Deploys build artifacts to target environment |
| \`hypercli logs\` | \`--tail=100\` | Fetches the last 100 log entries |

> [!NOTE]
> Pass \`--verbose\` to any command for detailed debug trace outputs.
`
  },
  {
    id: "tpl-python-lib",
    title: "Python Data Science & ML Library",
    category: "Machine Learning",
    description: "Ideal README structure for Python packages, ML models, PyPI releases, and Jupyter Notebook examples.",
    author: "AI Research Group",
    stars: 610,
    tags: ["Python", "PyPI", "Machine Learning", "Data Science"],
    content: `# 🧠 NeuroFlow Py

> High-speed tensor optimization & neural graph compilation library in Python & C++.

[![PyPI Version](https://img.shields.io/pypi/v/neuroflow.svg)](https://pypi.org/project/neuroflow/)
[![Python Versions](https://img.shields.io/pypi/pyversions/neuroflow.svg)](https://pypi.org/project/neuroflow/)

---

## 🚀 Quickstart

Install via PyPI:

\`\`\`bash
pip install neuroflow-py
\`\`\`

### Example Code:

\`\`\`python
import neuroflow as nf

# Load pre-trained model graph
model = nf.load_model("gpt-mini-v1")

# Run optimized inference
results = model.predict(["Accelerating AI research with NeuroFlow"])
print(results)
\`\`\`

> [!IMPORTANT]
> Requires CUDA 12.0+ for GPU hardware acceleration.
`
  }
];
