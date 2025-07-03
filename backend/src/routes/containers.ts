import express from "express";
import { v4 as uuidv4 } from "uuid";
import * as codesandboxService from "../services/codesandbox";
import * as fileService from "../services/file";

const router = express.Router();

// In-memory storage for sandbox metadata
const sandboxes = new Map<string, {
  id: string;
  sandboxId: string;
  status: string;
  url: string;
  createdAt: string;
  name: string;
  type: string;
  port?: number;
}>();

router.get("/", async (req, res) => {
  try {
    const containers = Array.from(sandboxes.values()).map(sandbox => ({
      id: sandbox.id,
      name: sandbox.name,
      status: sandbox.status,
      image: "december/nextjs",
      created: sandbox.createdAt,
      assignedPort: sandbox.port || 3001,
      url: sandbox.url,
      ports: [{ private: sandbox.port || 3001, public: sandbox.port || 3001, type: "tcp" }],
      labels: { project: "december", type: "nextjs-app" }
    }));

    res.json({
      success: true,
      containers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.post("/create", async (req, res) => {
  const containerId = uuidv4();

  try {
    console.log(`[CONTAINER] Creating new local development environment with ID: ${containerId}`);
    
    const { sandboxId, url } = await codesandboxService.createSandbox();
    
    // Extract port from URL if possible
    const portMatch = url.match(/:(\d+)/);
    const port = portMatch ? parseInt(portMatch[1]) : 3001;
    
    const sandbox = {
      id: containerId,
      sandboxId,
      status: "running",
      url,
      createdAt: new Date().toISOString(),
      name: `december-nextjs-${containerId.slice(0, 8)}`,
      type: "Next.js App",
      port
    };

    sandboxes.set(containerId, sandbox);

    res.json({
      success: true,
      containerId,
      container: {
        id: containerId,
        containerId: sandboxId,
        status: "running",
        port,
        url,
        createdAt: sandbox.createdAt,
        type: sandbox.type,
      },
    });
  } catch (error) {
    console.error(`[CONTAINER] Failed to create development environment:`, error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.post("/:containerId/start", async (req, res) => {
  const { containerId } = req.params;

  try {
    const sandbox = sandboxes.get(containerId);
    if (!sandbox) {
      return res.status(404).json({
        success: false,
        error: "Development environment not found",
      });
    }

    sandbox.status = "running";
    sandboxes.set(containerId, sandbox);

    res.json({
      success: true,
      containerId,
      port: sandbox.port || 3001,
      url: sandbox.url,
      status: "running",
      message: "Development environment started successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.post("/:containerId/stop", async (req, res) => {
  const { containerId } = req.params;

  try {
    const sandbox = sandboxes.get(containerId);
    if (!sandbox) {
      return res.status(404).json({
        success: false,
        error: "Development environment not found",
      });
    }

    sandbox.status = "stopped";
    sandboxes.set(containerId, sandbox);

    res.json({
      success: true,
      containerId,
      status: "stopped",
      message: "Development environment stopped successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.delete("/:containerId", async (req, res) => {
  const { containerId } = req.params;

  try {
    const sandbox = sandboxes.get(containerId);
    if (!sandbox) {
      return res.status(404).json({
        success: false,
        error: "Development environment not found",
      });
    }

    try {
      await codesandboxService.deleteSandbox(sandbox.sandboxId);
    } catch (deleteError) {
      console.warn(`[CONTAINER] Failed to delete sandbox ${sandbox.sandboxId}:`, deleteError);
    }

    sandboxes.delete(containerId);

    res.json({
      success: true,
      containerId,
      message: "Development environment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.get("/:containerId/files", async (req, res) => {
  const { containerId } = req.params;
  const { path: containerPath = "/" } = req.query;

  try {
    const sandbox = sandboxes.get(containerId);
    if (!sandbox) {
      return res.status(404).json({
        success: false,
        error: "Development environment not found",
      });
    }

    const files = await fileService.listFiles(sandbox.sandboxId, containerPath as string);

    res.json({
      success: true,
      path: containerPath,
      files,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.get("/:containerId/file-tree", async (req, res) => {
  const { containerId } = req.params;

  try {
    const sandbox = sandboxes.get(containerId);
    if (!sandbox) {
      return res.status(404).json({
        success: false,
        error: "Development environment not found",
      });
    }

    const fileTree = await fileService.getFileTree(sandbox.sandboxId);

    res.json({
      success: true,
      fileTree,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.get("/:containerId/file-content-tree", async (req, res) => {
  const { containerId } = req.params;

  try {
    const sandbox = sandboxes.get(containerId);
    if (!sandbox) {
      return res.status(404).json({
        success: false,
        error: "Development environment not found",
      });
    }

    const fileContentTree = await fileService.getFileContentTree(sandbox.sandboxId);

    res.json({
      success: true,
      fileContentTree,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.get("/:containerId/file", async (req, res) => {
  const { containerId } = req.params;
  const { path: filePath } = req.query;

  if (!filePath) {
    return res.status(400).json({
      success: false,
      error: "File path is required",
    });
  }

  try {
    const sandbox = sandboxes.get(containerId);
    if (!sandbox) {
      return res.status(404).json({
        success: false,
        error: "Development environment not found",
      });
    }

    const content = await fileService.readFile(sandbox.sandboxId, filePath as string);

    res.json({
      success: true,
      content,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.put("/:containerId/files", async (req, res) => {
  const { containerId } = req.params;
  const { path: filePath, content } = req.body;

  try {
    const sandbox = sandboxes.get(containerId);
    if (!sandbox) {
      return res.status(404).json({
        success: false,
        error: "Development environment not found",
      });
    }

    await fileService.writeFile(sandbox.sandboxId, filePath, content);

    res.json({
      success: true,
      message: "File updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.put("/:containerId/files/rename", async (req, res) => {
  const { containerId } = req.params;
  const { oldPath, newPath } = req.body;

  try {
    const sandbox = sandboxes.get(containerId);
    if (!sandbox) {
      return res.status(404).json({
        success: false,
        error: "Development environment not found",
      });
    }

    await fileService.renameFile(sandbox.sandboxId, oldPath, newPath);

    res.json({
      success: true,
      message: "File renamed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.delete("/:containerId/files", async (req, res) => {
  const { containerId } = req.params;
  const { path: filePath } = req.body;

  try {
    const sandbox = sandboxes.get(containerId);
    if (!sandbox) {
      return res.status(404).json({
        success: false,
        error: "Development environment not found",
      });
    }

    await fileService.removeFile(sandbox.sandboxId, filePath);

    res.json({
      success: true,
      message: "File removed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.post("/:containerId/dependencies", async (req, res) => {
  const { containerId } = req.params;
  const { packageName, isDev = false } = req.body;

  try {
    const sandbox = sandboxes.get(containerId);
    if (!sandbox) {
      return res.status(404).json({
        success: false,
        error: "Development environment not found",
      });
    }

    // Execute npm install command
    const { executeCommand } = require("../services/codesandbox");
    const command = `npm install ${packageName}${isDev ? ' --save-dev' : ''}`;
    const result = await executeCommand(sandbox.sandboxId, command);

    res.json({
      success: true,
      message: "Dependency added successfully",
      output: result.output,
      error: result.error,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Terminal endpoint
router.post("/:containerId/terminal", async (req, res) => {
  const { containerId } = req.params;
  const { command } = req.body;

  try {
    const sandbox = sandboxes.get(containerId);
    if (!sandbox) {
      return res.status(404).json({
        success: false,
        error: "Development environment not found",
      });
    }

    const { executeCommand } = require("../services/codesandbox");
    const result = await executeCommand(sandbox.sandboxId, command);

    res.json({
      success: true,
      output: result.output,
      error: result.error,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.get("/:containerId/export", async (req, res) => {
  const { containerId } = req.params;

  try {
    const sandbox = sandboxes.get(containerId);
    if (!sandbox) {
      return res.status(404).json({
        success: false,
        error: "Development environment not found",
      });
    }

    // Create a ZIP file of the project
    const archiver = require('archiver');
    const path = require('path');
    
    const projectDir = path.join(process.cwd(), 'sandboxes', sandbox.sandboxId);
    
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="december-project-${containerId.slice(0, 8)}.zip"`);
    
    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(res);
    
    archive.directory(projectDir, false);
    archive.finalize();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;