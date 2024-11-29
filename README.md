# GStore

GStore is a self-hosted storage solution for institutions, companies, and developers. It provides a centralized management interface and API for file storage, featuring advanced capabilities like file transformations and granular access control.

## Features

- **Central Application**
  - User authentication
  - User management through an admin account
  - Virtual store management (creation and deletion)
  - API key management with customizable permissions and expiration
  - File browsing across stores
- **Storage API**
  - Complete file operations (create, read, update, delete, list)
  - Built-in file transformations
    - Image processing
    - PDF manipulation
    - Video encoding
  - Public and private file support
  - API key authentication
  - Comprehensive API documentation with Swagger UI
  - Request validation using Zod (parameters, query, body)
  - Rate limiting and file size controls
- **Additional Applications**
  - Command-line interface for automation and CI/CD integration
  - Desktop application for visual file management (in development)

## Architecture

![Architecture v1](./assets/architectureV1.png)

- **Central Application**: SvelteKit-based management interface (`central.domain`)
- **API**: Hono Bun server for file operations (`api.domain`)
- **Database**: PostgreSQL for metadata storage
- **Proxy**: Traefik for routing and API gateway functionality
- **Storage**: File system-based storage solution

## Implementation Details

### Workflow

1. Access the central application
2. Create a storage instance
3. Generate an API key
4. Interact with API endpoints using the generated key!

![Storage Flow](./assets/storage_flow.png)

#### Important Notes

1. Usernames are unique and stored in lowercase
2. Admin account creation occurs during database migration. You just need to specify admin username and password in .env.
3. Admins can create additional user accounts

### Storage System

GStore maintains file metadata in a database while storing actual content in the file system. File metadata :

- Name
- Extension
- Size
- Creation timestamp
- Visibility status
- Tags
- Store identifier
- Index

Files can be tagged for organization (e.g., ["images", "png"]) and downloaded collectively by tag groups. The system supports both public (statically accessible) and private files.

Each file will have a unique identifier called **index** which is the name of file in the file system.

### Transformations

File transformations operate on existing store content. Most transformations follow this request format:`json
{
  "id": "EILvhPP_",  "outputMethod": { "type": "return" }
}`

- `id`: Target file identifier
- `outputMethod`: Result handling specification (return, create new file, or update existing file)

Some transformations may require additional parameters or use different request formats.

## Project Structure

The project uses a monorepo organization:

```
gstore/
├── apps/
│   ├── api/
│   ├── cli/
│   ├── desktop/
│   └── central/
├── packages/
│   └── db/
├── docker/
└── .env.example
```

1. Applications directory containing all components
2. Shared packages for common functionality
3. Docker files
4. Under each workspace you will have a readme and optionally a .env.example.

## Usage

How to run GStore may vary based on your setup. The following are our recommendations for running GStore in development and production.

### Development Environment

1. `git clone git@github.com:EMPTYVOID-DEV/g-store.git`
2. Copy `.env.example` to `.env` and configure
3. `docker-compose -f docker/docker-compose.dev.yml --env-file=.env up`

#### Testing Development on a VPS

If you plan to test the development environment on a VPS, you need to configure your local machine's /etc/hosts file. This is necessary to ensure the domain names used in the project resolve to the VPS IP address.

  1. Open your /etc/hosts file using a text editor with administrative privileges:
  `sudo nano /etc/hosts`
  2. Add entries for your domain names pointing to the VPS IP:
  ```
  <VPS_IP> central.domain
  <VPS_IP> api.domain
  <VPS_IP> traefik.domain
  ```
  Replace <VPS_IP> with the actual IP address of your VPS.
  3. Save the file and exit.

This setup allows your local machine to resolve *central.domain*, *api.domain*, and *traefik.domain* to the VPS IP for testing purposes. Ensure that the domains used in your .env file match these entries.


### Production Environment

1. Configure domain name
2. Set up DNS records for `api.domain`, `central.domain`, and `traefik.domain`
3. Configure `.env` file
4. `docker-compose -f docker/docker-compose.prod.yml --env-file=.env up`

## Additional Applications

- **Command Line Interface**: Available for automation tasks, cron jobs, and CI/CD workflows
- **Desktop Application**: Currently under development, provides visual interface for API interaction

## Future Enhancements (V2)

- **Advanced Monitoring**: ELK stack integration
- **Scaling Capabilities**:
  - KEDA-based request scaling
  - NFS storage for distributed systems

## License

This project is licensed under the MIT License - see the [LICENSE](https://opensource.org/license/mit) for details.
