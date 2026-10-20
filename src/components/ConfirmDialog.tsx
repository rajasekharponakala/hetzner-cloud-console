import { Alert } from 'react-native';

export function confirm(
  title: string,
  message: string,
  onConfirm: () => void,
  destructive = false,
) {
  Alert.alert(title, message, [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Confirm', style: destructive ? 'destructive' : 'default', onPress: onConfirm },
  ]);
}
