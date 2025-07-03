import { getSandbox, updateSandboxFile } from "./codesandbox";

export interface FileItem {
  name: string;
  path: string;
  type: "file" | "directory";
  children?: FileItem[];
  content?: string;
}

export interface FileContentItem {
  name: string;
  path: string;
  type: "file" | "directory";
  content?: string;
  children?: FileContentItem[];
}

export async function getFileTree(sandboxId: string): Promise<FileItem[]> {
  console.log(`[FILE] Getting file tree for sandbox: ${sandboxId}`);
  
  const fs = require('fs').promises;
  const path = require('path');
  
  try {
    const projectDir = path.join(process.cwd(), 'sandboxes', sandboxId);
    
    const buildFileTree = async (dirPath: string, relativePath: string = ""): Promise<FileItem[]> => {
      const items: FileItem[] = [];
      
      try {
        const entries = await fs.readdir(dirPath, { withFileTypes: true });
        
        for (const entry of entries) {
          // Skip node_modules, .next, and other build directories
          if (['node_modules', '.next', '.git', 'dist', 'build'].includes(entry.name)) {
            continue;
          }
          
          const fullPath = path.join(dirPath, entry.name);
          const itemPath = relativePath ? `${relativePath}/${entry.name}` : entry.name;
          
          if (entry.isDirectory()) {
            const children = await buildFileTree(fullPath, itemPath);
            items.push({
              name: entry.name,
              path: itemPath,
              type: "directory",
              children
            });
          } else {
            items.push({
              name: entry.name,
              path: itemPath,
              type: "file"
            });
          }
        }
      } catch (error) {
        console.warn(`[FILE] Could not read directory ${dirPath}:`, error);
      }
      
      return items.sort((a, b) => {
        // Directories first, then files
        if (a.type !== b.type) {
          return a.type === 'directory' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });
    };
    
    const fileTree = await buildFileTree(projectDir);
    console.log(`[FILE] File tree retrieved with ${fileTree.length} root items`);
    return fileTree;
  } catch (error) {
    console.error(`[FILE] Failed to get file tree for ${sandboxId}:`, error);
    throw error;
  }
}

export async function getFileContentTree(sandboxId: string): Promise<FileContentItem[]> {
  console.log(`[FILE] Getting file content tree for sandbox: ${sandboxId}`);
  
  const fs = require('fs').promises;
  const path = require('path');
  
  try {
    const projectDir = path.join(process.cwd(), 'sandboxes', sandboxId);
    
    const buildContentTree = async (dirPath: string, relativePath: string = ""): Promise<FileContentItem[]> => {
      const items: FileContentItem[] = [];
      
      try {
        const entries = await fs.readdir(dirPath, { withFileTypes: true });
        
        for (const entry of entries) {
          // Skip node_modules, .next, and other build directories
          if (['node_modules', '.next', '.git', 'dist', 'build'].includes(entry.name)) {
            continue;
          }
          
          const fullPath = path.join(dirPath, entry.name);
          const itemPath = relativePath ? `${relativePath}/${entry.name}` : entry.name;
          
          if (entry.isDirectory()) {
            const children = await buildContentTree(fullPath, itemPath);
            items.push({
              name: entry.name,
              path: itemPath,
              type: "directory",
              children
            });
          } else {
            try {
              // Read file content for text files
              const stats = await fs.stat(fullPath);
              if (stats.size < 1024 * 1024) { // Only read files smaller than 1MB
                const content = await fs.readFile(fullPath, 'utf8');
                items.push({
                  name: entry.name,
                  path: itemPath,
                  type: "file",
                  content
                });
              } else {
                items.push({
                  name: entry.name,
                  path: itemPath,
                  type: "file",
                  content: "// File too large to display"
                });
              }
            } catch (readError) {
              // Binary file or read error
              items.push({
                name: entry.name,
                path: itemPath,
                type: "file",
                content: "// Binary file or read error"
              });
            }
          }
        }
      } catch (error) {
        console.warn(`[FILE] Could not read directory ${dirPath}:`, error);
      }
      
      return items.sort((a, b) => {
        // Directories first, then files
        if (a.type !== b.type) {
          return a.type === 'directory' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });
    };
    
    const contentTree = await buildContentTree(projectDir);
    console.log(`[FILE] File content tree retrieved with ${contentTree.length} root items`);
    return contentTree;
  } catch (error) {
    console.error(`[FILE] Failed to get file content tree for ${sandboxId}:`, error);
    throw error;
  }
}

export async function readFile(sandboxId: string, filePath: string): Promise<string> {
  console.log(`[FILE] Reading file: ${filePath} from sandbox: ${sandboxId}`);
  
  const fs = require('fs').promises;
  const path = require('path');
  
  try {
    const projectDir = path.join(process.cwd(), 'sandboxes', sandboxId);
    const fullPath = path.join(projectDir, filePath);
    
    const content = await fs.readFile(fullPath, 'utf8');
    console.log(`[FILE] File read successfully: ${filePath}`);
    return content;
  } catch (error) {
    console.error(`[FILE] Failed to read file ${filePath}:`, error);
    throw error;
  }
}

export async function writeFile(sandboxId: string, filePath: string, content: string): Promise<void> {
  console.log(`[FILE] Writing file: ${filePath} to sandbox: ${sandboxId} (${content.length} characters)`);
  
  const fs = require('fs').promises;
  const path = require('path');
  
  try {
    const projectDir = path.join(process.cwd(), 'sandboxes', sandboxId);
    const fullPath = path.join(projectDir, filePath);
    const dir = path.dirname(fullPath);
    
    // Ensure directory exists
    await fs.mkdir(dir, { recursive: true });
    
    // Write file
    await fs.writeFile(fullPath, content, 'utf8');
    console.log(`[FILE] File written successfully: ${filePath}`);
  } catch (error) {
    console.error(`[FILE] Failed to write file ${filePath}:`, error);
    throw error;
  }
}

export async function renameFile(sandboxId: string, oldPath: string, newPath: string): Promise<void> {
  console.log(`[FILE] Renaming file: ${oldPath} → ${newPath} in sandbox: ${sandboxId}`);
  
  const fs = require('fs').promises;
  const path = require('path');
  
  try {
    const projectDir = path.join(process.cwd(), 'sandboxes', sandboxId);
    const oldFullPath = path.join(projectDir, oldPath);
    const newFullPath = path.join(projectDir, newPath);
    const newDir = path.dirname(newFullPath);
    
    // Ensure target directory exists
    await fs.mkdir(newDir, { recursive: true });
    
    // Rename file
    await fs.rename(oldFullPath, newFullPath);
    console.log(`[FILE] File renamed successfully: ${oldPath} → ${newPath}`);
  } catch (error) {
    console.error(`[FILE] Failed to rename file ${oldPath} → ${newPath}:`, error);
    throw error;
  }
}

export async function removeFile(sandboxId: string, filePath: string): Promise<void> {
  console.log(`[FILE] Removing file: ${filePath} from sandbox: ${sandboxId}`);
  
  const fs = require('fs').promises;
  const path = require('path');
  
  try {
    const projectDir = path.join(process.cwd(), 'sandboxes', sandboxId);
    const fullPath = path.join(projectDir, filePath);
    
    const stats = await fs.stat(fullPath);
    
    if (stats.isDirectory()) {
      await fs.rmdir(fullPath, { recursive: true });
    } else {
      await fs.unlink(fullPath);
    }
    
    console.log(`[FILE] File removed successfully: ${filePath}`);
  } catch (error) {
    console.error(`[FILE] Failed to remove file ${filePath}:`, error);
    throw error;
  }
}

export async function listFiles(sandboxId: string, containerPath: string = "/"): Promise<any[]> {
  console.log(`[FILE] Listing files in path: ${containerPath} for sandbox: ${sandboxId}`);
  
  const fs = require('fs').promises;
  const path = require('path');
  
  try {
    const projectDir = path.join(process.cwd(), 'sandboxes', sandboxId);
    const targetDir = containerPath === "/" ? projectDir : path.join(projectDir, containerPath);
    
    const entries = await fs.readdir(targetDir, { withFileTypes: true });
    
    const files = await Promise.all(
      entries
        .filter(entry => !['node_modules', '.next', '.git', 'dist', 'build'].includes(entry.name))
        .map(async (entry) => {
          const fullPath = path.join(targetDir, entry.name);
          const stats = await fs.stat(fullPath);
          
          return {
            name: entry.name,
            type: entry.isDirectory() ? 'directory' : 'file',
            permissions: entry.isDirectory() ? 'drwxr-xr-x' : '-rw-r--r--',
            size: stats.size,
            modified: stats.mtime.toISOString().slice(0, 10)
          };
        })
    );

    console.log(`[FILE] Listed ${files.length} files in ${containerPath}`);
    return files;
  } catch (error) {
    console.error(`[FILE] Failed to list files in ${containerPath}:`, error);
    throw error;
  }
}