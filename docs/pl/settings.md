# Ustawienia

Wszystko konfiguruje się w edytorze, który wyświetla się automatycznie po otwarciu
ustawień: po lewej stronie znajdują się pozycje, pośrodku – duży obszar roboczy wybranego
wpisu, a po prawej stronie w panelu **Ustawienia** — zakładki
**Slajd** (lub **Wpis**, **Kanał**) dla pozycji, **Wygląd** i
**Zachowanie** dla całej sceny. W przypadku braku pozycji panel nosi nazwę **Widget**. W oknie dialogowym Staffbase pozostaje tylko pole tekstowe
„Wpisy” za edytorem; jest to wersja robocza i nie należy jej
modyfikować.

| Ustawienie | Opis |
| --- | --- |
| Wpisy | Zawartość sceny: własne slajdy, pojedyncze wpisy z aktualności oraz całe kanały aktualności. |

### Panel „Ustawienia”, zakładka „Układ”

| Ustawienie | Opis |
| --- | --- |
| Wysokość | Domyślnie ustawiona jest `wysokość sekcji`. Obok znajdują się opcje `Mała (320–420 px)`, `Średnia (420–560 px)`, `Duża (560–720 px)` oraz `Wysokość ekranu`. |
| Pełna szerokość | Gdy opcja jest włączona (ustawienie domyślne), obraz zajmuje całą szerokość okna, a tekst pozostaje w linii wyznaczającej stronę. Gdy opcja jest wyłączona, obszar roboczy pozostaje w kolumnie treści. |
| Położenie | Domyślnym ustawieniem jest `Za ścieżką nawigacyjną`: scena zaczyna się poniżej linii ścieżki nawigacyjnej. Opcja `Przed ścieżką nawigacyjną` umieszcza ją równo pod menu, a ścieżkę nawigacyjną przesuwa poniżej. Działa tylko wtedy, gdy panel znajduje się u góry strony i strona w ogóle zawiera ścieżkę nawigacyjną. |
| Odstęp od dołu | Domyślnym ustawieniem jest `Standard`: pod panelem zachowywany jest odstęp, jaki strona stosuje między blokami. Opcja `Brak` powoduje, że następujący blok jest umieszczony bezpośrednio pod sceną — w przypadku opcji „Przed ścieżką nawigacyjną” bezpośrednio pod ścieżką nawigacyjną. |

### Panel „Ustawienia”, zakładka „Zachowanie”

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
ustawienie i wybierze opcję **Zastosuj**, ustala je w edytorze — i
tylko to jedno. Kto otworzy edytor i zatwierdzi bez wprowadzania zmian, ten
nic nie zmienia. Stare pola są ukryte w oknie dialogowym.

## Rodzaje wpisów

| Rodzaj | Opis |
| --- | --- |
| Slajd | Ręcznie edytowany slajd: obraz, wideo lub animacja, nagłówek, podtytuł, przyciski. |
| Wpis z aktualności | Konkretny wpis jako slajd. Treść i link docelowy pochodzą z wpisu. |
| Kanał wiadomości | Cały kanał, jedna slajda na każdy wpis. Nowe wpisy pojawiają się bez dodatkowych czynności. |

Wszystkie trzy znajdują się na tej samej liście, można je mieszać i sortować poprzez przeciągnięcie za
uchwyt lub za pomocą przycisków **w górę** i **w dół**. Łącznie
scena wyświetla maksymalnie osiem slajdów — przy czym jeden wpis kanału liczy się wraz ze wszystkimi
slajdami, które wnosi.

## Pola slajdu

