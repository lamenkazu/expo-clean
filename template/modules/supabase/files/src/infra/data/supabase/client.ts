import 'react-native-url-polyfill/auto';

import type { Database } from '@infra/data/supabase/database.types';
import { env } from '@infra/shared/config/env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState } from 'react-native';

export const supabase = createClient<Database>(
  env.EXPO_PUBLIC_SUPABASE_URL,
  env.EXPO_PUBLIC_SUPABASE_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      storage: AsyncStorage,
    },
  }
);

// Com o app em segundo plano, o token nao precisa ser renovado. Ao voltar, a renovacao retoma.
AppState.addEventListener('change', state => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});
