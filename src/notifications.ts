import {toast} from 'bulma-toast';

export type toastNotificationType = 'is-primary' |
  'is-link' | 'is-info' | 'is-success' | 'is-warning' | 'is-danger' | 'is-white' |
  'is-black' | 'is-light' | 'is-dark' | undefined;

export const toastMessage: (notificationText: string, notificationType: toastNotificationType) =>
  void = (notificationText: string, notificationType: toastNotificationType): void => {
  toast({
    message: notificationText,
    type: notificationType,
    dismissible: true,
    pauseOnHover: true,
    position: 'bottom-center',
    duration: 5000,
  });
};

export const toastSuccess: (notificationText: string) =>
  void = (notificationText: string): void => {
  toastMessage(notificationText, 'is-success');
};

export const toastError: (notificationText: string) =>
  void = (notificationText: string): void => {
  toastMessage(notificationText, 'is-danger');
};
