---
"lindas-barnard59": patch
"lindas-barnard59-base": patch
"lindas-barnard59-core": patch
"lindas-barnard59-csvw": patch
"lindas-barnard59-cube": patch
"lindas-barnard59-env": patch
"lindas-barnard59-formats": patch
"lindas-barnard59-ftp": patch
"lindas-barnard59-graph-store": patch
"lindas-barnard59-http": patch
"lindas-barnard59-rdf": patch
"lindas-barnard59-s3": patch
"lindas-barnard59-shacl": patch
"lindas-barnard59-sparql": patch
"lindas-barnard59-validation": patch
---

Fix all import references to use lindas-barnard59 package names

Updated all source and test file imports to reference the renamed lindas-barnard59 packages instead of the old barnard59 names. External packages like barnard59-test-support remain unchanged.
