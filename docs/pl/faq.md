# FAQ

**Pytanie:** Utworzyłem slajd, ale scena pozostaje pusta.

Odpowiedź: Na slajdzie brakuje obrazu. Slajdy bez obrazu nie są wyświetlane —
pusta, ciemna powierzchnia nie dałaby się odróżnić od błędu na stronie.
Otwórz edytor i w sekcji **Obraz lub wideo** wybierz obraz
lub wprowadź adres.

**Pytanie:** Wpisałem adres filmu, ale slajd wyświetla tylko
ciemny obszar.

Odpowiedź: Najczęściej film jest niedostępny bez logowania lub **Typ** jest ustawiony
na **Obraz**, ponieważ adres nie zawiera rozszerzenia. Otwórz adres w
prywatnym oknie przeglądarki: jeśli tam się nie uruchamia, to również
czytelnicy go nie zobaczą. Komunikat tuż pod polem oznacza, że adres
nie został zaakceptowany — musi zaczynać się od `https://`.

**Pytanie:** Wpisałem tekst etykiety dla przycisku, ale
nie pojawia się on.

Odpowiedź: Przycisk wymaga **obu** elementów — etykiety i adresu docelowego. Dopóki
jedno z pól jest puste, przycisk nie będzie wyświetlany. W przypadku adresu e-mail
akceptowane są tylko formaty `https://…`, `mailto:…`, `tel:…` oraz ścieżki typu `/content/…`;
formularz wyświetla ostrzeżenie, jeśli adres nie zostanie zaakceptowany.

**Pytanie:** Obraz nie zajmuje całej szerokości okna.

Odpowiedź: Istnieją dwie możliwe przyczyny. Albo opcja **Pełna szerokość** (w edytorze
po prawej stronie w sekcji **Układ**) jest wyłączona, albo widżet znajduje się w kolumnie obok innych treści.
Umieść go w osobnym wierszu u góry strony.

**Pytanie:** Tekst nie znajduje się w miejscu, w którym zaczyna się pozostała treść strony.

Odpowiedź: Obszar roboczy dostosowuje się do szerokości treści zgłaszanej przez stronę.
Jeśli się różni, zgłoś ten przypadek, podając adres strony.

**Pytanie:** Zamiast edytora widzę pole tekstowe „Wpisy” z nawiasami
falkowymi w środku.

Odpowiedź: Edytor nie mógł połączyć się z oknem dialogowym. Zamknij
ustawienia i otwórz je ponownie. Tekst w polu to
surowa wersja wpisów; nie edytuj jej ręcznie — jedna literówka
spowoduje zniknięcie wszystkich slajdów.

**Pytanie:** Scena nie zmienia się automatycznie.

Odpowiedź: Istnieją trzy możliwe przyczyny: jest tylko jeden slajd; **sekundy na slajd**
(w edytorze po prawej stronie w sekcji **Zachowanie**) jest ustawione na `0`; albo w systemie operacyjnym włączona jest opcja „Ogranicz ruch”.
W tym ostatnim przypadku jest to zamierzone — nadal można przewijać za pomocą strzałek
i kresek.

**Pytanie:** Na telefonie nie widzę strzałek.

Odpowiedź: Tak zostało zaprojektowane. Na wąskich ekranach przesuwa się palcem;
kreski pod tekstem nadal wskazują, który slajd jest aktualnie wyświetlany.

**Pytanie:** Mój motyw jest przycięty na krawędzi.

Odpowiedź: Scena przycina obraz do formatu 21:9 lub 4:3 w zależności od szerokości okna. Wybierz
obraz z marginesem wokół motywu lub ustaw w sekcji **Obraz dla
formatu pionowego** własny fragment przycięty w orientacji pionowej.

**Pytanie:** Czy mogę utworzyć więcej niż osiem slajdów?

Odpowiedź: Nie. Przy pięciu sekundach na slajd pełny cykl trwa już przy
ośmiu slajdach czterdzieści sekund — nikt nie pozostaje na scenie tak długo.
Liczba osiem dotyczy wszystkich slajdów łącznie: wpis kanału zawierający pięć wpisów
pozwala na dodanie obok niego tylko trzech kolejnych slajdów.

**Pytanie:** Czy muszę aktualizować scenę, gdy w sekcji wiadomości pojawi się nowy wpis?
Odpowiedź:

Odpowiedź: W przypadku wpisu **kanału wiadomości** — nie — zawsze wyświetla on aktualne
wpisy z kanału zgodnie z ustawionymi filtrami. Natomiast wpis **wpisu z wiadomości**
pozostaje przy wpisie, który wybrałeś.

**Pytanie:** Slajd z aktualności nagle zniknął.

Odpowiedź: Wpis został usunięty, przeniesiony lub jest niewidoczny dla osoby
czytającej. Zniknął tylko ten jeden slajd; pozostałe pozostają na swoim miejscu.

**Pytanie:** Mój wpis na kanale wyświetla mniej slajdów niż zostało ustawione.

Odpowiedź: Najczęściej filtry są zbyt wąskie. **Tylko wpisy ze zdjęciami** jest
ustawieniem domyślnym — kanał bez zdjęć nie wyświetla się w tym przypadku. Sprawdź
podgląd w edytorze (**Desktop**): pokazuje on dokładnie to, co pojawi się na scenie
.

