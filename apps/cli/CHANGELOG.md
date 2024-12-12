# @gstore-org/cli

## 1.2.4

### Patch Changes

- da7bdf6: 1-Replacing ora with regular logging.
  2-Fixing the handleError fn
  3-Ensuring the refreshTrackedFiles fn runs when loading the tracking file, no more skipChecking for each backup action.
  4-Fixing the backup method by ensuring the synced files are only related to action directory.

## 1.2.3

### Patch Changes

- a30245c: adding homapage to cli package.json to link to the readme

## 1.2.2

### Patch Changes

- 2ddf92b: Fixing the readme not showing up

## 1.2.1

### Batch Changes

- 8aa5994: bumping version to fix publishing to npm

## 1.2.0

### Minor Changes

- bb9a0a0: Adding backup action

## 1.1.0

### Minor Changes

- 96b4cd5: Migrating file apis from bun to node , because bun right now don't include polyfill for bun utils in the bundle which forces the user to have both bun and node installed.

## 1.0.0

### Major Changes

- 5beea5c: First major cli release
