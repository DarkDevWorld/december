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

interface CreateSandboxRequest {
  files: Record<string, CodeSandboxFile>;
  template?: string;
  title?: string;
  description?: string;
}

interface CreateSandboxResponse {
  sandbox_id: string;
}

const CODESANDBOX_API_BASE = 'https://codesandbox.io/api/v1';

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
          '@hookform/resolvers': '^5.0.1',
          '@radix-ui/react-accordion': '^1.2.11',
          '@radix-ui/react-alert-dialog': '^1.1.14',
          '@radix-ui/react-aspect-ratio': '^1.1.7',
          '@radix-ui/react-avatar': '^1.1.10',
          '@radix-ui/react-checkbox': '^1.3.2',
          '@radix-ui/react-collapsible': '^1.1.11',
          '@radix-ui/react-context-menu': '^2.2.15',
          '@radix-ui/react-dialog': '^1.1.14',
          '@radix-ui/react-dropdown-menu': '^2.1.15',
          '@radix-ui/react-hover-card': '^1.1.14',
          '@radix-ui/react-label': '^2.1.7',
          '@radix-ui/react-menubar': '^1.1.15',
          '@radix-ui/react-navigation-menu': '^1.2.13',
          '@radix-ui/react-popover': '^1.1.14',
          '@radix-ui/react-progress': '^1.1.7',
          '@radix-ui/react-radio-group': '^1.3.7',
          '@radix-ui/react-scroll-area': '^1.2.9',
          '@radix-ui/react-select': '^2.2.5',
          '@radix-ui/react-separator': '^1.1.7',
          '@radix-ui/react-slider': '^1.3.5',
          '@radix-ui/react-slot': '^1.2.3',
          '@radix-ui/react-switch': '^1.2.5',
          '@radix-ui/react-tabs': '^1.1.12',
          '@radix-ui/react-toast': '^1.2.14',
          '@radix-ui/react-toggle': '^1.1.9',
          '@radix-ui/react-toggle-group': '^1.1.10',
          '@radix-ui/react-tooltip': '^1.2.7',
          '@tanstack/react-query': '^5.80.6',
          '@tanstack/react-table': '^8.21.3',
          'class-variance-authority': '^0.7.1',
          clsx: '^2.1.1',
          cmdk: '^1.1.1',
          'date-fns': '^4.1.0',
          'embla-carousel-react': '^8.6.0',
          'input-otp': '^1.4.2',
          'lucide-react': '^0.513.0',
          next: '15.3.3',
          'next-themes': '^0.4.6',
          react: '^19.0.0',
          'react-day-picker': '8.10.1',
          'react-dom': '^19.0.0',
          'react-hook-form': '^7.57.0',
          'react-resizable-panels': '^3.0.2',
          recharts: '^2.15.3',
          sonner: '^2.0.5',
          'tailwind-merge': '^3.3.0',
          vaul: '^1.1.2',
          zod: '^3.25.55'
        },
        devDependencies: {
          '@tailwindcss/postcss': '^4',
          '@types/node': '^20',
          '@types/react': '^19',
          '@types/react-dom': '^19',
          tailwindcss: '^4',
          'tw-animate-css': '^1.3.4',
          typescript: '^5'
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
  title: "Create Next App",
  description: "Generated by create next app",
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
      code: `import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="https://nextjs.org/icons/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              src/app/page.tsx
            </code>
            .
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="https://nextjs.org/icons/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
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
  --background: #ffffff;
  --foreground: #171717;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
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

This is a [Next.js](https://nextjs.org) project created with December.

## Getting Started

First, run the development server:

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying \`src/app/page.tsx\`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.`,
      isBinary: false
    }
  };
};

