---
"lindas-barnard59": patch
---

Add backwards compatibility for barnard59-* packages

The CLI now discovers both lindas-barnard59-* and barnard59-* packages,
allowing pipelines to use operations from the original barnard59-formats,
barnard59-csvw, barnard59-cube, etc. packages alongside lindas packages.
