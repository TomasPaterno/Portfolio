# Adding a project (JSON-first)

Drop a new `.json` file in this folder. The site discovers it automatically — no route or registry edits.

## Quick start

1. Copy the template below to `my-project.json`
2. Add images under `public/images/projects/my-project/`
3. Set `"featured": true` to show on the homepage
4. Run `npm run dev` and open `/projects/my-project`

## JSON template

```json
{
  "title": "Project Title",
  "description": "Long overview for the project detail page.",
  "shortDescription": "One line for cards and SEO.",
  "tags": ["embedded", "robotics"],
  "technologies": ["STM32", "C", "FreeRTOS"],
  "coverImage": "/images/projects/my-project/cover.jpg",
  "galleryImages": [],
  "githubUrl": "https://github.com/you/repo",
  "demoUrl": "https://example.com",
  "featured": false,
  "date": "2026-03-01",
  "status": "completed",
  "markdownContent": "## Optional write-up\n\nSupports **Markdown** via MDX compiler.",
  "technicalDetails": [
    { "label": "MCU", "value": "STM32F4" }
  ],
  "metrics": [
    { "label": "Loop rate", "value": "1", "unit": "kHz" }
  ],
  "videoUrl": "https://www.youtube.com/embed/VIDEO_ID"
}
```

## Field reference

| Field | Required | Description |
|-------|----------|-------------|
| `title` | yes | Display name |
| `description` | yes | Overview paragraph |
| `shortDescription` | yes | Card + meta description |
| `tags` | yes | Filter chips on `/projects` |
| `technologies` | yes | Stack badges |
| `coverImage` | yes | Path under `public/` |
| `galleryImages` | no | Array of image paths |
| `githubUrl` | no | Source link |
| `demoUrl` | no | Live demo link |
| `featured` | no | Homepage section (default `false`) |
| `date` | yes | ISO date string |
| `status` | yes | `completed` \| `in-progress` \| `archived` |
| `markdownContent` | no | Markdown body on detail page |
| `technicalDetails` | no | `{ label, value }[]` spec table |
| `metrics` | no | `{ label, value, unit? }[]` results |
| `videoUrl` | no | Embed URL (e.g. YouTube embed) |

## MDX alternative

Create `my-project.mdx` with YAML frontmatter (same fields) and Markdown body. See `fpga-signal-processor.mdx` for an example.

## Slug

The URL slug is the **filename** without extension: `my-project.json` → `/projects/my-project`.
