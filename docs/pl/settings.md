# Ustawienia

Wszystko konfiguruje się w edytorze, który wyświetla się automatycznie po otwarciu ustawień:
pozycje po lewej i pośrodku, a ustawienia sceny
po prawej stronie w panelu **Widget**. W oknie dialogowym Staffbase pozostaje jedynie pole tekstowe
„Wpisy” za edytorem; jest to wersja robocza i nie należy jej
modyfikować.

| Ustawienie | Opis |
| --- | --- |
| Wpisy | Zawartość sceny: własne slajdy, pojedyncze wpisy z aktualności oraz całe kanały aktualności. |

### Panel „Widget”, zakładka „Układ”

| Ustawienie | Opis |
| --- | --- |
| Wysokość | Domyślnie ustawiona jest `wysokość sekcji`. Obok znajdują się opcje `Mała (320–420 px)`, `Średnia (420–560 px)`, `Duża (560–720 px)` oraz `Wysokość ekranu`. |
| Pełna szerokość | Gdy opcja jest włączona (ustawienie domyślne), obraz zajmuje całą szerokość okna, a tekst pozostaje w linii wyboru strony. Gdy opcja jest wyłączona, obszar roboczy pozostaje w kolumnie treści. |
| Położenie | Domyślnym ustawieniem jest `Za ścieżką nawigacyjną`: scena zaczyna się poniżej linii ścieżki nawigacyjnej. Opcja `Przed ścieżką nawigacyjną` umieszcza ją równo pod menu, a ścieżkę nawigacyjną przesuwa poniżej. Działa tylko wtedy, gdy panel znajduje się u góry strony i strona w ogóle zawiera ścieżkę nawigacyjną. |
| Odstęp od dołu | Domyślnym ustawieniem jest `Standard`: pod panelem zachowany jest odstęp, jaki strona stosuje między blokami. `Brak` powoduje, że następujący blok przylega bezpośrednio — w przypadku opcji „Przed ścieżką nawigacyjną” bezpośrednio pod ścieżką nawigacyjną. |

### Panel „Widget”, zakładka „Zachowanie”

| Ustawienie | Opis |
| --- | --- |
| Sekundy na slajd | Domyślnie ustawione jest `5`, dopuszczalne wartości to od `0` do `30`; dopuszczalne są również liczby z przecinkami. `0` zatrzymuje scenę; wtedy przewijanie odbywa się wyłącznie za pomocą strzałek i kresek — a jeśli elementy sterujące są wyłączone, tylko za pomocą gestów przesuwania i klawiszy strzałek. Puste pole oznacza: tak jak dotychczas. |
| Pokaż elementy sterujące | Włączone (ustawienie domyślne) — pojawiają się strzałki i kreski. Po wyłączeniu oba elementy znikają; przewijanie odbywa się nadal za pomocą gestów przesuwania i klawiszy strzałek, a ustawiony czas dla każdego slajdu pozostaje niezmieniony. |

### Istniejące sceny

Do wersji 0.4 ustawienia te były dostępne jako pojedyncze pola w oknie dialogowym programu
Staffbase. Istniejące sceny zachowują je: dopóki ustawienie w panelu
nie zostało zmienione, nadal obowiązuje wartość starego pola. Panel wyświetla
ją tam, gdzie można ją odczytać; w przeciwnym razie przy polach wyboru widnieje napis **Tak jak dotychczas**,
a przy przełącznikach – informacja „Jeszcze nie ustawiono tutaj”. Dopiero po
ustawienie i wybierze **Zastosuj**, ustala je w edytorze — i
tylko to jedno. Kto otworzy edytor i zatwierdzi bez zmian, nie zmienia
nic. Stare pola są ukryte w oknie dialogowym.

## Rodzaje wpisów

| Rodzaj | Opis |
| --- | --- |
| Slajd | Ręcznie edytowany slajd: obraz lub wideo, nagłówek, podtytuł, przyciski. |
| Wpis z aktualności | Konkretny wpis jako slajd. Treść i link docelowy pochodzą z wpisu. |
| Kanał wiadomości | Cały kanał, jedna slajda na każdy wpis. Nowe wpisy pojawiają się bez dodatkowych czynności. |

