import type { ServiceId, ServicePageCopy } from "@/lib/content";

export const servicePagesPl = {
  ai: {
    metaTitle: "AI dla firm",
    metaDescription:
      "Asystenci, wyszukiwanie wewnętrzne i agenci tam, gdzie zwrot da się zmierzyć. AI wchodzi, gdy daje konkretny wynik.",
    hero: {
      heading: "Inteligencja tam, gdzie zwrot jest mierzalny.",
      body: "Asystenci, dokumenty, wyszukiwanie wewnętrzne i agenci. AI wchodzi, gdy oszczędza czas, ogranicza błędy albo otwiera zdolność, której dziś nie macie — nie jako teatr.",
      primaryCta: "Poznaj widełki budżetu",
    },
    pains: [
      {
        title: "Te same pytania, w kółko",
        body: "Wsparcie, operacje albo zespół techniczny ręcznie odpowiada na powtarzalne sprawy. To, co ważne, miesza się z rutyną.",
      },
      {
        title: "Wiedza odchodzi razem z ludźmi",
        body: "Procedury, wyjątki i osąd żyją w głowach i czatach. Gdy ktoś odchodzi, firma traci kontekst.",
      },
      {
        title: "Szukanie informacji zjada tydzień",
        body: "Umowy, karty, polityki i wątki mailowe są w pięciu miejscach. Nikt za pierwszym razem nie znajduje aktualnej wersji.",
      },
      {
        title: "ChatGPT nie zna waszych procesów",
        body: "Narzędzie ogólne nie zna waszych terminów, ERP ani reguł. Z wprawą zmyśla i nie podaje źródła.",
      },
    ],
    capabilities: [
      {
        title: "Asystenci na waszej wiedzy",
        body: "Pytania językiem naturalnym, odpowiedź z dokumentacji wewnętrznej i źródło widać od razu.",
      },
      {
        title: "Chatboty, które przekazują to, co ważne",
        body: "Powtarzalne sprawy załatwiają się same. Wrażliwe albo niekompletne trafiają do człowieka, z kontekstem.",
      },
      {
        title: "Dokumenty, transkrypcja i raporty",
        body: "Z audio, zgłoszeń albo folderów do użytecznego tekstu. Bez zastępowania osądu osoby, która decyduje.",
      },
      {
        title: "Agenci z jednym konkretnym zadaniem",
        body: "Wąski przepływ: klasyfikacja, ekstrakcja, pierwsza wersja albo alert. Mierzalne od pierwszego dnia.",
      },
    ],
    flow: {
      heading: "Setki zapytań: AI odpowiada na proste i przekazuje ważne.",
      steps: [
        "Ustalamy, które pytania warto zautomatyzować i gdzie dziś jest odpowiedź.",
        "Indeksujemy prawdziwe źródła — dokumenty, ERP, wiki — z uprawnieniami, które już istnieją.",
        "Asystent odpowiada na rutynę i zostawia ślad źródła.",
        "To, co nie pasuje, trafia do człowieka, z gotowym wątkiem.",
        "Patrzymy na wolumen, zaoszczędzony czas i błędy. Potem korygujemy.",
      ],
    },
    faq: [
      {
        q: "Czym to się różni od ChatGPT albo Copilota?",
        a: "Te narzędzia pracują na wiedzy ogólnej. Asystent na miarę odpowiada na podstawie waszej dokumentacji, reguł i źródeł. Jeśli bazy nie ma, mówi o tym; nie wypełnia luki zgadywaniem.",
      },
      {
        q: "Czy dokumenty muszą być najpierw idealnie uporządkowane?",
        a: "Nie. Zaczynamy od tego, co jest: PDF-y, foldery, Drive, SharePoint, ERP. Im jaśniejsze źródło, tym precyzyjniejsza odpowiedź. Porządkowanie może być częścią pracy, nie warunkiem wstępnym.",
      },
      {
        q: "Gdzie są dane?",
        a: "W środowisku, które ustalamy z wami. Nie używamy waszych informacji do trenowania modeli ogólnych. Uprawnienia projektujemy z tą samą starannością co resztę systemu.",
      },
      {
        q: "Jak szybko jest pierwsza użyteczna wersja?",
        a: "Zależy od wolumenu i integracji. Typowo pierwsza użyteczna wersja w kilka tygodni, z zapisanym celem biznesowym — nie wieczny pilotaż.",
      },
      {
        q: "Czy może się mylić?",
        a: "Tak. Dlatego istotne odpowiedzi mają źródło, a tego, czego nie ma w bazie, system nie wymyśla. Projekt zakłada weryfikację, nie ślepą wiarę w model.",
      },
    ],
    close: {
      heading: "Jeśli jest konkretny przypadek, go zobaczymy.",
      body: "Brief z sześcioma pytaniami albo spotkanie. Bez zobowiązań; zakres potwierdzamy na rozmowie.",
    },
  },
  automation: {
    metaTitle: "Automatyzacja i cyfryzacja",
    metaDescription:
      "Usunąć ręczne zadania i połączyć to, co dziś żyje w ludziach: CRM, poczta, wizyty, faktury i przypomnienia w przepływie, który idzie sam.",
    hero: {
      heading: "Mniej ręcznego kopiowania. Więcej procesu, który idzie sam.",
      body: "Rezerwacje, CRM, poczta, oferty, przypomnienia i fakturowanie. Mniej Excela, luźnego WhatsAppa i przepisywania między narzędziami.",
      primaryCta: "Poznaj widełki budżetu",
    },
    pains: [
      {
        title: "Te same dane wpisuje się trzy razy",
        body: "Strona, CRM, arkusz i WhatsApp. Każda kopia to opóźnienie i błąd, którego nikt nie widzi, aż zaboli.",
      },
      {
        title: "Proces żyje w jednej osobie",
        body: "Gdy jej nie ma, wizyty, follow-upy albo faktury stają. Nie ma systemu — jest pamięć.",
      },
      {
        title: "Narzędzia ze sobą nie rozmawiają",
        body: "Każde robi swoją część. Mostem jesteście wy, ręcznie, codziennie.",
      },
      {
        title: "Nikt nie mierzy, ile się traci",
        body: "Godziny kopiowania, pamiętania i gonienia. Koszt jest, ale nie widać go w żadnym raporcie.",
      },
    ],
    capabilities: [
      {
        title: "Pozyskanie, które samo wpada do CRM",
        body: "Formularz, strona albo WhatsApp: lead przychodzi z kontekstem, nie jako luźna wiadomość.",
      },
      {
        title: "Wizyty, przypomnienia i follow-up",
        body: "Kalendarz, powiadomienie i następny krok nie zależą od tego, czy ktoś sobie przypomni.",
      },
      {
        title: "Oferty, faktury i poczta operacyjna",
        body: "Ze stanu procesu do dokumentu albo wysyłki, bez ponownego wypełniania pól.",
      },
      {
        title: "Jasne reguły, nie magia",
        body: "Jeśli sprawa jest przewidywalna, automatyzujemy. Jeśli wymaga osądu, trafia do człowieka.",
      },
    ],
    flow: {
      heading: "Lead na stronie → CRM → WhatsApp → wizyta → przypomnienie → follow-up.",
      steps: [
        "Mapujemy prawdziwy przepływ: kto co robi, jakim narzędziem, gdzie pęka.",
        "Decydujemy, co zostaje, co łączymy i czego przestajemy robić ręcznie.",
        "Budujemy most: zdarzenia, pola i widoczne wyjątki.",
        "Startujemy odcinkiem procesu, nie całą firmą naraz.",
        "Mierzymy czas, błędy i wolumen. Kolejne odcinki dokładamy na dowodach.",
      ],
    },
    faq: [
      {
        q: "Czy trzeba wyrzucić narzędzia, których już używamy?",
        a: "Prawie nigdy. Najpierw decydujemy, czy integrować, uzupełniać, czy zastąpić. Jeśli CRM albo kalendarz działa, zostaje. Automatyzacja to nie zmiana oprogramowania dla sportu.",
      },
      {
        q: "Czy to po prostu Zapier?",
        a: "Czasem wystarczy lekki łącznik. Innym razem przepływ wymaga reguł, danych i wyjątków, których ogólny klej nie utrzyma. Widzimy to w zakresie, nie w gotowej recepturze.",
      },
      {
        q: "A wyjątki?",
        a: "Projektujemy je. Proces bez wyjątków to PowerPoint. Te, które mają znaczenie, trafiają do człowieka, z kontekstem do decyzji.",
      },
      {
        q: "Jak szybko widać wynik?",
        a: "Wąski odcinek — na przykład lead do wizyty — może być na produkcji w kilka tygodni. Cała operacja to inna rozmowa, fazami.",
      },
      {
        q: "Czy zespół musi zmienić sposób pracy?",
        a: "W minimalnym stopniu. Wolimy wdrażać tam, gdzie już pracują (poczta, CRM, WhatsApp), niż wymyślać kolejną platformę, której nikt nie otwiera.",
      },
    ],
    close: {
      heading: "Jeśli jakiś przepływ wciąż kopiuje się ręcznie, go zobaczymy.",
      body: "Brief albo spotkanie. Zakres, systemy i pierwszy odcinek potwierdzamy na piśmie.",
    },
  },
  software: {
    metaTitle: "Oprogramowanie na miarę",
    metaDescription:
      "Aplikacje webowe i mobilne, platformy wewnętrzne i SaaS, gdy problem wymaga własnego rozwiązania — nie kolejnej landing page ani sztywnej licencji.",
    hero: {
      heading: "Własne rozwiązanie, gdy problem tego wymaga.",
      body: "Aplikacje webowe i mobilne, portale, systemy zarządzania, API i dane. Rdzeń techniczny: oprogramowanie na miarę, nie strona do pozyskiwania.",
      primaryCta: "Poznaj widełki budżetu",
    },
    pains: [
      {
        title: "Dostosowaliście biznes do narzędzia",
        body: "Licencja nie pokrywa procesu. Zespół wymyśla obejścia w Excelu, a standard firmy się gubi.",
      },
      {
        title: "Jest arkusz, który rozumie tylko jedna osoba",
        body: "Rdzeń operacyjny mieści się w pliku. Nikt nie śmie go ruszyć. To się nie skaluje i nie da się tego audytować.",
      },
      {
        title: "Kilka systemów, żaden pełny przepływ",
        body: "Każdy kawałek coś robi. Proces od początku do końca nadal jest w głowie osoby, która koordynuje.",
      },
      {
        title: "Produkt, nie kolejna strona",
        body: "Potrzebna jest aplikacja, portal albo SaaS. Landing page problemu nie rozwiązuje.",
      },
    ],
    capabilities: [
      {
        title: "Aplikacje webowe i mobilne",
        body: "Główny przepływ, od początku do końca, z prawdziwymi użytkownikami. Nie prototyp, który zostaje w Figmie.",
      },
      {
        title: "Platformy wewnętrzne i portale",
        body: "Dla zespołu, klientów albo partnerów. Uprawnienia, stany i kryterium ukończenia.",
      },
      {
        title: "API, backend i dane",
        body: "Produkt ma stabilny rdzeń. Integracje i ekrany się na nim opierają, nie odwrotnie.",
      },
      {
        title: "SaaS i systemy zarządzania",
        body: "Gdy biznesem jest oprogramowanie. Minimum, które działa, nie nieskończony katalog pierwszego dnia.",
      },
    ],
    flow: {
      heading: "Rdzeń techniczny: oprogramowanie na miarę, nie strona do pozyskiwania.",
      steps: [
        "Rozumiemy proces, użytkowników i to, co boli w obecnych narzędziach.",
        "Uzgadniamy minimalny przepływ, który musi działać od początku do końca.",
        "Projektujemy i budujemy widać: dema, nie ciche „pracujemy nad tym”.",
        "Na produkcję wchodzi użyteczny wycinek. Resztę priorytetyzujemy na realnym użyciu.",
        "Mierzymy wynik zapisany na starcie. Potem korygujemy danymi.",
      ],
    },
    faq: [
      {
        q: "Skąd wiedzieć, że potrzebne jest własne oprogramowanie?",
        a: "Trzy sygnały naraz: krytyczny arkusz, który rozumie jedna osoba, te same dane w kilku programach i proces wymuszony limitem licencji. Jeśli to znasz, budowa przestaje być kaprysem.",
      },
      {
        q: "MVP czy cały produkt?",
        a: "Prawie zawsze wycinek, który pokrywa główny przepływ. Część pierwotnego planu zmienia się, gdy pojawią się użytkownicy. Odkrycie tego późno kosztuje przebudowę; wcześnie — korektę zakresu.",
      },
      {
        q: "Czy kod i dane są nasze?",
        a: "Tak. Dokumentujemy tak, by inny zespół techniczny mógł to utrzymywać. Dalsza współpraca przy rozwoju to decyzja, nie kłódka.",
      },
      {
        q: "Czy pracujecie fazami?",
        a: "To domyślny tryb. Każda faza ma dostawę, cenę i kryterium odbioru. Możecie zatrzymać się z czymś działającym, nie z projektem w połowie.",
      },
      {
        q: "Jak długo do pierwszej wersji na produkcji?",
        a: "Wąski główny przepływ liczy się zwykle w tygodniach, nie w roku. Konkretny termin wynika z zapisanego zakresu, nie z cennika katalogowego.",
      },
    ],
    close: {
      heading: "Jeśli problem wymaga produktu, nie kolejnego narzędzia, go zobaczymy.",
      body: "Brief albo spotkanie. Zakres, terminy i miara sukcesu na piśmie.",
    },
  },
  web: {
    metaTitle: "Strony www i obecność cyfrowa",
    metaDescription:
      "Jasne strony firmowe, landingi i ecommerce, gotowe do pozyskiwania. Potrzeba bardziej bezpośrednia niż produkt na miarę.",
    hero: {
      heading: "Jasna obecność cyfrowa, gotowa do pozyskiwania.",
      body: "Strony, landingi, katalogi, rezerwacje i utrzymanie. Firma prawie niewidoczna w sieci: strona, pozyskanie i kanał, w którym już do was piszą.",
      primaryCta: "Poznaj widełki budżetu",
    },
    pains: [
      {
        title: "Strona nie mówi, czym się zajmujecie",
        body: "Odwiedzający nie wie, czy jesteście dla niego, o co pytać i co będzie dalej. Wychodzi.",
      },
      {
        title: "Pozyskujecie późno albo wcale",
        body: "Nie ma jasnej drogi do spotkania, WhatsAppa albo formularza. Ruch się nie konwertuje.",
      },
      {
        title: "Jest wolna, nieaktualna albo uwięziona w kreatorze",
        body: "Każda zmiana to procedura. Układ nie wytrzymuje telefonu. Brakuje podstawowego SEO technicznego.",
      },
      {
        title: "Nie potrzebujecie produktu na miarę",
        body: "Potrzebujecie obecności, która pracuje: jasnej, szybkiej i spiętej z kanałem sprzedaży.",
      },
    ],
    capabilities: [
      {
        title: "Strony firmowe i landingi",
        body: "Przekaz, struktura i konkretny cel: brief, kalendarz albo kontakt. Bez stron na wypełnienie.",
      },
      {
        title: "Katalogi, rezerwacje i ecommerce",
        body: "Gdy trzeba pokazać, umówić albo sprzedać. Spięte z tym, czym już pobieracie opłaty albo obsługujecie.",
      },
      {
        title: "Redesign i podstawowe SEO techniczne",
        body: "Wydajność, indeksacja, analityka i baza, którą da się utrzymać.",
      },
      {
        title: "Utrzymanie",
        body: "Strony nie porzucamy w dniu publikacji. Zmiany, bezpieczeństwo i to, co przestaje konwertować.",
      },
    ],
    flow: {
      heading: "Firma prawie niewidoczna: strona, pozyskanie i WhatsApp.",
      steps: [
        "Ustalamy ofertę, odbiorców i działanie, które się liczy (spotkanie, wiadomość, zakup).",
        "Struktura, copy i projekt służą temu działaniu, nie portfolio.",
        "Budujemy szybko, mierzalnie i pod kanał, którego już używacie.",
        "Publikujemy z analityką i kryterium konwersji widać od razu.",
        "Korygujemy tytuły, ścieżki i wezwania według tego, co robią ludzie, nie według gustu.",
      ],
    },
    faq: [
      {
        q: "Strona czy oprogramowanie na miarę?",
        a: "Jeśli problemem jest pozyskanie, wyjaśnienie i rozmowa, wystarczy dobrze zrobiona strona. Jeśli problemem jest proces wewnętrzny albo produkt, to inna linia. Rozróżniamy to na starcie.",
      },
      {
        q: "Czy robicie ecommerce?",
        a: "Katalogi, checkout i to, co trzeba, by sprzedawać na serio, bez potwora pierwszego dnia. Jeśli rdzeniem jest magazyn, ERP albo dziwne reguły, wchodzą też integracje albo oprogramowanie.",
      },
      {
        q: "Czy jest SEO?",
        a: "Podstawowe SEO techniczne: szybkość, struktura, indeksacja, analityka. Kampanie reklamowe i blog nie są rdzeniem tej usługi, chyba że je uzgodnimy.",
      },
      {
        q: "Czy potem możemy edytować?",
        a: "Tak, z jasną granicą między treścią a projektem. Nie zostawiamy was w kreatorze, którego nie kontrolujecie.",
      },
      {
        q: "Języki?",
        a: "Strona już działa po hiszpańsku, angielsku i polsku, gdy trzeba. Zakres każdego języka ustalamy w briefie.",
      },
    ],
    close: {
      heading: "Jeśli strona nie pozyskuje, zmieniamy jej zadanie.",
      body: "Brief albo spotkanie. Cel pozyskania na piśmie, nie ładna i niema strona główna.",
    },
  },
  integrations: {
    metaTitle: "Integracje i systemy firmowe",
    metaDescription:
      "Połączyć CRM, ERP, płatności i to, czego już używacie. Najpierw decydujemy, czy integrować, uzupełniać, czy zastąpić — nie wyrzucamy tego, co działa.",
    hero: {
      heading: "Wasze narzędzia, połączone. Bez wymieniania tego, co działa.",
      body: "API, CRM, ERP, Stripe, WhatsApp, Google Workspace, Microsoft i systemy legacy. Obecne oprogramowanie zostaje; dane i przepływy przestają być oderwane.",
      primaryCta: "Poznaj widełki budżetu",
    },
    pains: [
      {
        title: "Każdy system to wyspa",
        body: "Zamówienia, faktury, klienci i magazyn się nie zgadzają. Mostem jest osoba z dwoma ekranami.",
      },
      {
        title: "Dane nigdzie nie są te same",
        body: "CRM mówi jedno, ERP drugie. Nikt nie wie, które jest aktualne, aż zapyta klient.",
      },
      {
        title: "Zapłaciliście za zamiennik, który nie pasuje",
        body: "Wymiana wszystkiego jest wolna i droga. Często wystarczy dobrze zrobiony most.",
      },
      {
        title: "Legacy nie wolno ruszać, ale trzeba z niego korzystać",
        body: "Fakturowanie, magazyn albo program sprzed piętnastu lat. Trzeba z nim rozmawiać, nie udawać, że go nie ma.",
      },
    ],
    capabilities: [
      {
        title: "API i synchronizacja",
        body: "Zdarzenia, kolejki i reguła, który rekord wygrywa przy konflikcie danych.",
      },
      {
        title: "CRM, ERP i płatności",
        body: "HubSpot, ERP-y, Stripe i to, co już rusza pieniądzem albo klientem. Łączyć, nie dublować.",
      },
      {
        title: "WhatsApp, poczta i Workspace",
        body: "Kanał, w którym już jest zespół albo klient, spięty z systemem ewidencji.",
      },
      {
        title: "Legacy z szacunkiem",
        body: "Odczyt, ograniczony zapis albo warstwa z przodu. Najpierw decyzja, potem budowa.",
      },
    ],
    flow: {
      heading: "Obecne oprogramowanie zostaje; dane i przepływy przestają być oderwane.",
      steps: [
        "Inwentaryzujemy systemy, właścicieli danych i przepływ, który wciąż robi się ręcznie.",
        "Decydujemy integrować, uzupełniać albo zastąpić — na piśmie, nie w biegu.",
        "Projektujemy kontrakt: pola, błędy, ponowienia i kto widzi awarię.",
        "Łączymy jeden prawdziwy odcinek (np. zamówienie → faktura) i testujemy.",
        "Mierzymy rozjazdy i zaoszczędzony czas. Kolejny most uzasadniamy tym.",
      ],
    },
    faq: [
      {
        q: "Integrować czy zastąpić?",
        a: "Najpierw decyzja. Jeśli obecne narzędzie pokrywa proces, a boli most, integrujemy. Jeśli narzędzie wymusza biznes, rozważamy uzupełnienie albo zmianę. Domyślnie nie wyrzucamy tego, co działa.",
      },
      {
        q: "Z jakimi systemami pracujecie?",
        a: "Z każdym, który ma API albo rozsądną drogę: CRM, ERP, Stripe, WhatsApp, Google, Microsoft, bazy danych. Jeśli nie ma dokumentacji, budujemy konektor. Zamkniętej listy nie ma.",
      },
      {
        q: "Co, jeśli system padnie w nocy?",
        a: "Ponowienia, dziennik i alert do osoby, która to obsługuje. Integracja bez obserwowalności to kolejny niewidzialny Excel.",
      },
      {
        q: "Jak długo do pierwszego użytecznego mostu?",
        a: "Wąski odcinek — jeden obiekt biznesowy, dwa systemy — to tygodnie. Mapa całej firmy to program, nie zgłoszenie.",
      },
      {
        q: "Czy zostajemy do was przywiązani?",
        a: "Nie. Dokumentujemy kontrakty, błędy i eksploatację. Utrzymanie z nami jest opcjonalne.",
      },
    ],
    close: {
      heading: "Jeśli mostem jesteście wy, zamieniamy to w system.",
      body: "Brief albo spotkanie. Co się łączy, co zostaje i jak widać awarię — na piśmie.",
    },
  },
} satisfies Record<ServiceId, ServicePageCopy>;
