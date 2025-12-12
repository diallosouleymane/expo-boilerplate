import { PermissionType } from '@/components/ui';
import { useCallback, useState } from 'react';

interface PermissionState {
  visible: boolean;
  type: PermissionType;
  title: string;
  message: string;
}

export function usePermissionPrompt() {
  const [permissionState, setPermissionState] = useState<PermissionState>({
    visible: false,
    type: 'notifications',
    title: '',
    message: '',
  });

  const showPermissionPrompt = useCallback((
    type: PermissionType,
    title: string,
    message: string
  ) => {
    setPermissionState({
      visible: true,
      type,
      title,
      message,
    });
  }, []);

  const hidePermissionPrompt = useCallback(() => {
    setPermissionState((prev) => ({ ...prev, visible: false }));
  }, []);

  return {
    permissionState,
    showPermissionPrompt,
    hidePermissionPrompt,
  };
}
