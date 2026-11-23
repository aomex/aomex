import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ne-NP */
export default I18n.satisfies(zh).define({
  initialize: 'प्रारम्भिक कागजात',
  search_channels_files: 'Channel फाइलहरू खोज्नुहोस्',
  parse_channels: 'Channel पार्स गर्नुहोस्',
  hand_fix_documentation: 'कागजातहरू म्यानुअल रूपमा मर्मत गर्नुहोस्',
  save_to_file: 'फाइलमा बचत गर्नुहोस्',
  validate: 'कागजात प्रमाणित गर्नुहोस्',
  help_summary: 'AsyncAPI 3 कागजात जेनेरेटर',
  has_error: '{{error_count}} त्रुटिहरू, {{warning_count}} चेतावनीहरू',
  no_error: 'कुनै त्रुटिहरू छैनन्',
});