Wszystkie trzy znajdują się na tej samej liście, można je mieszać i sortować poprzez przeciągnięcie za
uchwyt lub za pomocą przycisków **w górę** i **w dół**. Łącznie
scena wyświetla maksymalnie osiem slajdów — przy czym jeden wpis kanału liczy się wraz ze wszystkimi
slajdami, które wnosi.

## Pola slajdu

| Pole | Opis |
| --- | --- |
| Obraz lub wideo | Obowiązkowe. Z biblioteki multimediów lub poprzez adres (`https://…`). Poziomy, szerokość co najmniej 1920 px. Bez obrazu lub wideo slajd nie zostanie wyświetlony. |
| Adres | Za opcją **Wstaw adres**, zamiast biblioteki multimediów: adres `https` obrazu lub wideo. Inne adresy nie są akceptowane. |
| Typ | Obraz lub wideo. Ustalany automatycznie na podstawie rozszerzenia adresu (`.mp4`, `.webm`, `.mov` to pliki wideo); ręcznie wybieraj tylko w przypadku adresów bez rozszerzenia. |
| Opis zdjęcia lub filmu | Co jest widoczne. Pozostawić puste tylko w przypadku zdjęć i filmów pełniących wyłącznie funkcję dekoracyjną — czytniki ekranu odczytują to pole. |
| Orientacja pionowa | Opcjonalnie. Wyświetlane na wąskich ekranach pionowych. Jeśli brakuje tej opcji, wszędzie stosowany jest kadr poziomy. |
| Nagłówek | Należy zachować zwięzłość: do około 24 znaków pozostaje w jednym wierszu. |
| Podtytuł | Opcjonalne, od jednego do dwóch wierszy. |
| Przyciski | Opcjonalne, maksymalnie trzy na slajd. Wyświetlane są jako lista ze stylem i adresem docelowym; kliknięcie powoduje rozwinięcie pól przycisku. Przesuwanie w górę/w dół, powielanie i usuwanie za pomocą ikon nad polami. Przycisk pojawia się tylko wtedy, gdy wypełniono etykietę i adres docelowy. Dotyczy to wyłącznie slajdów edytowanych ręcznie; slajdy z aktualnościami pobierają przycisk z danego wpisu. |
| Miejsce docelowe | **Adres** (`https://…`, `mailto:…`, `tel:…` lub ścieżka typu `/content/…`), **strona** z Staffbase lub **artykuł z sekcji Aktualności** z Staffbase (najpierw kanał, potem artykuł). Inne adresy, np. `javascript:`, nie są uwzględniane. |
| Styl | **Wypełnienie czerwone** (główna akcja, domyślnie), **wypełnienie białe**, **biały kontur** lub **odnośnik tekstowy**. Nowe przyciski, począwszy od drugiego, mają postać konturu, aby nie powstały dwa czerwone obszary obok siebie. |
| Ikona | Opcjonalnie: strzałka, kąt, link zewnętrzny, pobieranie, odtwarzanie, dokument, kalendarz, e-mail, telefon lub informacja. W przypadku wyboru ikony pojawia się napis **Ikona**: przed lub po tekście. |
| Otwórz w nowej karcie | Przełącznik. Otwiera miejsce docelowe przycisku w nowej karcie. Typowe dla miejsc docelowych zewnętrznych. |

## Pola wpisu w serwisie informacyjnym

| Pole | Opis |
| --- | --- |
| Kanał | Obowiązkowe. Określa, które wpisy są dostępne do wyboru. |
| Wpis | Obowiązkowe. Pięćdziesiąt najnowszych wpisów z kanału, najnowsze na początku. |
| Nagłówek | Opcjonalne. Pozostaw puste, aby przejąć tytuł wpisu. |
| Pokaż fragment tekstu | Domyślnie włączone. Fragment tekstu (teaser) pojawia się jako podtytuł i jest skracany do 240 znaków. |
| Etykieta przycisku | Domyślnie `Dowiedz się więcej`. Pozostaw puste, aby pominąć przycisk; celem jest zawsze wpis. |
| Scenografia | Opcjonalne. Przydatne, gdy zdjęcie wpisu jest zbyt wąskie dla scenografii. |
| Orientacja pionowa | Opcjonalne. Wyświetlane na wąskich, pionowych ekranach. |

