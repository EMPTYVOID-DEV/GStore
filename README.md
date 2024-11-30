# GStore

GStore is a self-hosted storage solution designed for organizations and developers. It offers a centralized management interface and an API for seamless file storage, coupled with advanced features like file transformations and granular access control.

## Features

- **Central Application**
  - User authentication
  - User management through an admin account
  - Virtual store management (creation and deletion)
  - API key management with customizable permissions and expiration settings
- **Storage API**
  - Comprehensive file operations (create, read, update, delete, list)
  - Integrated file transformation capabilities:
    - Image processing
    - PDF manipulation
    - Video encoding
  - Support for both public and private files
  - API key-based authentication
  - Extensive API documentation with Scalar UI
  - Request validation leveraging Zod (parameters, queries, bodies)
  - Rate limiting and file size restrictions
- **Additional Applications**
  - Command-line interface (CLI) for automation and CI/CD workflows
  - Desktop application for visual file management (currently under development)

## Architecture

![Architecture v1](./assets/architectureV1.png)

- **Central Application**: SvelteKit-based management interface (`central.domain`)
- **API**: Hono Bun server handling file operations (`api.domain`)
- **Database**: PostgreSQL used for metadata storage
- **Proxy**: Traefik acting as the routing and API gateway (`traefik.domain`)
- **Storage**: File system-based solution for efficient storage
- **External Components**: The desktop application, CLI, and other integrations only access the system via the proxy.

## Project Structure

The project follows a monorepo architecture:

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

1. The `apps/` directory contains the various applications.
2. The `packages/` directory houses shared functionality and utilities.
3. Docker configuration files are included in the `docker/` folder.
4. Each workspace has a dedicated `README` file with specific details and an optional `.env.example` template.

## Usage

Follow these steps to set up and run GStore:

1. **Install prerequisites**: Ensure [Docker](https://docs.docker.com/engine/install/) and [Docker Compose](https://docs.docker.com/compose/install/) are installed. The setup might vary depending on your environment.

2. **Clone the GStore repository**:

   ```bash
   git clone https://github.com/EMPTYVOID-DEV/GStore
   ```

3. **Create a `.env` file** based on the provided `.env.example` template.

4. **Run Docker Compose**:

   ```bash
   docker-compose -f docker/docker-compose.dev.yml --env-file=.env up
   ```

   Use the appropriate Compose file for production or development environments.

5. **Access the Central Application**: Log in using the admin credentials.

6. **Set up a store**: Create a new store and generate an API key for it.

7. **Interact with the API**: Access the API via external tools like the CLI, desktop application, Postman, or other backend systems using the API key.

### Notes

- Usernames are case-insensitive and stored in lowercase.
- The admin account is created during database migration. Specify the admin username and password in the `.env` file.
- Admins can create additional user accounts.

#### For Production Deployments:

1. **Public Domain Setup**:
   - Ensure your VPS is configured with a public domain. This is necessary for Traefik to automatically generate SSL certificates.
2. **Port Configuration**:
   - Make sure ports 80 and 443 are exposed on your VPS. Check your firewall rules to confirm.
3. **DNS Records**:
   - Update your DNS records to point the required subdomains (`api.domain`, `central.domain`, `traefik.domain`) to your VPS IP address.

#### For Development Environments:

1. **Running on a VPS**:
   - Modify your local `/etc/hosts` file to map your VPS IP address to the required subdomains (`api.domain`, `central.domain`, `traefik.domain`).
2. **Running Locally**:
   - DNS configuration is not needed. The services will be accessible locally without further setup.

## Future Enhancements (V2)

- **Advanced Monitoring**: Integration with the ELK stack for comprehensive monitoring and logging.
- **Scalability**:
  - Request scaling with KEDA.
  - Support for distributed systems using NFS-based storage.
- **Adapters**: Enable GStore to act as a proxy for various external storage providers.

## License

This project is licensed under the MIT License. For more details, refer to the [LICENSE](https://opensource.org/license/mit).
