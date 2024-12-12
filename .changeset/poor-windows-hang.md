---
"@gstore-org/cli": patch
---

1-Replacing ora with regular logging.
2-Fixing the handleError fn
3-Ensuring the refreshTrackedFiles fn runs when loading the tracking file, no more skipChecking for each backup action.
4-Fixing the backup method by ensuring the synced files are only related to action directory.
