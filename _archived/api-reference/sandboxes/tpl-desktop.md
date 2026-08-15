---
title: "Template: desktop"
description: "Full GUI desktop sandbox with XFCE, VNC streaming, Chrome, and VS Code. 8 vCPU, 8 GB RAM, boots in ~5s."
---

# desktop

Sandbox with a full graphical desktop environment (XFCE) accessible via VNC streaming. Ideal for browser automation, GUI testing, visual development, and any workflow that requires a display server. Boots in ~5s with Chrome, VS Code, and common desktop tools ready to use.

## Specs

| Property | Value |
|----------|-------|
| Template ID | `desktop` |
| Default Timeout | 600s (10 min) |
| CPU | 8 vCPU |
| Memory | 8 GB |
| Disk | 10 GB |
| Boot Time | ~5s |
| Internet | Enabled |
| Display | 1920×1080, 24-bit color |
| Working Directory | `/home/user` |

## GUI Environment

The desktop template runs a full X11 display server with the XFCE desktop environment. Access the graphical session via VNC streaming — no local display required.

- **Display server** — Xvfb at 1920×1080 resolution
- **Desktop environment** — XFCE 4 (lightweight, fast startup)
- **VNC server** — Built-in, streams the desktop to your client
- **Audio** — PulseAudio (virtual sink for screen recording)

::: tip
The VNC stream is available on port `6080` inside the sandbox. Use the exec endpoint or port forwarding to connect.
:::

## Pre-installed Software

- **Google Chrome** — Full browser with GPU acceleration disabled (headless-compatible)
- **VS Code** (code-server) — Browser-accessible IDE on port `8080`
- **File Manager** — Thunar (XFCE default)
- **Terminal** — xfce4-terminal
- **Node.js 20 LTS** with npm
- **Python 3.11** with pip
- **Git** — version control
- **Playwright** — browser automation framework
- **FFmpeg** — screen recording and video processing
- **Common utilities** — curl, wget, unzip, xdotool, xclip

## Use Cases

- **Browser automation** — Run Playwright, Puppeteer, or Selenium against a real Chrome instance with a visible display
- **GUI testing** — Test desktop applications, Electron apps, or browser extensions in a real graphical environment
- **Visual development** — Use VS Code in the browser for interactive coding sessions
- **Screen recording** — Capture video of automated workflows using FFmpeg + Xvfb
- **Web scraping** — Handle JavaScript-heavy sites that require a full browser with rendering
- **Demo generation** — Record product demos or tutorials programmatically
- **RPA workflows** — Automate repetitive GUI tasks with xdotool and image recognition

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
    "templateID": "desktop",
    "timeout": 600
  }'
```

**Response:**

```json
{
  "sandboxID": "sbx_01abc...",
  "templateID": "desktop",
  "clientID": "SandBase",
  "status": "running",
  "startedAt": "2024-07-01T12:00:00Z",
  "endAt": "2024-07-01T12:10:00Z"
}
```

## Connect to the Desktop (VNC)

Once the sandbox is running, connect to the VNC stream via the exec endpoint:

```bash
# Get the VNC URL (noVNC web client on port 6080)
curl -X POST https://api.sandbase.ai/sandboxes/sbx_01abc.../processes \
  -H "Authorization: Bearer sk-sb-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "cmd": "echo",
    "args": ["http://localhost:6080/vnc.html"]
  }'
```

You can also forward port `6080` to access the noVNC web client directly in your browser, or connect with any VNC client to port `5900`.

## Full Example — Browser Automation with Playwright

```python
import requests
import time

BASE = "https://api.sandbase.ai"
HEADERS = {"Authorization": "Bearer sk-sb-YOUR_KEY"}

# 1. Create desktop sandbox (~5s boot)
sandbox = requests.post(f"{BASE}/sandboxes", headers=HEADERS, json={
    "templateID": "desktop",
    "timeout": 600
}).json()

sandbox_id = sandbox["sandboxID"]

