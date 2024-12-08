# @gstore/api

## 1.4.0

### Minor Changes

- e078f2d: Changing list-files permission to access-metadata , this will encapsulate all storage operations that fetch files informations from db. For now we
  it contains list and search endpoints.

  Adding another api endpoint 'search' which searches for a file given the id.

## 1.3.0

### Minor Changes

- da80cbb: Making minor adjustments after moving the database logic into it own package

## 1.2.1

### Patch Changes

- 8e098a7: Replacing process.env with zod parsed env

## 1.2.0

### Minor Changes

- 83b407b: Making api list endpoint to accept name and extension filters

## 1.1.0

### Minor Changes

- 98a1136: Adding info endpoints and organzing the docs with tags.

## 1.0.0

### Major Changes

- 2fa345a: V1