// Create a simple sandbox using the CodeSandbox import API
export async function createSandbox(): Promise<{ sandboxId: string; url: string }> {
  console.log('[CODESANDBOX] Creating new sandbox...');
  
  try {
    // Use the simpler import API instead of the define API
    const files = getDefaultNextJSFiles();
    
    // Convert files to the format expected by CodeSandbox import API
    const fileMap: Record<string, string> = {};
    Object.entries(files).forEach(([path, file]) => {
      fileMap[path] = file.code;
    });

    // Use the import API which is more reliable
    const importData = {
      files: fileMap
    };

    console.log('[CODESANDBOX] Sending request to import API...');
    
    const response = await fetch(`${CODESANDBOX_API_BASE}/sandboxes/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(importData)
    });

    console.log(`[CODESANDBOX] Response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[CODESANDBOX] Error response: ${errorText}`);
      throw new Error(`CodeSandbox API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('[CODESANDBOX] Response received:', result);
    
    // The import API returns the sandbox data directly
    const sandboxId = result.id;
    const url = `https://codesandbox.io/s/${sandboxId}`;
    
    console.log(`[CODESANDBOX] Sandbox created successfully: ${sandboxId}`);
    console.log(`[CODESANDBOX] URL: ${url}`);
    
    return { sandboxId, url };
  } catch (error) {
    console.error('[CODESANDBOX] Failed to create sandbox:', error);
    
    // Fallback: create a simple sandbox with minimal files
    try {
      console.log('[CODESANDBOX] Attempting fallback with minimal template...');
      
      const minimalFiles = {
        'package.json': JSON.stringify({
          name: 'december-nextjs-app',
          version: '0.1.0',
          private: true,
          scripts: {
            dev: 'next dev',
            build: 'next build',
            start: 'next start'
          },
          dependencies: {
            next: '15.3.3',
            react: '^19.0.0',
            'react-dom': '^19.0.0'
          },
          devDependencies: {
            '@types/node': '^20',
            '@types/react': '^19',
            '@types/react-dom': '^19',
            typescript: '^5'
          }
        }, null, 2),
        'src/app/page.tsx': `export default function Home() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Welcome to December!</h1>
      <p>Your Next.js application is ready.</p>
    </div>
  );
}`,
        'src/app/layout.tsx': `export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}`
      };

      const fallbackResponse = await fetch(`${CODESANDBOX_API_BASE}/sandboxes/import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ files: minimalFiles })
      });

      if (fallbackResponse.ok) {
        const fallbackResult = await fallbackResponse.json();
        const sandboxId = fallbackResult.id;
        const url = `https://codesandbox.io/s/${sandboxId}`;
        
        console.log(`[CODESANDBOX] Fallback sandbox created: ${sandboxId}`);
        return { sandboxId, url };
      }
    } catch (fallbackError) {
      console.error('[CODESANDBOX] Fallback also failed:', fallbackError);
    }
    
    throw error;
  }
}

export async function getSandbox(sandboxId: string): Promise<CodeSandboxSandbox> {
  console.log(`[CODESANDBOX] Fetching sandbox: ${sandboxId}`);
  
  try {
    const response = await fetch(`${CODESANDBOX_API_BASE}/sandboxes/${sandboxId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch sandbox: ${response.status}`);
    }

    const result = await response.json();
    console.log(`[CODESANDBOX] Sandbox fetched successfully: ${sandboxId}`);
    
    return result.data;
  } catch (error) {
    console.error(`[CODESANDBOX] Failed to fetch sandbox ${sandboxId}:`, error);
    throw error;
  }
}

export async function updateSandboxFile(
  sandboxId: string, 
  filePath: string, 
  content: string
): Promise<void> {
  console.log(`[CODESANDBOX] Updating file ${filePath} in sandbox ${sandboxId}`);
  
  try {
    // For CodeSandbox, we need to fork the sandbox to make changes
    // This is a limitation of the public API
    const forkResponse = await fetch(`${CODESANDBOX_API_BASE}/sandboxes/${sandboxId}/fork`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!forkResponse.ok) {
      throw new Error(`Failed to fork sandbox: ${forkResponse.status}`);
    }

    const forkResult = await forkResponse.json();
    console.log(`[CODESANDBOX] Sandbox forked: ${forkResult.data.id}`);
    
    // Note: The actual file update would require additional API calls
    // For now, we'll log the operation
    console.log(`[CODESANDBOX] File update simulated for ${filePath}`);
  } catch (error) {
    console.error(`[CODESANDBOX] Failed to update file ${filePath}:`, error);
    throw error;
  }
}

export async function deleteSandbox(sandboxId: string): Promise<void> {
  console.log(`[CODESANDBOX] Deleting sandbox: ${sandboxId}`);
  
  try {
    const response = await fetch(`${CODESANDBOX_API_BASE}/sandboxes/${sandboxId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`Failed to delete sandbox: ${response.status}`);
    }

    console.log(`[CODESANDBOX] Sandbox deleted successfully: ${sandboxId}`);
  } catch (error) {
    console.error(`[CODESANDBOX] Failed to delete sandbox ${sandboxId}:`, error);
    throw error;
  }
}

export async function listUserSandboxes(): Promise<CodeSandboxSandbox[]> {
  console.log('[CODESANDBOX] Fetching user sandboxes...');
  
  try {
    const response = await fetch(`${CODESANDBOX_API_BASE}/sandboxes`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch sandboxes: ${response.status}`);
    }

    const result = await response.json();
    console.log(`[CODESANDBOX] Found ${result.data.length} sandboxes`);
    
    return result.data;
  } catch (error) {
    console.error('[CODESANDBOX] Failed to fetch user sandboxes:', error);
    throw error;
  }
}

export function getSandboxUrl(sandboxId: string): string {
  return `https://codesandbox.io/s/${sandboxId}`;
}

export function getEmbedUrl(sandboxId: string): string {
  return `https://codesandbox.io/embed/${sandboxId}`;
}