import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ml-IN */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'credentials true ആയിരിക്കുമ്പോൾ origin വ്യക്തമായി സജ്ജമാക്കണം (നിർദ്ദിഷ്ട origin, അനുമതി പട്ടിക, അല്ലെങ്കിൽ നിർദ്ദിഷ്ട origin തിരികെ നൽകുന്ന ഫംഗ്ഷൻ); സ്ഥിരസ്ഥിതി പ്രതിഫലനം അനുവദനീയമല്ല',
  credentials_with_wildcard_origin:
    'credentials true ആയിരിക്കുമ്പോൾ origin "*" ആകരുത്: ബ്രൗസറുകൾ ഈ കോമ്പിനേഷൻ സ്വീകരിക്കില്ല; നിർദ്ദിഷ്ട origin, അനുമതി പട്ടിക, അല്ലെങ്കിൽ നിർദ്ദിഷ്ട origin തിരികെ നൽകുന്ന ഫംഗ്ഷൻ ഉപയോഗിക്കുക',
});
