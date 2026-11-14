import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ne-NP */
export default I18n.satisfies(zh).define({
  initialize: 'प्रारम्भिक कागजात',
  search_routers_files: 'राउटिंग फाइलहरू खोज्नुहोस्',
  parse_routers: 'पार्स मार्ग',
  add_tag: 'ट्याग थप्नुहोस्',
  hand_fix_documentation: 'कागजातहरू म्यानुअल रूपमा मर्मत गर्नुहोस्',
  optimize_parameter: 'अनुकूलन प्यारामिटरहरू',
  save_to_file: 'फाइलमा बचत गर्नुहोस्',
  validate: 'कागजात प्रमाणित गर्नुहोस्',
  help_summary: 'OpenAPI v3 कागजात जनरेटर',
  has_error: '{{error_count}} त्रुटिहरू, {{warning_count}} चेतावनीहरू',
  no_error: 'कुनै त्रुटिहरू छैनन्',
});
