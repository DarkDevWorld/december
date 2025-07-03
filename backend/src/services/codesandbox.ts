interface CodeSandboxFile {
  code: string;
  isBinary: boolean;
}

interface CodeSandboxSandbox {
  id: string;
  title: string;
  description: string;
  template: string;
  modules: Array<{
    shortid: string;
    title: string;
    code: string;
    directory_shortid: string | null;
  }>;
  directories: Array<{
    shortid: string;
    title: string;
    directory_shortid: string | null;
  }>;
  created_at: string;
  updated_at: string;
  view_count: number;
  fork_count: number;
  privacy: number;
  screenshot_url: string;
  git: any;
  team: any;
  user: {
    id: string;
    username: string;
    name: string;
    avatar_url: string;
  };
}

// Local development environment instead of CodeSandbox API
export async function createSandbox(): Promise<{ sandboxId: string; url: string }> {
  console.log('[LOCAL-DEV] Creating new local development environment...');
  
  try {
    // Generate a unique sandbox ID
    const sandboxId = generateSandboxId();
    
    // Create local development environment
    const devEnv = await createLocalDevEnvironment(sandboxId);
    
    console.log(`[LOCAL-DEV] Environment created: ${sandboxId}`);
    console.log(`[LOCAL-DEV] Local URL: ${devEnv.url}`);
    
    return { 
      sandboxId, 
      url: devEnv.url 
    };
  } catch (error) {
    console.error('[LOCAL-DEV] Failed to create environment:', error);
    throw error;
  }
}

function generateSandboxId(): string {
  // Generate a unique ID
  return `dec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

async function createLocalDevEnvironment(sandboxId: string): Promise<{ url: string; port: number }> {
  const fs = require('fs').promises;
  const path = require('path');
  const { spawn } = require('child_process');
  
  // Create project directory
  const projectDir = path.join(process.cwd(), 'sandboxes', sandboxId);
  
  try {
    await fs.mkdir(projectDir, { recursive: true });
    
    // Create Next.js project structure
    await createNextJSProject(projectDir);
    
    // Find available port
    const port = await findAvailablePort(3001);
    
    // Start development server
    await startDevServer(projectDir, port);
    
    return {
      url: `http://localhost:${port}`,
      port
    };
  } catch (error) {
    console.error('[LOCAL-DEV] Error creating environment:', error);
    throw error;
  }
}

async function createNextJSProject(projectDir: string): Promise<void> {
  const fs = require('fs').promises;
  const path = require('path');
  
  console.log('[LOCAL-DEV] Creating Next.js project structure...');
  
  // Create directory structure
  const dirs = [
    'src/app',
    'src/components',
    'src/lib',
    'public'
  ];
  
  for (const dir of dirs) {
    await fs.mkdir(path.join(projectDir, dir), { recursive: true });
  }
  
  // Create files
  const files = getDefaultNextJSFiles();
  
  for (const [filePath, fileData] of Object.entries(files)) {
    const fullPath = path.join(projectDir, filePath);
    const dir = path.dirname(fullPath);
    
    // Ensure directory exists
    await fs.mkdir(dir, { recursive: true });
    
    // Write file
    await fs.writeFile(fullPath, fileData.code, 'utf8');
  }
  
  console.log('[LOCAL-DEV] Project structure created successfully');
}

async function findAvailablePort(startPort: number): Promise<number> {
  const net = require('net');
  
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    
    server.listen(startPort, () => {
      const port = server.address()?.port;
      server.close(() => {
        resolve(port || startPort);
      });
    });
    
    server.on('error', () => {
      // Port is busy, try next one
      findAvailablePort(startPort + 1).then(resolve).catch(reject);
    });
  });
}

async function startDevServer(projectDir: string, port: number): Promise<void> {
  const { spawn } = require('child_process');
  const path = require('path');
  
  console.log(`[LOCAL-DEV] Starting development server on port ${port}...`);
  
  return new Promise((resolve, reject) => {
    // Install dependencies first
    const installProcess = spawn('npm', ['install'], {
      cwd: projectDir,
      stdio: 'pipe'
    });
    
    installProcess.on('close', (code) => {
      if (code === 0) {
        console.log('[LOCAL-DEV] Dependencies installed successfully');
        
        // Start dev server
        const devProcess = spawn('npm', ['run', 'dev'], {
          cwd: projectDir,
          stdio: 'pipe',
          env: { ...process.env, PORT: port.toString() }
        });
        
        devProcess.stdout.on('data', (data) => {
          const output = data.toString();
          console.log(`[DEV-SERVER] ${output}`);
          
          if (output.includes('Ready') || output.includes('started server')) {
            resolve();
          }
        });
        
        devProcess.stderr.on('data', (data) => {
          console.error(`[DEV-SERVER] ${data}`);
        });
        
        devProcess.on('close', (code) => {
          console.log(`[DEV-SERVER] Process exited with code ${code}`);
        });
        
        // Resolve after a short delay to ensure server is starting
        setTimeout(resolve, 3000);
      } else {
        reject(new Error(`Failed to install dependencies: ${code}`));
      }
    });
    
    installProcess.stderr.on('data', (data) => {
      console.error(`[INSTALL] ${data}`);
    });
  });
}

