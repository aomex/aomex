import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** kn-IN */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'credentials true ಆಗಿರುವಾಗ origin ಅನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ಹೊಂದಿಸಬೇಕು (ನಿರ್ದಿಷ್ಟ origin, ಅನುಮತಿ ಪಟ್ಟಿ ಅಥವಾ ನಿರ್ದಿಷ್ಟ origin ಹಿಂತಿರುಗಿಸುವ ಫಂಕ್ಷನ್); ಡೀಫಾಲ್ಟ್ ಪ್ರತಿಬಿಂಬ ಅನುಮತಿಸಲಾಗುವುದಿಲ್ಲ',
  credentials_with_wildcard_origin:
    'credentials true ಆಗಿರುವಾಗ origin "*" ಆಗಿರಬಾರದು: ಬ್ರೌಸರ್‌ಗಳು ಈ ಸಂಯೋಜನೆಯನ್ನು ಸ್ವೀಕರಿಸುವುದಿಲ್ಲ; ನಿರ್ದಿಷ್ಟ origin, ಅನುಮತಿ ಪಟ್ಟಿ ಅಥವಾ ನಿರ್ದಿಷ್ಟ origin ಹಿಂತಿರುಗಿಸುವ ಫಂಕ್ಷನ್ ಬಳಸಿ',
});
