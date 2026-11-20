import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** pl-PL */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'gdy credentials ma wartość true, origin musi być ustawiony jawnie (konkretny origin, biała lista lub funkcja zwracająca konkretny origin); domyślne odbijanie jest zabronione',
  credentials_with_wildcard_origin:
    'gdy credentials ma wartość true, origin nie może być "*": przeglądarki odrzucają tę kombinację; użyj konkretnego origin, białej listy lub funkcji zwracającej konkretny origin',
});
