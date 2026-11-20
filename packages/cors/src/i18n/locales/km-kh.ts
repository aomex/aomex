import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** km-KH */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'នៅពេល credentials ជា true ត្រូវកំណត់ origin ឱ្យច្បាស់ (origin ជាក់លាក់ បញ្ជីអនុញ្ញាត ឬមុខងារដែលត្រឡប់ origin ជាក់លាក់)។ មិនអនុញ្ញាតឱ្យពឹងផ្អែកលើការឆ្លុះបញ្ចាំងតាមលំនាំដើមទេ',
  credentials_with_wildcard_origin:
    'នៅពេល credentials ជា true មិនអាចកំណត់ origin ជា "*" បានទេ៖ កម្មវិធីរុករកមិនទទួលយកការរួមបញ្ចូលនេះទេ។ សូមប្តូរទៅ origin ជាក់លាក់ បញ្ជីអនុញ្ញាត ឬមុខងារដែលត្រឡប់ origin ជាក់លាក់',
});
