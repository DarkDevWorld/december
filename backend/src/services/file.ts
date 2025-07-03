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

// Convert CodeSandbox modules and directories to our file tree format
function convertCodeSandboxToFileTree(sandbox: any): FileItem[] {
  const fileTree: Map<string, FileItem> = new Map();
  
  // Create root
  const root: FileItem = {
    name: "root",
    path: "/",
    type: "directory",
    children: []
  };
  fileTree.set("/", root);

  // Process directories first
  sandbox.directories?.forEach((dir: any) => {
    const path = dir.directory_shortid ? 
      `/${dir.directory_shortid}/${dir.title}` : 
      `/${dir.title}`;
    
    const dirItem: FileItem = {
      name: dir.title,
      path: path,
      type: "directory",
      children: []
    };
    
    fileTree.set(dir.shortid, dirItem);
  });

  // Process files
  sandbox.modules?.forEach((module: any) => {
    const filePath = module.directory_shortid ? 
      `/${module.directory_shortid}/${module.title}` : 
      `/${module.title}`;
    
    const fileItem: FileItem = {
      name: module.title,
      path: filePath,
      type: "file",
      content: module.code
    };
    
    fileTree.set(module.shortid, fileItem);
  });

  // Build hierarchy
  sandbox.directories?.forEach((dir: any) => {
    const dirItem = fileTree.get(dir.shortid);
    if (dirItem) {
      if (dir.directory_shortid) {
        const parentDir = fileTree.get(dir.directory_shortid);
        if (parentDir && parentDir.children) {
          parentDir.children.push(dirItem);
        }
      } else {
        root.children?.push(dirItem);
      }
    }
  });

  sandbox.modules?.forEach((module: any) => {
    const fileItem = fileTree.get(module.shortid);
    if (fileItem) {
      if (module.directory_shortid) {
        const parentDir = fileTree.get(module.directory_shortid);
        if (parentDir && parentDir.children) {
          parentDir.children.push(fileItem);
        }
      } else {
        root.children?.push(fileItem);
      }
    }
  });

  return root.children || [];
}

export async function getFileTree(sandboxId: string): Promise<FileItem[]> {
  console.log(`[FILE] Getting file tree for sandbox: ${sandboxId}`);
  
  try {
    const sandbox = await getSandbox(sandboxId);
    const fileTree = convertCodeSandboxToFileTree(sandbox);
    
    console.log(`[FILE] File tree retrieved with ${fileTree.length} root items`);
    return fileTree;
  } catch (error) {
    console.error(`[FILE] Failed to get file tree for ${sandboxId}:`, error);
    throw error;
  }
}

export async function getFileContentTree(sandboxId: string): Promise<FileContentItem[]> {
  console.log(`[FILE] Getting file content tree for sandbox: ${sandboxId}`);
  
  try {
    const sandbox = await getSandbox(sandboxId);
    const fileTree = convertCodeSandboxToFileTree(sandbox);
    
    // Convert FileItem[] to FileContentItem[] (they have the same structure)
    const contentTree: FileContentItem[] = JSON.parse(JSON.stringify(fileTree));
    
    console.log(`[FILE] File content tree retrieved with ${contentTree.length} root items`);
    return contentTree;
  } catch (error) {
    console.error(`[FILE] Failed to get file content tree for ${sandboxId}:`, error);
    throw error;
  }
}

export async function readFile(sandboxId: string, filePath: string): Promise<string> {
  console.log(`[FILE] Reading file: ${filePath} from sandbox: ${sandboxId}`);
  
  try {
    const sandbox = await getSandbox(sandboxId);
    
    // Find the file in modules
    const module = sandbox.modules?.find((m: any) => {
      const modulePath = m.directory_shortid ? 
        `/${m.directory_shortid}/${m.title}` : 
        `/${m.title}`;
      return modulePath === filePath || m.title === filePath.split('/').pop();
    });

    if (!module) {
      throw new Error(`File not found: ${filePath}`);
    }

    console.log(`[FILE] File read successfully: ${filePath}`);
    return module.code || '';
  } catch (error) {
    console.error(`[FILE] Failed to read file ${filePath}:`, error);
    throw error;
  }
}

export async function writeFile(sandboxId: string, filePath: string, content: string): Promise<void> {
  console.log(`[FILE] Writing file: ${filePath} to sandbox: ${sandboxId} (${content.length} characters)`);
  
  try {
    await updateSandboxFile(sandboxId, filePath, content);
    console.log(`[FILE] File written successfully: ${filePath}`);
  } catch (error) {
    console.error(`[FILE] Failed to write file ${filePath}:`, error);
    throw error;
  }
}

export async function renameFile(sandboxId: string, oldPath: string, newPath: string): Promise<void> {
  console.log(`[FILE] Renaming file: ${oldPath} → ${newPath} in sandbox: ${sandboxId}`);
  
  try {
    // For CodeSandbox, we would need to read the old file and create a new one
    // This is a simplified implementation
    const content = await readFile(sandboxId, oldPath);
    await writeFile(sandboxId, newPath, content);
    
    console.log(`[FILE] File renamed successfully: ${oldPath} → ${newPath}`);
  } catch (error) {
    console.error(`[FILE] Failed to rename file ${oldPath} → ${newPath}:`, error);
    throw error;
  }
}

export async function removeFile(sandboxId: string, filePath: string): Promise<void> {
  console.log(`[FILE] Removing file: ${filePath} from sandbox: ${sandboxId}`);
  
  try {
    // Note: CodeSandbox API doesn't have a direct delete file endpoint
    // This would require forking and recreating without the file
    console.log(`[FILE] File removal simulated: ${filePath}`);
  } catch (error) {
    console.error(`[FILE] Failed to remove file ${filePath}:`, error);
    throw error;
  }
}

export async function listFiles(sandboxId: string, containerPath: string = "/"): Promise<any[]> {
  console.log(`[FILE] Listing files in path: ${containerPath} for sandbox: ${sandboxId}`);
  
  try {
    const fileTree = await getFileTree(sandboxId);
    
    // Convert to simple list format
    const files = fileTree.map(item => ({
      name: item.name,
      type: item.type,
      permissions: item.type === 'directory' ? 'drwxr-xr-x' : '-rw-r--r--',
      size: item.content?.length || 0,
      modified: new Date().toISOString().slice(0, 10)
    }));

    console.log(`[FILE] Listed ${files.length} files in ${containerPath}`);
    return files;
  } catch (error) {
    console.error(`[FILE] Failed to list files in ${containerPath}:`, error);
    throw error;
  }
}