**Pytanie:** W wyborze kanałów nie ma ani jednego kanału, zamiast tego pojawia się
pole tekstowe na identyfikator.

Odpowiedź: Lista kanałów informacyjnych była niedostępna. Proszę ponownie załadować okno dialogowe.
Jeśli to nie pomoże, proszę ręcznie wpisać identyfikator kanału; znajduje się
w adresie kanału w CMS.

**Pytanie:** Dlaczego zdjęcie z artykułu informacyjnego na scenie jest nieostre lub
dziwnie przycięte?

Odpowiedź: Zdjęcia do artykułów są przycinane pod kątem formatu kanału, a nie pod kątem
sceny o wysokości ekranu. W wpisie w sekcji **Zastąp obraz sceny**
przeznacz własny obraz w formacie poziomym o szerokości co najmniej 1920 px.

**Pytanie:** Co dzieje się ze sceną podczas automatycznego tłumaczenia
strony?

Odpowiedź: Tłumaczone są wszystkie teksty napisane samodzielnie: nagłówek,
podtytuł, etykieta przycisku i opis obrazu na slajdzie,
a także nadpisany tytuł i etykieta wpisu z aktualnościami.
Obrazy, linki, kanały, filtry i kolejność pozostają niezmienione.

**Pytanie:** Wpisy w sekcji aktualności na przetłumaczonej stronie zawierają inne teksty niż w
języku źródłowym — czy to błąd?

Odpowiedź: Nie. Tytuł i fragment wpisu w sekcji aktualności pochodzą z samego
wpisu i są wyświetlane w języku, który czytelnik ustawił w aplikacji
. Tłumaczone jest tylko to, co sam napisałeś
w wpisie. Jeśli brakuje wersji językowej wpisu, wyświetla się ta, która jest dostępna, zamiast
pozostawiać puste miejsce.

**Pytanie:** Wybrałem opcję „Przed ścieżką nawigacyjną”, ale nic się nie zmienia.

Odpowiedź: Ta opcja działa tylko wtedy, gdy spełnione są trzy warunki: strona posiada
w ogóle pasek nawigacyjny, obszar wyświetlania znajduje się na samym górze strony oraz
nad nim nie ma żadnej innej treści. Jeśli któryś z tych warunków nie jest spełniony,
scena poniżej ścieżki nawigacyjnej — umieszczenie ścieżki nawigacyjnej na środku strony byłoby
gorsze niż brak jakiejkolwiek zmiany. W edytorze w takim przypadku pojawia się wskazówka
nad sceną. Na opublikowanej stronie nie jest ona widoczna; tam
nie można zmienić tego ustawienia.

**Pytanie:** Nad sceną był kiedyś biały pasek. Gdzie się podział?

Odpowiedź: Sekcja, w której znajduje się scena, zachowuje nad swoim pierwszym blokiem
odstęp wewnętrzny. W przypadku tekstu jest to właściwe, ale w przypadku sceny powoduje to
powstanie białego paska między menu lub ścieżką nawigacyjną a obrazem. Scena
sama wyrównuje ten odstęp, gdy tylko znajdzie się na samym szczycie. Jeśli nad nią
znajduje się inny blok, odstęp pozostaje taki, jak ustalono na stronie.

**Pytanie:** Wybrałem opcję „Brak” w polu **Odstęp od dołu**, ale pod sceną
nadal jest miejsce.

Odpowiedź: Opcja „Brak” usuwa odstęp od następnego bloku w tej samej
sekcji. Jeśli scena jest ostatnim blokiem swojej sekcji, sekcja ta
i tak kończy się wraz z nią. Pozostała przestrzeń to odstęp wewnętrzny
następnej sekcji — należy on do niej i można go zmienić w jej
ustawieniach sekcji. Jeśli następująca treść znajduje się w tej samej sekcji
co scena, przy „Brak” przylega do niej bezpośrednio.

**Pytanie:** Bez elementów sterujących — jak w takim razie przewijać?

Odpowiedź: Przesuwając palcem, za pomocą klawiszy strzałek lub automatycznie:
ustawiony czas na każdą slajdę przebiega bez zmian. W przypadku klawiatury
sama scena staje się wybieralna, gdy tylko brakuje elementów sterujących.

**Pytanie:** Gdzie podziały się wysokość, pełna szerokość i liczba sekund na slajd? W
oknie dialogowym Staffbase już ich nie widzę.

Odpowiedź: Znajdują się one w edytorze po prawej stronie w panelu **Widget**: wysokość, pełna szerokość,
położenie i odstęp na dole w sekcji **Układ**, sekund na slajd oraz
elementy sterujące w sekcji **Zachowanie**. Przycisk **Anuluj** cofa te
ustawienia. Dotychczasowe ustawienia pozostają ważne, dopóki ich tam
nie zmienisz.

**Pytanie:** W panelu **Widget** widnieje napis „Tak jak dotychczas”. Co to oznacza?

Odpowiedź: Ustawienie, które blok miał już wcześniej. Edytor nie mógł
prawidłowo odczytać danych ze starego pola i dlatego nie wyświetla domyślnej wartości, która
może w ogóle nie mieć zastosowania. Gdy tylko wybierzesz tam coś i zatwierdzisz, obowiązuje
Twój wybór.
