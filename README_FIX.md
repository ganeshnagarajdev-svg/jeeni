# How to Fix Missing Images

The system was unable to automatically run the script to download images due to environmental restrictions. Please follow these steps to fix the issue manually.

## Prerequisites

- **Node.js** installed on your system.

## Steps

1. **Open a terminal** (Command Prompt or PowerShell) and navigate to the backend folder:

   ```bash
   cd "c:\Users\Ganesh\Desktop\New folder\Jeeni\backend"
   ```

2. **Initialize and install dependencies**:

   ```bash
   npm init -y
   npm install pg axios dotenv
   ```

3. **Run the image update script**:

   ```bash
   node update_images.js
   ```

4. **Verify**:
   - Check if the `uploads/products` folder now contains images.
   - Refresh the website to see the images.

**Note:** The frontend configuration has already been updated to point to these downloaded images (`http://localhost:8000/uploads`).