| Pole | Opis |
| --- | --- |
| Układ | **Stały**: nagłówek, podtytuł i przyciski w stałym miejscu w lewym dolnym rogu. **Zdefiniowany przez użytkownika**: elementy w dziewięciu strefach, rozmieszczone na scenie (patrz poniżej). Zmiana zachowuje to, co już tam jest. |
| Tło | **Obraz lub wideo** (jeden plik, patrz poniżej) lub **animacja**: ruchomy wzór złożony z kwadratów w kolorach MAN, rysowany przez sam widget. Animacja dostosowuje się do każdego rozmiaru sceny, nie wymaga orientacji pionowej i nie ładuje żadnych dodatkowych elementów. |
| Wzór | Tylko w przypadku animacji. Kątowy: **Fala** (drobne kwadraty, przez które przechodzi fala i je unosi), **Siatka** (spokojna siatka z przemieszczającym się pasmem światła), **Moduły** (luźno rozmieszczone moduły, które pulsują). Okrągłe: **Kropki** (drobne kropki, które podnoszą falowanie), **Linie** (płynne linie wysokościowe, pojedyncze w kolorze czerwonym), **Pierścienie** (pierścienie z punktów, które spokojnie rozprzestrzeniają się od prawej), **Prąd** (cząsteczki, które krążą i dryfują). Strona tekstowa po lewej — na telefonie na dole — pozostaje zawsze pusta. |
| Tło | Tylko w przypadku animacji. **Nieprzezroczyste**, **75 %**, **50 %**, **25 %** lub **Przezroczyste**: spod niego prześwituje fragment znajdujący się za sceną; wzór i tekst pozostają wyraźne. |
| Kolor tła | Tylko w przypadku animacji. **Ciemny** (antracyt) lub **Jasny** (biały). Tekst samoczynnie zmienia kolor na biały lub antracytowy — w zależności od tego, co jest lepiej czytelne na widocznym tle, nawet w przypadku przezroczystego tła nad kolorowym fragmentem. |
| Tempo | Tylko w przypadku animacji. **Spokojne** (jeden cykl w 20 sekund) lub **Dynamiczne** (12 sekund). Gdy w urządzeniu włączone jest ustawienie „Ogranicz ruch”, animacja zatrzymuje się. |
| Czerwone akcenty | Tylko w przypadku animacji. Przełącznik: czerwone elementy poruszają się wraz z animacją — mniej więcej co setny w polu, w przypadku linii i pierścieni — poszczególne całe linie lub pierścienie. |
| Obraz lub wideo | Obowiązkowe, jeśli tłem jest **obraz lub wideo**. Z biblioteki multimediów lub poprzez adres (`https://…`). Poziomy, szerokość co najmniej 1920 px. Bez obrazu lub wideo slajd nie zostanie wyświetlony. |
| Adres | W polu **Wstaw adres**, zamiast biblioteki multimediów: adres `https` obrazu lub wideo. Inne adresy nie są akceptowane. |
| Typ | Zdjęcie lub wideo. Ustalany automatycznie na podstawie rozszerzenia adresu (`.mp4`, `.webm`, `.mov` to pliki wideo); ręcznie wybieraj tylko w przypadku adresów bez rozszerzenia. |
| Opis zdjęcia lub filmu | Co jest widoczne. Pozostawić puste tylko w przypadku zdjęć i filmów pełniących wyłącznie funkcję dekoracyjną — czytniki ekranu odczytują to pole. |
| Orientacja pionowa | Opcjonalnie. Wyświetlane na wąskich, pionowych ekranach. Jeśli brakuje tej opcji, wszędzie stosowany jest kadr poziomy. |
| Nagłówek | Należy zachować zwięzłość: do około 24 znaków pozostaje w jednym wierszu. |
| Podtytuł | Opcjonalne, od jednego do dwóch wierszy. |
| Przyciski | Opcjonalne, maksymalnie trzy na slajd. Wyświetlane są jako lista ze stylem i adresem docelowym; kliknięcie powoduje rozwinięcie pól przycisku. Przesuwanie w górę/w dół, powielanie i usuwanie za pomocą ikon nad polami. Przycisk pojawia się tylko wtedy, gdy wypełniono etykietę i adres docelowy. Dotyczy to wyłącznie slajdów edytowanych ręcznie; slajdy z aktualnościami pobierają przycisk z danego wpisu. |
| Miejsce docelowe | **Adres** (`https://…`, `mailto:…`, `tel:…` lub ścieżka typu `/content/…`), **strona** z Staffbase lub **artykuł z sekcji Aktualności** z Staffbase (najpierw kanał, potem artykuł). Inne adresy, np. `javascript:`, nie są uwzględniane. |
| Styl | **Wypełniony na czerwono** (główna akcja, domyślnie), **Wypełniony na biało**, **Biały kontur** lub **Odnośnik tekstowy**. Nowe przyciski, począwszy od drugiego, mają formę konturu, aby nie pojawiły się obok siebie dwa czerwone obszary. |
| Ikona | Opcjonalnie: strzałka, kąt, link zewnętrzny, pobieranie, odtwarzanie, dokument, kalendarz, e-mail, telefon lub informacja. W przypadku użycia ikony **ikona pojawia się**: przed lub po tekście. |
| Otwórz w nowej karcie | Przełącznik. Otwiera miejsce docelowe przycisku w nowej karcie. Stosowane zazwyczaj w przypadku miejsc docelowych zewnętrznych. |

