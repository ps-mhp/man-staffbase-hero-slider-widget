# Krok po kroku

## Konfiguracja sceny z obrazem

1. Najpierw umieść obraz w bibliotece multimediów Staffbase. W formacie poziomym, o szerokości co najmniej
   1920 px; w zależności od szerokości okna scena przycina go do proporcji 21:9 lub
   4:3 — dlatego motyw nie powinien sięgać aż do krawędzi.
2. Umieść widżet **Hero-Slider** na górze strony, w wierszu
   bez innych widżetów obok. Jeśli znajduje się w kolumnie obok innych
   treści, nie będzie można go sensownie wyświetlić na całej szerokości.
3. Otwórz ustawienia widżetu. Edytor otworzy się
   automatycznie.
4. Kliknij nad listą **Nowy +** i wybierz **Slajd**.
5. Pod pozycją **Obraz** kliknij przerywaną powierzchnię **Wybierz obraz** i
   wybierz obraz z biblioteki multimediów. Bez obrazu slajd nie zostanie
   wyświetlony.
6. W polu **Opis obrazu** wpisz, co jest na nim widoczne. Pozostaw to
   pole puste tylko wtedy, gdy obraz ma charakter wyłącznie dekoracyjny.
7. Wpisz **nagłówek**. Zostanie on wyświetlony wielkimi literami; do około
   24 znaków pozostaje w jednym wierszu.
8. Opcjonalnie: **podtytuł** i **przycisk**. Przycisk pojawi się
   tylko wtedy, gdy wypełnione są pola **etykieta** **i** **miejsce docelowe**.
9. Kliknij **Zastosuj**.
10. Ustaw **sekundy na slajd** na `0` — w przypadku pojedynczego slajdu
    nie ma co zmieniać.
11. Zapisz stronę i sprawdź ją w podglądzie, raz w trybie pełnoekranowym
    i raz w wąskim oknie.

## Tworzenie wielu slajdów

1. Otwórz ustawienia, a tym samym edytor.
2. Dla każdego kolejnego slajdu wybierz w menu **Nowy +** opcję **Slajd** i
   wypełnij go tak jak powyżej. Nie można utworzyć więcej niż osiem slajdów — nikt nie przewija
   aż tak daleko.
3. Sortuj za pomocą strzałek **↑** i **↓** w prawym górnym rogu. Pierwszy slajd
   to ten, który jest widoczny po załadowaniu strony.
4. Sprawdź, czy wartość **Sekund na slajd** wynosi `5` (ustawienie domyślne).
5. **Zastosuj**, zapisz i sprawdź w podglądzie.

## Wyświetlenie pojedynczego wpisu z aktualności na scenie

1. Otwórz ustawienia, a tym samym edytor.
2. Kliknij nad listą **Nowy +** i wybierz **Wpis z aktualności**.
   Po lewej stronie pojawi się wpis oznaczony symbolem **Post**.
3. W sekcji **Kanał** wybierz kanał wiadomości. Dopiero wtedy będzie można
   wybrać wpis.
4. W sekcji **Wpis** wybierz żądany wpis. Do wyboru jest
   pięćdziesiąt najnowszych wpisów z kanału, z najnowszym na początku.
5. Sprawdź **podgląd** poniżej: pokazuje on zdjęcie, nagłówek i
   fragment artykułu dokładnie tak, jak będzie wyglądał później.
6. Opcjonalnie: **zmień nagłówek**, **wyświetl fragment jako podtytuł**
   lub zmień **napis na przycisku**. Celem
   przycisku jest zawsze sam wpis.
7. Opcjonalnie: **Zmień zdjęcie w tle**. Zdjęcie wpisu jest przycięte na potrzeby kanału
   i nie zawsze zawiera widoczną górną część.
8. **Zastosuj**, zapisz, sprawdź w podglądzie.

## Wyświetlanie wszystkich wpisów z kanału

1. Otwórz ustawienia, a tym samym edytor.
2. Kliknij **Nowa +** nad listą i wybierz **Kanał wiadomości**.
   Po lewej stronie pojawi się wpis oznaczony etykietą **Kanał**.
