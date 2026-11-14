import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ml-IN */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} ഡെസിമൽ128 തരം ആയിരിക്കണം',
    },
    objectId: {
      must_be_objectId: '{{label}} ObjectId തരത്തിലായിരിക്കണം',
    },
  },
  mongoose: {
    unsupported_validator: 'ഇതുവരെ {{validator}} പിന്തുണയ്ക്കുന്നില്ല',
  },
  migration: {
    create: 'മൈഗ്രേഷൻ ഫയൽ സൃഷ്ടിക്കുക',
    up: 'മൈഗ്രേഷൻ നടപ്പിലാക്കുക',
    down: 'റോൾബാക്ക് മൈഗ്രേഷൻ',
    file_not_found: '"{{file}}" എന്ന മൈഗ്രേഷൻ ഫയൽ നിലവിലില്ല',
    input_file_name: 'മൈഗ്രേഷൻ ഫയലിൻ്റെ പേര് നൽകുക:',
    file_created: 'മൈഗ്രേഷൻ ഫയൽ വിജയകരമായി സൃഷ്ടിച്ചു "{{file}}"',
  },
});
