# Krok po kroku

## Konfiguracja sceny z obrazem

1. Najpierw umieść obraz w bibliotece multimediów Staffbase. Obraz powinien być w formacie poziomym, o szerokości co najmniej
   1920 px; w zależności od szerokości okna scena przycina go do proporcji 21:9 lub
   4:3 — dlatego motyw nie powinien sięgać aż do krawędzi.
2. Umieść widżet **Hero-Slider** na górze strony, w wierszu
   bez innych widżetów obok. Jeśli znajduje się on w kolumnie obok innych
   treści, nie będzie mógł wyświetlać się poprawnie na całej szerokości.
3. Otwórz ustawienia widżetu. Edytor slajdów otworzy się
   automatycznie.
4. Kliknij **Dodaj slajd**.
5. W sekcji **Obraz** kliknij na przerywaną powierzchnię **Wybierz obraz** i
   wybierz obraz z biblioteki multimediów. Bez obrazu slajd nie zostanie
   wyświetlony.
6. W sekcji **Opis obrazu** wpisz, co jest na nim widoczne. Pozostaw to
   pole puste tylko wtedy, gdy obraz służy wyłącznie jako element dekoracyjny.
7. Wpisz **nagłówek**. Zostanie on wyświetlony wielkimi literami; do około
   24 znaków pozostaje w jednym wierszu.
8. Opcjonalnie: **podtytuł** i **przycisk**. Przycisk pojawi się
   tylko wtedy, gdy wypełnione są pola **napis** **i** **miejsce docelowe**.
9. Kliknij **Zastosuj**.
10. Ustaw **sekundy na slajd** na `0` — w przypadku pojedynczego slajdu nie ma
    czego zmieniać.
11. Zapisz stronę i sprawdź ją w podglądzie, raz w trybie pełnoekranowym
    i raz w wąskim oknie.

## Tworzenie wielu slajdów

1. Otwórz ustawienia, a tym samym edytor slajdów.
2. Dla każdego kolejnego slajdu kliknij **Dodaj slajd** i wypełnij
   go tak jak powyżej. Nie można utworzyć więcej niż osiem slajdów — nikt
   .
3. Sortuj za pomocą strzałek **↑** i **↓** w prawym górnym rogu. Pierwszy slajd
   to ten, który jest widoczny po załadowaniu strony.
4. Sprawdź, czy **Sekundy na slajd** są ustawione na `5` (ustawienie domyślne).
5. **Zastosuj**, zapisz i sprawdź w podglądzie.

## Dodaj obraz w orientacji pionowej

1. Umieść w bibliotece fragment tego samego motywu przycięty w orientacji pionowej.
  
2. W edytorze slajdów wybierz odpowiedni slajd.
3. W sekcji **Obraz dla formatu pionowego** kliknij **Wybierz obraz**.
4. **Zastosuj**, zapisz i sprawdź w wąskim oknie lub na
   telefonie.

## Późniejsza zmiana

1. Otwórz ustawienia widżetu; otworzy się edytor slajdów z
   istniejącymi slajdami.
2. Po lewej stronie wybierz slajd, który chcesz zmienić.
3. Zmień pola po prawej stronie. Przycisk **Duplikuj** tworzy kopię
   wybranej slajdu bezpośrednio za nią, a przycisk **Usuń** powoduje jej usunięcie.
4. Przycisk **Zastosuj** zapisuje zmiany w widżecie — dopiero wtedy
   następuje zapisanie strony.

## Jeśli coś nie działa

1. **Scena pozostaje pusta.** Brakuje co najmniej jednego obrazu: slajdy bez obrazu
   nie są wyświetlane. Otwórz edytor slajdów i sprawdź, czy każdy
   slajd zawiera obraz.
2. **Obraz nie zajmuje całej szerokości.** Czy widget znajduje się w
   kolumnie obok innych treści? W takim przypadku umieść go w osobnym wierszu.
   W przeciwnym razie sprawdź, czy opcja **Wyświetlaj na całej szerokości** jest włączona
  .
3. **Tekst nie znajduje się na linii wyrównania.** Może to wynikać z
   odmiennej szerokości treści strony. Zgłoś ten przypadek, podając
   adres strony — scena dostosowuje się do szerokości podanej przez samą
   stronę.
4. **Zamiast edytora widzisz pole tekstowe „Slajdy” z kodem JSON.** Edytor
   nie mógł się załadować. Odśwież okno dialogowe. Nie edytuj
   tekstu ręcznie.
