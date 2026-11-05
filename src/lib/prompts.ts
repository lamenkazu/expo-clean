import { stdin, stdout } from 'node:process';
import { createInterface } from 'node:readline/promises';

export const canPrompt = (): boolean => Boolean(stdin.isTTY && stdout.isTTY);

export const ask = async (question: string, defaultValue: string): Promise<string> => {
  const rl = createInterface({ input: stdin, output: stdout });

  try {
    const answer = await rl.question(`${question} (${defaultValue}): `);
    return answer.trim() || defaultValue;
  } finally {
    rl.close();
  }
};
