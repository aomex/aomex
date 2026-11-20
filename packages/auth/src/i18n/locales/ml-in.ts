import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ml-in */
export default I18n.satisfies(zh).define({
  session_create_failed:
    'സെഷൻ സൃഷ്ടിക്കാനായില്ല: ഒന്നിലധികം എഴുത്ത് ശ്രമങ്ങൾ പരാജയപ്പെട്ടു, സ്റ്റോറേജ് അഡാപ്റ്റർ പരിശോധിക്കുക',
  session_max_age_invalid: 'cookie.maxAge ഒരു ധനസംഖ്യയായിരിക്കണം (സെക്കൻഡിൽ)',
});
