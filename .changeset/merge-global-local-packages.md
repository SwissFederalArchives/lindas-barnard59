---
"lindas-barnard59": patch
---

Fix package discovery to merge global and local packages

Previously, if global packages were found, local packages were not checked.
This caused pipelines in CI environments (which have global barnard59-core
installed) to fail to find locally installed packages like barnard59-base,
barnard59-formats, barnard59-csvw, etc.

Now both global and local packages are always merged together.