## Pola kanału wiadomości

| Pole | Opis |
| --- | --- |
| Kanał | Obowiązkowe. Wszystkie slajdy tego wpisu pochodzą z tego kanału. |
| Liczba wpisów | Domyślnie `3`, maksymalnie osiem. |
| Kolejność | `Najnowsze najpierw` (ustawienie domyślne) lub `Najstarsze najpierw`. |
| Tylko wyróżnione posty | Domyślnie wyłączone. Ogranicza wyświetlanie do postów przypiętych w aktualnościach. |
| Tylko posty ze zdjęciem | Domyślnie włączone. Bez zdjęcia slajd byłby tylko ciemnym polem z tekstem. |
| Hashtagi | Opcjonalne, wiele, oddzielonych przecinkami. Wystarczy jeden post, jeśli zawiera którykolwiek z nich. |
| Pokaż tekst podglądu | Domyślnie włączone. |
| Napis na przycisku | Dotyczy wszystkich slajdów kanału. Pozostaw puste, aby pominąć przycisk. |

## Uwagi

- **Wysokość** działa jako ograniczenie, a nie jako stała wysokość: scena dostosowuje się do szerokich
  ekranach 21:9 i wąskich 4:3 i jest przycinana tylko do granic
  wybranego poziomu.
- `Wysokość ekranu` wypełnia widoczną stronę pomniejszoną o nagłówek,
  ale co najmniej 420 px.
- **Sekundy na slajd** działają dopiero od drugiego slajdu.
- Użytkownicy, którzy w systemie operacyjnym włączyli opcję „Ogranicz ruchy”, nie zauważą
  zmiany samodzielnie — niezależnie od tego ustawienia.
- U góry scena zawsze przylega równo — do ścieżki nawigacyjnej lub, w przypadku
  opcji „Przed ścieżką nawigacyjną”, do menu. W zamian za to kompensuje wewnętrzny odstęp, jaki sekcja zachowuje
  nad swoim pierwszym blokiem. Dzieje się tak tylko wtedy, gdy
  nad sceną nie ma żadnej innej treści.
- Jeśli scena jest ostatnim blokiem w sekcji, sekcja kończy się
  wraz z nią — niezależnie od wysokości. W przypadku stałego poziomu sekcja dostosowuje się do
  sceny, a w przypadku `wysokości sekcji` scena dostosowuje się do sekcji.
- **Odstęp od dołu** reguluje odstęp od następnego bloku w tej samej
  sekcji. Odstęp wewnętrzny kolejnej sekcji należy do niej i
  pozostaje niezmieniony.
- W przypadku `wysokości sekcji` scena zajmuje wysokość sekcji tylko wtedy, gdy
  znajduje się w niej samodzielnie. W przypadku obecności innych bloków w tej samej sekcji zachowuje
  swoje proporcje, a bloki przylegają do niej bez odstępu.
- Elementy sterujące pojawiają się dopiero od drugiego slajdu. Na wąskich
  ekranach strzałki są ukryte; w tym przypadku należy przesuwać palcem.
- Artykuł, który zostanie usunięty lub nie jest widoczny dla czytelnika,
  zabiera ze sobą tylko swój własny slajd. Pozostałe slajdy pozostają na miejscu.
- Slajdy z wiadomościami dostosowują się do języka czytelnika, o ile artykuł
  został przetłumaczony; w przeciwnym razie stosowana jest pierwsza dostępna wersja.
- **Podgląd** na komputerach stacjonarnych, tabletach i urządzeniach mobilnych stosuje w przypadku wpisów z aktualności
  te same zasady, co opublikowana strona. To, czego tam nie ma,
  nie pojawia się również na ekranie.
