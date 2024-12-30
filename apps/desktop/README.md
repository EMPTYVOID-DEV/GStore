# GStore Desktop

GStore Desktop is a user-friendly desktop application that serves as a UI wrapper over HTTP requests to the GStore API. It provides a visual interface for managing files, making it easier to interact with the GStore system without needing to use the command line or direct API calls.

## Features

Currently the desktop supports the following operations create, update, delete, read, and list. In future we looking at adding backup operation to map lock files and the files stored remotely.

## Tech Stack

- **SvelteKit**: Frontend framework for building the UI with adapter static SPA mode.
- **Tauri**: Framework for building the desktop application.
- **TypeScript**: Strongly typed programming language for better code quality.

## Releases

Currently working on integrating versioning and building releases of the desktop app into CI/CD like the other packages. The issue is tauri uses rust which changeset does not support so until we find a workaround there will be no releases.
