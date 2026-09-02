# Ustawienia

| Ustawienie | Opis |
| --- | --- |
| Wpisy | Zawartość sceny: własne slajdy, pojedyncze wpisy z aktualności oraz całe kanały informacyjne. Zarządzane za pomocą edytora, który wyświetla się automatycznie po otwarciu ustawień. Poniższe pole tekstowe zawiera wersję roboczą i nie należy go edytować. |
| Wysokość | Domyślnie ustawiona jest opcja `Standardowa (420–560 px)`. Obok znajdują się opcje `Niska (320–420 px)`, `Wysoka (560–720 px)` oraz `Wysokość ekranu`. |
| Wyświetlaj na całej szerokości | Gdy opcja jest włączona (ustawienie domyślne), obraz zajmuje całą szerokość okna, a tekst pozostaje w obrębie marginesów strony. Gdy opcja jest wyłączona, scena pozostaje w kolumnie treści. |
| Sekundy na slajd | Domyślnie ustawiono `5`. Wartość `0` zatrzymuje scenę; wtedy przewijanie odbywa się wyłącznie za pomocą strzałek i kresek. Maksymalnie 30. |

## Rodzaje wpisów

| Rodzaj | Opis |
| --- | --- |
| Slajd | Ręcznie edytowany slajd: obraz, nagłówek, podtytuł, przycisk. |
| Wpis z aktualności | Konkretny wpis jako slajd. Treść i link pochodzą z wpisu. |
| Kanał aktualności | Cały kanał, jeden slajd na każdy wpis. Nowe wpisy pojawiają się bez dodatkowych czynności. |

Wszystkie trzy rodzaje wpisów znajdują się na tej samej liście, można je mieszać i sortować za pomocą **↑** oraz
**↓**. Łącznie scena wyświetla maksymalnie osiem slajdów — przy czym
wpis kanału liczy się wraz ze wszystkimi slajdami, które wnosi.

## Pola slajdu

| Pole | Opis |
| --- | --- |
| Obraz | Obowiązkowe. Poziomy, szerokość co najmniej 1920 px. Bez obrazu slajd nie zostanie wyświetlony. |
| Opis obrazu | Co widać na obrazku. Pozostawić puste tylko w przypadku obrazów czysto dekoracyjnych — czytniki ekranu odczytują to pole. |
| Obraz w orientacji pionowej | Opcjonalne. Wyświetlane na wąskich ekranach pionowych. Jeśli brakuje, wszędzie stosowany jest kadr w orientacji poziomej. |
| Nagłówek | Wpisywany wielkimi literami. Do około 24 znaków pozostaje w jednym wierszu. |
| Podtytuł | Opcjonalny, jeden lub dwa wiersze. |
| Przycisk | Opcjonalny. Pojawia się tylko wtedy, gdy wypełniono tekst przycisku i adres docelowy. Maksymalnie jeden na slajd. |
| Otwórz w nowej karcie | Otwiera miejsce docelowe przycisku w nowej karcie. Stosowane zazwyczaj w przypadku miejsc docelowych zewnętrznych. |

## Pola wpisu w serwisie informacyjnym

| Pole | Opis |
| --- | --- |
| Kanał | Obowiązkowe. Określa, które wpisy są dostępne do wyboru. |
| Wpis | Obowiązkowe. Pięćdziesiąt najnowszych wpisów z kanału, najnowsze na początku. |
| Zastąp nagłówek | Opcjonalne. Pozostaw puste, aby przejąć tytuł wpisu. |
| Pokaż teaser jako podtytuł | Domyślnie włączone. Teaser jest skracany do 240 znaków. |
| Etykieta przycisku | Domyślnie `Dowiedz się więcej`. Pozostaw puste, aby pominąć przycisk; miejscem docelowym jest zawsze artykuł. |
| Zastąp obraz sceny | Opcjonalnie. Przydatne, gdy obraz wpisu jest zbyt wąski dla sceny. |
| Obraz dla orientacji pionowej | Opcjonalnie. Wyświetlany na wąskich, pionowych ekranach. |

## Pola kanału wiadomości

| Pole | Opis |
| --- | --- |
| Kanał | Obowiązkowe. Wszystkie slajdy w tym wpisie pochodzą z tego kanału. |
| Liczba slajdów | Domyślnie `3`, maksymalnie osiem. |
| Kolejność | `Najnowsze najpierw` (ustawienie domyślne) lub `Najstarsze najpierw`. |
| Tylko wyróżnione wpisy | Domyślnie wyłączone. Ogranicza wyświetlanie do wpisów przypiętych w aktualnościach. |
| Tylko wpisy ze zdjęciem | Domyślnie włączone. Bez zdjęcia slajd wyglądałby jak ciemny obszar z tekstem. |
| Słowa kluczowe | Opcjonalne, wiele słów oddzielonych przecinkami. Wystarczy jeden wpis, jeśli zawiera którekolwiek z nich. |
| Pokaż zwiastun jako podtytuł | Domyślnie włączone. |
| Etykieta przycisku | Dotyczy wszystkich slajdów kanału. Pozostaw puste, aby pominąć przycisk. |

## Uwagi

- **Wysokość** działa jako ograniczenie, a nie jako stała wysokość: scena jest dostosowana do szerokich
  ekranach 21:9 i wąskich 4:3 i jest przycinana tylko do granic
  wybranego poziomu.
- `Wysokość ekranu` wypełnia widoczną stronę pomniejszoną o nagłówek,
  ale co najmniej 420 px.
- **Sekundy na slajd** działają dopiero od drugiego slajdu.
- Użytkownicy, którzy w systemie operacyjnym włączyli opcję „Ogranicz ruchy”, nie widzą
  zmian automatycznie — niezależnie od tego ustawienia.
- Elementy sterujące pojawiają się dopiero od drugiego slajdu. Na wąskich
  ekranach strzałki są ukryte; w tym przypadku należy przesuwać palcem.
- Wpis, który zostanie usunięty lub nie jest widoczny dla osoby czytającej,
  zabiera ze sobą tylko swój własny slajd. Pozostałe slajdy pozostają na miejscu.
- Slajdy z wiadomościami dostosowują się do języka osoby czytającej, o ile wpis
  został przetłumaczony; w przeciwnym razie stosowana jest pierwsza dostępna wersja.
- **Podgląd** w edytorze działa na tych samych zasadach, co
  opublikowana strona. To, czego tam nie ma, nie pojawia się również na ekranie
  wyświetlacza.
