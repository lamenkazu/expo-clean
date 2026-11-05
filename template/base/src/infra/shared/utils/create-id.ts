import { randomUUID } from 'expo-crypto';

// UUID v4 gerado no aparelho, para o registro existir antes de qualquer sincronizacao.
export const createId = (): string => randomUUID();