# Wait for desktop to initialize
time.sleep(5)

# 2. Run a Playwright script for browser automation
script = """
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    page = browser.new_page()
    page.goto("https://example.com")
    page.screenshot(path="/home/user/screenshot.png")
    print(f"Title: {page.title()}")
    browser.close()
"""

result = requests.post(
    f"{BASE}/sandboxes/{sandbox_id}/processes",
    headers=HEADERS,
    json={"cmd": "python3", "args": ["-c", script]}
).json()

print(result["stdout"])

# 3. Download the screenshot
file_content = requests.get(
    f"{BASE}/sandboxes/{sandbox_id}/files",
    headers=HEADERS,
    params={"path": "/home/user/screenshot.png"}
).content

with open("screenshot.png", "wb") as f:
    f.write(file_content)

# 4. Record the screen (5 seconds)
requests.post(
    f"{BASE}/sandboxes/{sandbox_id}/processes",
    headers=HEADERS,
    json={
        "cmd": "ffmpeg",
        "args": [
            "-f", "x11grab", "-video_size", "1920x1080",
            "-i", ":99", "-t", "5", "-y", "/home/user/recording.mp4"
        ]
    }
).json()

# 5. Clean up
requests.delete(f"{BASE}/sandboxes/{sandbox_id}", headers=HEADERS)
```

## Full Example — VS Code in the Browser

```python
import requests

BASE = "https://api.sandbase.ai"
HEADERS = {"Authorization": "Bearer sk-sb-YOUR_KEY"}

# 1. Create desktop sandbox
sandbox = requests.post(f"{BASE}/sandboxes", headers=HEADERS, json={
    "templateID": "desktop",
    "timeout": 1800
}).json()

sandbox_id = sandbox["sandboxID"]

# 2. Start code-server (VS Code) on port 8080
result = requests.post(
    f"{BASE}/sandboxes/{sandbox_id}/processes",
    headers=HEADERS,
    json={
        "cmd": "code-server",
        "args": ["--bind-addr", "0.0.0.0:8080", "--auth", "none", "/home/user"]
    }
).json()

# VS Code is now accessible via port 8080 on the sandbox
print(f"VS Code available at sandbox port 8080")

# 3. Clone a project into the workspace
requests.post(
    f"{BASE}/sandboxes/{sandbox_id}/processes",
    headers=HEADERS,
    json={"cmd": "git", "args": ["clone", "https://github.com/user/my-project.git"]}
).json()
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `timeout` | integer | 600 | Sandbox lifetime in seconds (max 3600) |
| `metadata` | object | `{}` | Custom key-value metadata |
| `envVars` | object | `{}` | Environment variables injected at boot |

### Custom resolution and timeout

```json
{
  "templateID": "desktop",
  "timeout": 1800,
  "envVars": {
    "DISPLAY_RESOLUTION": "1280x720",
    "VNC_PASSWORD": "my-secret"
  }
}
```

### With metadata for tracking

```json
{
  "templateID": "desktop",
  "timeout": 600,
  "metadata": {
    "task": "browser-automation",
    "target": "https://example.com",
    "recording": "true"
  }
}
```

### Additional environment variables

```json
{
  "templateID": "desktop",
  "timeout": 900,
  "envVars": {
    "PLAYWRIGHT_BROWSERS_PATH": "/home/user/.cache/ms-playwright",
    "NODE_ENV": "production",
    "GITHUB_TOKEN": "ghp_..."
  }
}
```

## Related

- [Create Sandbox](/api-reference/sandbox-api) — Full create endpoint reference
- [Execute Command](/api-reference/sandboxes/exec) — Run commands in a sandbox
- [File Operations](/api-reference/sandboxes/files) — Upload/download files
- [Sandbox Lifecycle](/agents/sandbox-lifecycle) — States, timeouts, pause/resume
- [All Templates](/api-reference/sandboxes/templates) — Overview of available templates