// Default Next.js template files
const getDefaultNextJSFiles = (): Record<string, CodeSandboxFile> => {
  return {
    'package.json': {
      code: JSON.stringify({
        name: 'december-nextjs-app',
        version: '0.1.0',
        private: true,
        scripts: {
          dev: 'next dev',
          build: 'next build',
          start: 'next start',
          lint: 'next lint'
        },
        dependencies: {
          'next': '15.3.3',
          'react': '^19.0.0',
          'react-dom': '^19.0.0',
          'lucide-react': '^0.513.0'
        },
        devDependencies: {
          '@tailwindcss/postcss': '^4',
          '@types/node': '^20',
          '@types/react': '^19',
          '@types/react-dom': '^19',
          'tailwindcss': '^4',
          'typescript': '^5'
        }
      }, null, 2),
      isBinary: false
    },
    'next.config.ts': {
      code: `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;`,
      isBinary: false
    },
    'tsconfig.json': {
      code: JSON.stringify({
        compilerOptions: {
          target: 'ES2017',
          lib: ['dom', 'dom.iterable', 'esnext'],
          allowJs: true,
          skipLibCheck: true,
          strict: true,
          noEmit: true,
          esModuleInterop: true,
          module: 'esnext',
          moduleResolution: 'bundler',
          resolveJsonModule: true,
          isolatedModules: true,
          jsx: 'preserve',
          incremental: true,
          plugins: [
            {
              name: 'next'
            }
          ],
          paths: {
            '@/*': ['./src/*']
          }
        },
        include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
        exclude: ['node_modules']
      }, null, 2),
      isBinary: false
    },
    'tailwind.config.ts': {
      code: `import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
export default config;`,
      isBinary: false
    },
    'postcss.config.mjs': {
      code: `const config = {
  plugins: ["@tailwindcss/postcss"],
};

export default config;`,
      isBinary: false
    },
    'src/app/layout.tsx': {
      code: `import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "December Next.js App",
  description: "Created with December AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={\`\${geistSans.variable} \${geistMono.variable} antialiased\`}
      >
        {children}
      </body>
    </html>
  );
}`,
      isBinary: false
    },
    'src/app/page.tsx': {
      code: `import { Terminal, Code, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-2xl">
              <span className="text-white font-bold text-2xl">D</span>
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              December
            </h1>
          </div>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Your AI-powered development environment is ready! Start building amazing applications with real-time assistance.
          </p>
          
          <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Live Development Server</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span>AI Assistant Active</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <Code className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-time Editing</h3>
            <p className="text-gray-400">
              Edit your code with our Monaco editor and see changes instantly in the preview.
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
              <Terminal className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Integrated Terminal</h3>
            <p className="text-gray-400">
              Run commands, install packages, and manage your project with the built-in terminal.
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI-Powered</h3>
            <p className="text-gray-400">
              Get intelligent code suggestions and assistance from our AI chat interface.
            </p>
          </div>
        </div>

        <div className="text-center">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-700/30">
            <h2 className="text-2xl font-bold mb-4">Ready to Build?</h2>
            <p className="text-gray-300 mb-6">
              Start by asking the AI assistant what you'd like to build, or begin editing the code directly.
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer">
                Open Chat Assistant
              </div>
              <div className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors cursor-pointer">
                View Code Editor
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`,
      isBinary: false
    },
    'src/app/globals.css': {
      code: `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #0a0a0a;
  --foreground: #ededed;
}

body {
  color: var(--foreground);
  background: var(--background);
  font-family: Arial, Helvetica, sans-serif;
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}`,
      isBinary: false
    },
    'README.md': {
      code: `# December Next.js Project

This is a [Next.js](https://nextjs.org) project created with December AI.

## Getting Started

The development server is already running! You can:

1. **Edit the code** - Use the Monaco editor to modify files
2. **Chat with AI** - Ask the assistant to help build features
3. **See live changes** - Your changes appear instantly in the preview

## Features

- ⚡ Real-time development server
- 🤖 AI-powered code assistance
- 📝 Monaco code editor
- 🖥️ Live preview
- 📱 Mobile and desktop views

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy

When you're ready to deploy, you can export your project and deploy it to Vercel, Netlify, or any other hosting platform.`,
      isBinary: false
    }
  };
};

