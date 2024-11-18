import fs from 'fs/promises';
import path from 'path';

type Framework = 'react' | 'vue';

export async function scanFiles(dirPath: string, framework: Framework = 'react'): Promise<string[]> {
  const files: string[] = [];

  const fileExtension = framework === 'react' ? 'tsx|jsx' : 'vue';

  async function scan(currentPath: string) {
    const entries = await fs.readdir(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      
      if (entry.isDirectory()) {
        await scan(fullPath);
      } else if (entry.isFile() && new RegExp(`\\.(${fileExtension})$`).test(entry.name)) {
        files.push(fullPath);
      }
    }
  }

  await scan(dirPath);
  return files;
} 