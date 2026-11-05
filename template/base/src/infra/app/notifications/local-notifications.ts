import { DependencyInjectionFactory } from '@infra/app/di/dependency-injection.factory';
import * as Notifications from 'expo-notifications';

const analytics = DependencyInjectionFactory.getInstance().getAnalyticsService();

// O Android nao deixa mudar som e vibracao de um canal que ja existe: uma mudanca exige id novo.
export const DEFAULT_CHANNEL_ID = 'reminders-v1';

export type NotificationPermission = 'granted' | 'denied' | 'undetermined';

// Lembretes aparecem mesmo com o app aberto.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export const ensureDefaultChannel = async (name: string): Promise<void> => {
  await Notifications.setNotificationChannelAsync(DEFAULT_CHANNEL_ID, {
    name,
    importance: Notifications.AndroidImportance.DEFAULT,
  });
};

export const getNotificationPermission = async (): Promise<NotificationPermission> => {
  const { status } = await Notifications.getPermissionsAsync();
  return status as NotificationPermission;
};

// Peca no momento em que a pessoa liga um lembrete, nunca na abertura do app.
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  const current = await getNotificationPermission();

  if (current === 'granted') {
    return current;
  }

  analytics.track({ name: 'permission_requested', permission: 'notifications' });
  const { status } = await Notifications.requestPermissionsAsync();
  analytics.track({
    name: status === 'granted' ? 'permission_granted' : 'permission_denied',
    permission: 'notifications',
  });

  return status as NotificationPermission;
};

export const scheduleReminder = async ({
  title,
  body,
  date,
  data,
}: {
  title: string;
  body: string;
  date: Date;
  data?: Record<string, string>;
}): Promise<string> =>
  Notifications.scheduleNotificationAsync({
    content: { title, body, data },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date,
      channelId: DEFAULT_CHANNEL_ID,
    },
  });

export const cancelReminder = (id: string): Promise<void> =>
  Notifications.cancelScheduledNotificationAsync(id);
