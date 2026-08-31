import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';

let writeQueue: Promise<void> = Promise.resolve();

function dataDirectory(): string {
  return process.env.UNBOX_DATA_DIR || path.join(process.cwd(), '.data');
}

function filePath(fileName: string): string {
  return path.join(dataDirectory(), fileName);
}

export async function readJsonCollection<T>(fileName: string): Promise<T[]> {
  try {
    const contents = await readFile(filePath(fileName), 'utf8');
    const parsed: unknown = JSON.parse(contents);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === 'ENOENT') return [];
    throw error;
  }
}

export async function updateJsonCollection<T, TResult>(
  fileName: string,
  updater: (items: T[]) => { items: T[]; result: TResult }
): Promise<TResult> {
  let resolveResult: (value: TResult) => void;
  let rejectResult: (reason: unknown) => void;
  const resultPromise = new Promise<TResult>((resolve, reject) => {
    resolveResult = resolve;
    rejectResult = reject;
  });

  writeQueue = writeQueue
    .then(async () => {
      const current = await readJsonCollection<T>(fileName);
      const { items, result } = updater(current);
      const directory = dataDirectory();
      await mkdir(directory, { recursive: true });

      const target = filePath(fileName);
      const temporary = `${target}.${process.pid}.${Date.now()}.tmp`;
      await writeFile(temporary, `${JSON.stringify(items, null, 2)}\n`, 'utf8');
      await rename(temporary, target);
      resolveResult(result);
    })
    .catch((error) => {
      rejectResult(error);
    });

  return resultPromise;
}
