import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ne-NP */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub बन्द छ, प्रसारण गर्न सकिँदैन',
  resync_failed: 'Redis सदस्यता पुनर्स्थापना गर्न सकिएन',
  sync_room_failed: 'कोठाको सदस्यता मिलाउन सकिएन: {{room}}',
  bus_fanout_failed: 'बस फ्यानआउट असफल भयो',
  destroy_ready_failed: 'बन्द गर्दा Hub सुरुवातको प्रतीक्षा असफल भयो',
});