export async function getSandbox(sandboxId: string): Promise<CodeSandboxSandbox> {
  console.log(`[LOCAL-DEV] Fetching sandbox: ${sandboxId}`);
  
  const fs = require('fs').promises;
  const path = require('path');
  
  try {
    const projectDir = path.join(process.cwd(), 'sandboxes', sandboxId);
    
    // Check if project exists
    await fs.access(projectDir);
    
    // Read project structure
    const modules = [];
    const directories = [];
    
    // Add basic structure for now
    const mockSandbox: CodeSandboxSandbox = {
      id: sandboxId,
      title: 'December Next.js App',
      description: 'A Next.js application created with December',
      template: 'next',
      modules: [
        {
          shortid: 'app-page',
          title: 'page.tsx',
          code: getDefaultNextJSFiles()['src/app/page.tsx'].code,
          directory_shortid: 'src-app'
        },
        {
          shortid: 'app-layout',
          title: 'layout.tsx',
          code: getDefaultNextJSFiles()['src/app/layout.tsx'].code,
          directory_shortid: 'src-app'
        },
        {
          shortid: 'package-json',
          title: 'package.json',
          code: getDefaultNextJSFiles()['package.json'].code,
          directory_shortid: null
        }
      ],
      directories: [
        {
          shortid: 'src',
          title: 'src',
          directory_shortid: null
        },
        {
          shortid: 'src-app',
          title: 'app',
          directory_shortid: 'src'
        }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      view_count: 0,
      fork_count: 0,
      privacy: 0,
      screenshot_url: '',
      git: null,
      team: null,
      user: {
        id: 'december',
        username: 'december',
        name: 'December AI',
        avatar_url: ''
      }
    };
    
    return mockSandbox;
  } catch (error) {
    console.error(`[LOCAL-DEV] Error fetching sandbox ${sandboxId}:`, error);
    throw error;
  }
}

export async function updateSandboxFile(
  sandboxId: string, 
  filePath: string, 
  content: string
): Promise<void> {
  console.log(`[LOCAL-DEV] Updating file ${filePath} in sandbox ${sandboxId}`);
  
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
    
    console.log(`[LOCAL-DEV] File updated successfully: ${filePath}`);
  } catch (error) {
    console.error(`[LOCAL-DEV] Error updating file ${filePath}:`, error);
    throw error;
  }
}

export async function deleteSandbox(sandboxId: string): Promise<void> {
  console.log(`[LOCAL-DEV] Deleting sandbox: ${sandboxId}`);
  
  const fs = require('fs').promises;
  const path = require('path');
  
  try {
    const projectDir = path.join(process.cwd(), 'sandboxes', sandboxId);
    await fs.rmdir(projectDir, { recursive: true });
    
    console.log(`[LOCAL-DEV] Sandbox deleted successfully: ${sandboxId}`);
  } catch (error) {
    console.error(`[LOCAL-DEV] Error deleting sandbox ${sandboxId}:`, error);
    throw error;
  }
}

export async function listUserSandboxes(): Promise<CodeSandboxSandbox[]> {
  console.log('[LOCAL-DEV] Fetching user sandboxes...');
  
  const fs = require('fs').promises;
  const path = require('path');
  
  try {
    const sandboxesDir = path.join(process.cwd(), 'sandboxes');
    
    // Create sandboxes directory if it doesn't exist
    try {
      await fs.mkdir(sandboxesDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }
    
    const entries = await fs.readdir(sandboxesDir);
    const sandboxes = [];
    
    for (const entry of entries) {
      try {
        const sandbox = await getSandbox(entry);
        sandboxes.push(sandbox);
      } catch (error) {
        console.warn(`[LOCAL-DEV] Could not load sandbox ${entry}:`, error);
      }
    }
    
    return sandboxes;
  } catch (error) {
    console.error('[LOCAL-DEV] Error listing sandboxes:', error);
    return [];
  }
}

export function getSandboxUrl(sandboxId: string): string {
  // Return local development URL
  return `http://localhost:3001`; // This will be dynamic based on the actual port
}

export function getEmbedUrl(sandboxId: string): string {
  return getSandboxUrl(sandboxId);
}

// Terminal functionality
export async function executeCommand(sandboxId: string, command: string): Promise<{ output: string; error?: string }> {
  console.log(`[TERMINAL] Executing command in ${sandboxId}: ${command}`);
  
  const { spawn } = require('child_process');
  const path = require('path');
  
  return new Promise((resolve) => {
    const projectDir = path.join(process.cwd(), 'sandboxes', sandboxId);
    
    const process = spawn('sh', ['-c', command], {
      cwd: projectDir,
      stdio: 'pipe'
    });
    
    let output = '';
    let error = '';
    
    process.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    process.stderr.on('data', (data) => {
      error += data.toString();
    });
    
    process.on('close', (code) => {
      resolve({
        output: output || `Command executed with exit code: ${code}`,
        error: error || undefined
      });
    });
    
    // Timeout after 30 seconds
    setTimeout(() => {
      process.kill();
      resolve({
        output: 'Command timed out after 30 seconds',
        error: 'Timeout'
      });
    }, 30000);
  });
}