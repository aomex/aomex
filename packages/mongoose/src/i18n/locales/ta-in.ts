import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ta-IN */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} தசம128 வகையாக இருக்க வேண்டும்',
    },
    objectId: {
      must_be_objectId: '{{label}} ObjectId வகையாக இருக்க வேண்டும்',
    },
  },
  mongoose: {
    unsupported_validator: 'இன்னும் {{validator}} ஆதரிக்கப்படவில்லை',
  },
  migration: {
    create: 'இடம்பெயர்வு கோப்பை உருவாக்கவும்',
    up: 'இடம்பெயர்வை செயல்படுத்தவும்',
    down: 'திரும்ப திரும்ப இடம்பெயர்வு',
    file_not_found: 'இடம்பெயர்வு கோப்பு "{{file}}" இல்லை',
    input_file_name: 'இடம்பெயர்வு கோப்பின் பெயரை உள்ளிடவும்:',
    file_created: 'இடம்பெயர்வு கோப்பு "{{file}}" வெற்றிகரமாக உருவாக்கப்பட்டது',
  },
});
