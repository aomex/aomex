import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** mr-IN */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub बंद आहे, प्रसारण करता येत नाही',
  resync_failed: 'Redis सदस्यता पुनर्संचयित करता आल्या नाहीत',
  sync_room_failed: 'खोलीची सदस्यता जुळवता आली नाही: {{room}}',
  bus_fanout_failed: 'बस फॅनआउट अयशस्वी',
  destroy_ready_failed: 'बंद करताना Hub सुरू होण्याची वाट पाहणे अयशस्वी',
});
