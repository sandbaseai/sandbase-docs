---
title: "Template: code_interpreter"
description: "Python data science sandbox with NumPy, Pandas, Matplotlib, and more. Boots in ~60ms."
---

# code_interpreter

Python-focused sandbox for data analysis, visualization, and general code execution. Boots in ~60ms with a full scientific Python stack pre-installed.

## Specs

| Property | Value |
|----------|-------|
| Template ID | `code_interpreter` |
| Default Timeout | 300s (5 min) |
| CPU | 2 vCPU |
| Memory | 2 GB |
| Disk | 10 GB |
| Boot Time | ~60ms |
| Internet | Enabled |
| Working Directory | `/home/user` |

## Python Environment

- **Python 3.11** with pip
- Virtual environment pre-activated
- All libraries installed at sandbox build time (no install delay at runtime)

## Pre-installed Libraries

| Category | Libraries |
|----------|-----------|
| Data | numpy, pandas, polars, scipy |
| Visualization | matplotlib, seaborn, plotly |
| ML | scikit-learn, xgboost |
| Web | requests, beautifulsoup4, httpx |
| Utilities | pillow, openpyxl, pyyaml, jinja2 |

::: tip
You can install additional packages at runtime with `pip install`, but pre-installed libraries are available instantly with no startup cost.
:::

## Use Cases

- Data analysis and transformation (CSV, JSON, Excel)
- Chart and visualization generation
- Mathematical and statistical computations
- Machine learning model training and inference
- Web scraping and API data collection
- File format conversion

## Create a Sandbox

<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
  <span style="background:#22c55e;color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700">POST</span>
  <code>/sandboxes</code>
</div>

```bash
curl -X POST https://api.sandbase.ai/sandboxes \
  -H "Authorization: Bearer sk-sb-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "templateID": "code_interpreter",
    "timeout": 300
  }'
```

**Response:**

```json
{
  "sandboxID": "sbx_01abc...",
  "templateID": "code_interpreter",
  "clientID": "SandBase",
  "status": "running",
  "startedAt": "2024-07-01T12:00:00Z",
  "endAt": "2024-07-01T12:05:00Z"
}
```

## Run Code

Once the sandbox is running, execute Python code via the [exec endpoint](/api-reference/sandboxes/exec):

```bash
curl -X POST https://api.sandbase.ai/sandboxes/sbx_01abc.../processes \
  -H "Authorization: Bearer sk-sb-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "cmd": "python3",
    "args": ["-c", "import pandas as pd; print(pd.DataFrame({\"x\": [1,2,3]}).describe())"]
  }'
```

## Full Example — Data Analysis Pipeline

```python
import requests

BASE = "https://api.sandbase.ai"
HEADERS = {"Authorization": "Bearer sk-sb-YOUR_KEY"}

# 1. Create sandbox (~60ms)
sandbox = requests.post(f"{BASE}/sandboxes", headers=HEADERS, json={
    "templateID": "code_interpreter",
    "timeout": 300
}).json()

sandbox_id = sandbox["sandboxID"]

# 2. Run data analysis
code = """
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

# Generate sample data
data = pd.DataFrame({
    'date': pd.date_range('2024-01-01', periods=90),
    'revenue': np.random.normal(1000, 200, 90).cumsum(),
    'users': np.random.poisson(50, 90)
})

# Analysis
print("=== Summary ===")
print(data.describe().to_string())
print(f"\\nTotal revenue: ${data['revenue'].iloc[-1]:,.0f}")
print(f"Avg daily users: {data['users'].mean():.1f}")

# Save chart
plt.figure(figsize=(10, 4))
plt.plot(data['date'], data['revenue'])
plt.title('Cumulative Revenue')
plt.savefig('/home/user/chart.png', dpi=100)
print("\\nChart saved to /home/user/chart.png")
"""

result = requests.post(
    f"{BASE}/sandboxes/{sandbox_id}/processes",
    headers=HEADERS,
    json={"cmd": "python3", "args": ["-c", code]}
).json()

print(result["stdout"])

# 3. Download the generated chart
chart = requests.get(
    f"{BASE}/sandboxes/{sandbox_id}/files?path=/home/user/chart.png",
    headers=HEADERS
)

# 4. Clean up
requests.delete(f"{BASE}/sandboxes/{sandbox_id}", headers=HEADERS)
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `timeout` | integer | 300 | Sandbox lifetime in seconds (max 3600) |
| `metadata` | object | `{}` | Custom key-value metadata |
| `envVars` | object | `{}` | Environment variables injected at boot |

### Custom timeout and metadata

```json
{
  "templateID": "code_interpreter",
  "timeout": 900,
  "metadata": {
    "project": "quarterly-report",
    "user": "analyst-1"
  }
}
```

### Environment variables

```json
{
  "templateID": "code_interpreter",
  "timeout": 300,
  "envVars": {
    "DATABASE_URL": "postgresql://...",
    "API_TOKEN": "tok_..."
  }
}
```

## Related

- [Create Sandbox](/api-reference/sandbox-api) — Full create endpoint reference
- [Execute Command](/api-reference/sandboxes/exec) — Run commands in a sandbox
- [File Operations](/api-reference/sandboxes/files) — Upload/download files
- [Sandbox Lifecycle](/agents/sandbox-lifecycle) — States, timeouts, pause/resume
- [All Templates](/api-reference/sandboxes/templates) — Overview of available templates
