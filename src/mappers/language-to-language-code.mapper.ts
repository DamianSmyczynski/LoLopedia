import { LanguageSymbol } from 'src/language-symbol.enum';

export class LanguageToLanguageCodeMapper {
  public static map(language: string): string {
    for (const [key, value] of Object.entries(LanguageSymbol)) {
      if (language === key) return value;
    }
    return LanguageSymbol.en;
  }
}
