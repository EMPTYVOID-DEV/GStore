# GStore CLI

**GStore CLI** simplifies the integration of GStore into your automated workflows, such as backups and CI/CD pipelines. It provides a robust and user-friendly interface to streamline common tasks while ensuring reliability through optional file tracking and clean logging.

## **Features**

1. **JSON-Based Configuration**:  
   Easily configure the CLI with a JSON file to declare the API key, API host, and actions to execute.
2. **File Tracking** _(Optional)_:  
   Prevent duplicate file creations by specifying a `trackingFile` in your configuration. The CLI will track file paths and their corresponding remote IDs.

3. **Input Validation with Zod**:  
   All input files and configurations are validated using Zod, ensuring correctness and preventing errors.

4. **JSON Schema Generation**:  
   Generate JSON schemas directly through the CLI to enable autocompletion and validation for your configuration and tracking files.

5. **Clean Logging**:  
   Get clear and structured logs for every action executed, making it easier to debug and monitor your workflows.

## **How It Works**

1. **Configuration File**:  
   Start by creating a JSON configuration file. Specify:

   - Your GStore API key.
   - The API host.
   - The actions you want to perform.
   - (Optional) A `trackingFile` path to keep a local record of file IDs.

2. **Actions**:  
   Actions can either:

   - Correspond directly to GStore API endpoints (e.g., `create`, `delete`, `update`).
   - Extend functionality with wrappers like `createDir`, which uploads all files in a directory.

3. **File Tracking**:  
   If you enable tracking, the CLI will map local file paths to their corresponding remote IDs. This ensures the same file isn’t created twice during subsequent runs.

## **Available Actions**

The CLI focuses on actions that are most useful for automation, leaving out actions like reading or listing files. Currently supported actions include:

- **`create`**: Upload a single file.
- **`createDir`**: Upload all files within a specified directory.
- **`delete`**: Delete a file by its remote ID.
- **`update`**: Update an existing file.

## **Getting Started**

### **Step 1: Install the CLI**

Make sure you have Node.js installed, then install the CLI globally via npm:

```bash
npm install -g @gstore-org/cli
```

### **Step 2: Generating Schema**

Generate JSON schemas for your configuration and tracking files to enable editor autocompletion:

```bash
gstore-cli generate-schema
```

### **Step 3: Create a Configuration File**

Define your actions in a JSON configuration file, specifying your API details, actions, and optional tracking.

**Example Configuration File (`config.json`):**

```json
{
  "$schema": "./config.schema.json",
  "key": "your-api-key",
  "host": "https://api.gstore.io",
  "trackingFile": "./tracking.json",
  "actions": [{ "name": "create", "data": { "path": "./image.jpg", "isPublic": true, "tags": ["image"] } }]
}
```

### **Step 4: Run the CLI**

Execute the desired actions by pointing the CLI to your configuration file:

```bash
gstore-cli sync --configPath config.json
```
