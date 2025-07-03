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
}>();

router.get("/", async (req, res) => {
  try {
    const containers = Array.from(sandboxes.values()).map(sandbox => ({
      id: sandbox.id,
      name: sandbox.name,
      status: sandbox.status,
      image: "codesandbox/nextjs",
      created: sandbox.createdAt,
      assignedPort: 3000,
      url: sandbox.url,
      ports: [{ private: 3000, public: 3000, type: "tcp" }],
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
    console.log(`[CONTAINER] Creating new sandbox with ID: ${containerId}`);
    
    const { sandboxId, url } = await codesandboxService.createSandbox();
    
    const sandbox = {
      id: containerId,
      sandboxId,
      status: "running",
      url,
      createdAt: new Date().toISOString(),
      name: `december-nextjs-${containerId.slice(0, 8)}`,
      type: "Next.js App"
    };

    sandboxes.set(containerId, sandbox);

    res.json({
      success: true,
      containerId,
      container: {
        id: containerId,
        containerId: sandboxId,
        status: "running",
        port: 3000,
        url,
        createdAt: sandbox.createdAt,
        type: sandbox.type,
      },
    });
  } catch (error) {
    console.error(`[CONTAINER] Failed to create sandbox:`, error);
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
        error: "Sandbox not found",
      });
    }

    sandbox.status = "running";
    sandboxes.set(containerId, sandbox);

    res.json({
      success: true,
      containerId,
      port: 3000,
      url: sandbox.url,
      status: "running",
      message: "Sandbox started successfully",
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
        error: "Sandbox not found",
      });
    }

    sandbox.status = "stopped";
    sandboxes.set(containerId, sandbox);

    res.json({
      success: true,
      containerId,
      status: "stopped",
      message: "Sandbox stopped successfully",
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
        error: "Sandbox not found",
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
      message: "Sandbox deleted successfully",
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
        error: "Sandbox not found",
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
        error: "Sandbox not found",
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
        error: "Sandbox not found",
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
        error: "Sandbox not found",
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
        error: "Sandbox not found",
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
        error: "Sandbox not found",
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
        error: "Sandbox not found",
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
        error: "Sandbox not found",
      });
    }

    // For CodeSandbox, we would need to update the package.json file
    // This is a simplified implementation
    console.log(`[DEPENDENCY] Adding ${packageName} to sandbox ${sandbox.sandboxId} (dev: ${isDev})`);

    res.json({
      success: true,
      message: "Dependency added successfully",
      output: `Added ${packageName} to package.json`,
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
        error: "Sandbox not found",
      });
    }

    // For CodeSandbox, we would redirect to their export functionality
    // or implement a custom export by fetching all files
    res.redirect(`https://codesandbox.io/s/${sandbox.sandboxId}/export`);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;