3. W sekcji **Kanał** wybierz kanał wiadomości.
4. Ustaw **liczbę slajdów** (domyślnie `3`, maksymalnie osiem).
5. Wybierz **kolejność**: `Najnowsze najpierw` lub `Najstarsze najpierw`.
6. W razie potrzeby ustaw **filtry**:
   - **Tylko wyróżnione wpisy** — ogranicza wyświetlanie do wpisów
     przypiętych w aktualnościach.
   - **Tylko posty ze zdjęciem** — domyślnie włączone. Bez zdjęcia na
     slajdzie pozostałaby tylko ciemna powierzchnia z tekstem.
   - **Słowa kluczowe** — rozdzielaj kilka przecinkami; wystarczy jeden post, jeśli
     zawiera jedno z nich.
7. Sprawdź **podgląd**: pokazuje on dokładnie te wpisy, które pozostały po zastosowaniu filtrów.
   Jeśli podgląd jest pusty, filtry są zbyt wąskie.
8. **Zastosuj**, zapisz, sprawdź w podglądzie.

Wpis ten liczy się na liście jako **jeden**, ale obejmuje kilka slajdów.
W sumie scena nigdy nie wyświetla więcej niż osiem slajdów; wszystko, co wykracza poza ten limit,
zostaje pominięte.

## Dodaj obraz w orientacji pionowej

1. Umieść w bibliotece fragment tego samego motywu przycięty w orientacji pionowej.
  
2. W edytorze wybierz odpowiedni slajd.
3. W sekcji **Obraz w orientacji pionowej** kliknij **Wybierz obraz**.
4. Kliknij **Zastosuj**, zapisz i sprawdź w wąskim oknie lub na
   telefonie.

## Zmiana po utworzeniu

1. Otwórz ustawienia widżetu; edytor otworzy się z
   istniejącymi wpisami.
2. Po lewej stronie wybierz pozycję, którą chcesz zmienić. Symbol nad tytułem wskazuje,
   o jaki rodzaj chodzi: **slajd**, **post** lub **kanał**.
3. Zmień pola po prawej stronie. Przycisk **Duplikuj** tworzy kopię
   wybranego wpisu bezpośrednio za nim, a przycisk **Usuń** powoduje jego usunięcie. Strzałki,
   opcje **Duplikuj** i **Usuń** działają tak samo dla wszystkich trzech rodzajów.
4. Przycisk **Zastosuj** zapisuje zmiany w widżecie — dopiero po tym
   nastąpi zapisanie strony.

## Jeśli coś nie działa

1. **Scena pozostaje pusta.** Brakuje co najmniej jednego obrazu: slajdy bez obrazu
   nie są wyświetlane. Otwórz edytor i sprawdź, czy każdy wpis zawiera
   obraz — w przypadku wpisów z kategorii „Aktualności” sprawdź to w podglądzie.
2. **Obraz nie zajmuje całej szerokości.** Czy widget znajduje się w
   kolumnie obok innych treści? W takim razie umieść go w osobnym wierszu.
   W przeciwnym razie sprawdź, czy opcja **Wyświetlaj na całej szerokości** jest włączona
  .
3. **Tekst nie jest wyrównany do linii bazowej.** Może to wynikać z
   odmiennej szerokości treści strony. Zgłoś ten przypadek, podając
   adres strony — widżet dostosowuje się do szerokości, którą sama strona
   podaje.
4. **Zamiast edytora widzisz pole tekstowe „Wpisy” z kodem JSON.** Edytor
   nie mógł się podłączyć. Odśwież okno dialogowe. Nie edytuj
   tekstu ręcznie.
5. **Lista kanałów pozostaje pusta i pojawia się pole tekstowe na
   identyfikator.** Lista kanałów wiadomości była niedostępna. Odśwież
   okno dialogowe; jeśli to nie pomoże, wprowadź identyfikator kanału. Znajdziesz
   go w adresie kanału w CMS.
6. **Na stronie brakuje slajdu z wiadomością.** Artykuł został usunięty,
  przeniesiony lub jest niewidoczny dla czytelnika. Pozostałe slajdy
  pozostają nienaruszone. Sprawdź wpis w podglądzie edytora.
7. **Wpis w kanale zawiera mniej slajdów niż ustawiono.** Filtry są
   zbyt wąskie — najczęściej **Tylko wpisy ze zdjęciami** w kanale bez zdjęć — lub
   scena jest już zapełniona ośmioma slajdami.