## Pola wpisu w serwisie informacyjnym

| Pole | Opis |
| --- | --- |
| Kanał | Obowiązkowe. Określa, które wpisy są dostępne do wyboru. |
| Wpis | Obowiązkowe. Pięćdziesiąt najnowszych wpisów z kanału, najnowsze na początku. |
| Nagłówek | Opcjonalne. Pozostaw puste, aby przejąć tytuł wpisu. |
| Pokaż tekst zapowiedzi | Domyślnie włączone. Tekst zapowiedzi (teaser) pojawia się jako podtytuł i jest skracany do 240 znaków. |
| Etykieta przycisku | Domyślnie `Dowiedz się więcej`. Pozostaw puste, aby pominąć przycisk; miejscem docelowym jest zawsze wpis. |
| Obraz tła | Opcjonalne. Przydatne, gdy zdjęcie towarzyszące wpisowi jest zbyt wąskie dla tła. |
| Orientacja pionowa | Opcjonalne. Wyświetlane na wąskich, pionowych ekranach. |

## Pola kanału wiadomości

| Pole | Opis |
| --- | --- |
| Kanał | Obowiązkowe. Wszystkie slajdy tego wpisu pochodzą z tego kanału. |
| Liczba wpisów | Domyślnie `3`, maksymalnie osiem. |
| Kolejność | `Najnowsze najpierw` (ustawienie domyślne) lub `Najstarsze najpierw`. |
| Tylko wyróżnione posty | Domyślnie wyłączone. Ograniczone do treści przypiętych w aktualnościach. |
| Tylko posty ze zdjęciem | Domyślnie włączone. Bez zdjęcia slajd byłby tylko ciemnym polem z tekstem. |
| Hashtagi | Opcjonalne, wiele hasztagów oddzielonych przecinkami. Wystarczy jeden wpis, jeśli zawiera którykolwiek z nich. |
| Pokaż tekst podglądu | Domyślnie włączone. |
| Etykieta przycisku | Dotyczy wszystkich slajdów kanału. Pozostaw puste, aby pominąć przycisk. |

## Uwagi

- **Wysokość** działa jako ograniczenie, a nie jako stała wysokość: obszar wyświetlania ma proporcje 21:9 na szerokich
  ekranach i 4:3 na wąskich i jest przycinany tylko do krawędzi
  wybranego poziomu.
- `Wysokość ekranu` wypełnia widoczną stronę pomniejszoną o nagłówek,
  ale co najmniej 420 px.
- **Sekundy na slajd** działają dopiero od drugiego slajdu.
- Użytkownicy, którzy w systemie operacyjnym włączyli opcję „Ogranicz ruch”, nie widzą
  zmiany automatycznie — niezależnie od tego ustawienia.
- U góry scena zawsze przylega równo — do ścieżki nawigacyjnej lub, w przypadku
  opcji „Przed ścieżką nawigacyjną”, do menu. W zamian za to sekcja wyrównuje odstęp wewnętrzny, jaki zachowuje
  nad swoim pierwszym blokiem. Dzieje się to tylko wtedy, gdy
  nad sceną nie ma żadnej innej treści.
- Jeśli scena jest ostatnim blokiem w sekcji, sekcja kończy się
  wraz z nią — niezależnie od wysokości. W przypadku stałego poziomu sekcja dostosowuje się do
  sceny, natomiast przy ustawieniu `wysokość sekcji` scena dostosowuje się do sekcji.
- **Odstęp od dołu** reguluje odległość od następnego bloku w tej samej
  sekcji. Odstęp wewnętrzny kolejnej sekcji należy do niej i
  pozostaje niezmieniony.
- W przypadku ustawienia `wysokość sekcji` scena zajmuje wysokość sekcji tylko wtedy, gdy
  znajduje się w niej samodzielnie. Jeśli w tej samej sekcji znajdują się inne bloki, zachowuje
  swoje proporcje, a bloki przylegają do niej bez odstępu.
- Elementy sterujące pojawiają się dopiero od drugiego slajdu. Na wąskich
  ekranach strzałki są ukryte; w tym przypadku używa się gestu przesuwania.
