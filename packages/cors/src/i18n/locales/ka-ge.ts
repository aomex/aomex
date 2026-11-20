import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ka-GE */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'როცა credentials არის true, origin უნდა დაყენდეს ცხადად (კონკრეტული origin, თეთრი სია ან ფუნქცია, რომელიც აბრუნებს კონკრეტულ origin-ს); ნაგულისხმევი ასახვა აკრძალულია',
  credentials_with_wildcard_origin:
    'როცა credentials არის true, origin არ შეიძლება იყოს "*": ბრაუზერები ამ კომბინაციას არ იღებენ; გამოიყენეთ კონკრეტული origin, თეთრი სია ან ფუნქცია, რომელიც აბრუნებს კონკრეტულ origin-ს',
});
