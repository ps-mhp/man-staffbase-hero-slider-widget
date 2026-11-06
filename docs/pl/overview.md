# Hero-Slider

Hero-Slider to **scena** u góry strony: duże zdjęcie zajmujące
całą szerokość okna, nad nim nagłówek, opcjonalnie podtytuł oraz
przycisk. Wzorem jest scena na stronie man.eu.

Jeśli utworzy się kilka slajdów, pojawi się przełącznik: slajdy
przechodzą płynnie jeden w drugi, a przewijanie odbywa się za pomocą strzałek i kresek w lewym dolnym rogu.

Slajd nie musi być edytowany ręcznie. Oprócz własnych slajdów
strona główna może również wyświetlać **wpisy z aktualności**:

- **Wpis z aktualności** — konkretny wpis jako slajd. Zdjęcie, nagłówek
  i zapowiedź pochodzą z wpisu, a przycisk prowadzi do niego.
- **Kanał wiadomości** — cały kanał, jeden slajd na każdy wpis. Liczbę slajdów,
  kolejność oraz filtry można dostosować. Gdy w
  kanale pojawi się nowy wpis, automatycznie trafia on na scenę.

Te trzy rodzaje znajdują się na tej samej liście i można je dowolnie łączyć oraz
sortować — na przykład osobny slajd jako lead, a za nim trzy najnowsze
artykuły z kanału.

## Co widzą czytelnicy

- Obraz zajmuje całą szerokość okna — nawet jeśli strona
  sama ma węższą kolumnę treści.
- Scena znajduje się **równo u góry**: jeśli strona posiada pasek nawigacyjny,
  scena znajduje się bezpośrednio pod nim; jeśli go nie ma, przylega bezpośrednio do
  menu. Pusty biały pasek, który strona zazwyczaj pozostawia nad pierwszą
  treścią, zostaje pominięty.
- **Tekst pozostaje na linii bazowej strony**: zaczyna się na tej samej
  pionowej linii co nagłówek, menu i tekst poniżej obszaru obrazu. Nie
  przylega on w żadnym wypadku do krawędzi obrazu.
- Tekst znajduje się w lewym dolnym rogu, na ciemnym gradientem, który rozciąga się od dołu do
  góry. Na szerokich ekranach dodawany jest drugi gradient z lewej strony,
  aby jasny tekst pozostawał czytelny na jasnym tle.
- W przypadku wielu slajdów: strzałki po lewej i prawej stronie, a pomiędzy nimi kreska dla każdego slajdu.
  Kreska bieżącego slajdu jest czerwona.
- Przełączanie trwa tak długo, jak długo mysz znajduje się nad sceną lub fokus jest na
  niej. Na telefonie przesuwa się palcem; strzałki są tam ukryte.
- **Na telefonie** (przy szerokości poniżej 768 pikseli) na
  obrazku widoczny jest tylko nagłówek o długości maksymalnie czterech wierszy; wszystko, co wykracza poza ten limit, kończy się znakiem „…”.
  Podtytuł i przycisk są tam ukryte — zamiast tego dotknięcie
  w dowolnym miejscu slajdu prowadzi do celu przycisku. Dla czytników ekranu
  ich etykietą pozostaje nazwa tego linku. Jeśli slajd nie ma celu, nie można
  go dotknąć.
- Użytkownicy, którzy w systemie operacyjnym włączyli opcję „Ogranicz ruchy”, nie widzą
  samoczynnej zmiany slajdów ani przejścia — widzą jedynie elementy sterujące.
- Slajdy z sekcji aktualności wyglądają jak każdy inny slajd. Z zewnątrz nie da się rozpoznać, że treść pochodzi
  z artykułu.

## Co widać w edytorze CMS

Edytor wyświetla obszar roboczy w obrębie kolumny treści, a więc **węższy niż na
opublikowanej stronie**. Jak daleko faktycznie sięga obraz i gdzie znajduje się tekst,
można ocenić jedynie w podglądzie lub na opublikowanej stronie.
Zawsze należy tam sprawdzić przynajmniej raz przy wąskiej Zawsze sprawdź to tam przynajmniej raz przy wąskiej
szerokości okna — tam ma zastosowanie kadrowanie w orientacji pionowej.