- Artykuł, który zostanie usunięty lub nie jest widoczny dla czytelnika,
  zabiera ze sobą tylko swój własny slajd. Pozostałe slajdy pozostają na miejscu.
- Slajdy z wiadomościami dostosowują się do języka czytelnika, o ile artykuł
  został przetłumaczony; w przeciwnym razie stosowana jest pierwsza dostępna wersja.
- **Podgląd** na komputerze stacjonarnym, tablecie i urządzeniu mobilnym stosuje w przypadku wpisów z aktualności
  te same zasady, co opublikowana strona. To, czego tam nie ma,
  nie pojawia się również na scenie.

## Slajd zdefiniowany przez użytkownika

W przypadku opcji **Układ: Niestandardowy** scena pośrodku stanowi obszar roboczy
z dziewięcioma strefami — u góry, w środku, u dołu, po lewej, pośrodku i po prawej stronie
na linii osiowej. W panelu po prawej stronie znajduje się katalog elementów.

| Element | Ustawienia |
| --- | --- |
| Nagłówek | Tekst, rozmiar (**Display**, **H1**–**H3**), kolor. Pierwszy nagłówek slajdu jest jego nagłówkiem głównym. |
| Tekst | Tekst, rozmiar (**L**, **M**, **S**), kolor. |
| Etykieta | Krótki tekst nad nagłówkiem, kolor. |
| Przyciski | Do trzech przycisków, tak jak w przypadku stałego slajdu. |
| Obraz lub logo | Z biblioteki multimediów lub poprzez adres, opis, rozmiar: **S** – jedna trzecia, **M** – dwie trzecie, **L** – cała szerokość strefy — maksymalnie jedna piąta, dwie piąte lub trzy piąte wysokości sceny (na urządzeniach mobilnych w przypadku **L** nieco mniej niż połowa). Aby umieścić duże zdjęcie, należy poszerzyć strefę (**szerokość**). Obrazy z wycięciem (PNG, SVG) wyglądają dobrze na każdym tle. |
| Ikona | Symbol, rozmiar, kolor. |

Dodatkowo dla każdego elementu: **Strefa** (wybór 3×3, podobnie jak scena),
**Ukryj na urządzeniach mobilnych** oraz u góry **w górę**, **w dół**, **duplikuj**,
**usuń**. **Kolor: Auto** dostosowuje się do slajdu — biały lub antracytowy, w zależności od tego,
co jest lepiej czytelne na tle.

**Wyrównanie w poszczególnych strefach:** Kliknięcie nazwy strefy (lub jej pustego
obszaru) powoduje wyświetlenie po prawej stronie opcji **Poziomo w strefie** (**Lewa**, **Środek**,
**Prawa**) oraz **Pionowo w strefie** (**Góra**, **Środek**, **na dole**). Dotyczą one
wszystkich elementów w strefie; te same pola znajdują się również w
ustawieniach każdego elementu. Domyślnym ustawieniem jest położenie strefy — „na dole po lewej”
znajduje się na dole po lewej stronie.

**Łączenie stref:** W sekcji „Wyrównanie” znajdują się opcje **szerokości** (**1 kolumna**,
**2 kolumny**, **3 kolumny**) oraz **wysokości** (**1 wiersz**, **2 wiersze**,
**3 wiersze**). W ten sposób na przykład górny rząd staje się strefą („u góry, cała
szerokość”) lub lewa kolumna („po lewej, cała wysokość”). Strefa rozszerza się najpierw
w prawo lub w dół, a przy krawędzi – w lewo lub w górę; elementy składowe
nakładających się stref umieszczane są za swoimi własnymi, a wyrównanie pozostaje niezmienione. W przypadku
zmniejszenia strefa pozostaje po tej stronie, po której znajdują się jej elementy składowe. Rozmiar,
który tylko częściowo pokrywałby inną połączoną strefę, nie jest
oferowany.

W trybie **mobilnym** strefy są ułożone jedna pod drugą w kolejności czytania (u góry po lewej, u góry
pośrodku, u góry po prawej, pośrodku po lewej…; połączona strefa znajduje się w miejscu
swojego lewego górnego rogu); elementy wyrównane do prawej przesuwają się w lewo,
elementy wyśrodkowane pozostają wyśrodkowane, a przyciski pozostają przyciskami. To, co na telefonie jest zbędne, ukrywa opcja **Ukryj na urządzeniach mobilnych**
; można to sprawdzić powyżej za pomocą opcji **Urządzenia mobilne**.
