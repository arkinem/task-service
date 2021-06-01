# task-service

[![test](https://github.com/arkinem/task-service/actions/workflows/test.yml/badge.svg)](https://github.com/arkinem/task-service/actions/workflows/test.yml)

## :rocket: Wersja live 
https://oko-task-service.herokuapp.com/graphql

Dane do testow:<br/>
https://gist.github.com/arkinem/ae9930ad3e3f938fef60eafc01c21ff7

## :book: Wprowadzenie 

Początkowo wydawało mi się, że jest to klasyczny problem n + 1, stad sugestia by używać `dataloader`. Po zglebieniu polecenia uznałam że jest mi on zbędny, ale w rzeczywistości skonsultowałabym jeszcze użycie go do wczytania rodziców zadania z bardziej doświadczonym użytkownikiem tej biblioteki.

### Mutacja `createTask`

Umożliwia dodanie taska. Jeśli `parentId` jest przekazane, sprawdza także czy rodzic istnieje. W żądanej strukturze zależności cykliczne (circular dependency) nie wystąpią, więc dodatkowa walidacja rodziców rodzica itd. jest zbędna.

### Kwerenda `tasks`

Wykonuje tylko jedno zapytanie do bazy danych - wczytuje wszystkie taski wraz z ich `parentId`. Dalej funkcja `resolveParents` rekursywnie konstruuje każdego taska, używając listy wczytanej z bazy.

### Kwerenda `task`

Nie mam pewności czy udało mi się znaleźć najbardziej wydajny sposób - aby wczytać rodzica, trzeba znać jego `id` więc task musi być wczytany. Podobnie z rodzicem rodzica, nie da się przewidzieć jakie będzie miał `id` bez wczytania samego rodzica. To powoduje wiele zapytań do bazy danych - dla każdego poziomu. Być może tutaj dataloader mógłby usprawnić ten proces.

## :whale: Docker 

Zbuduj:
```
docker build -t task-service . 
```
Uruchom:
```
docker run -p 4000:4000 task-service
```

## :hammer_and_wrench: Uruchom lokalnie 

Zainstaluj zależności:
```
yarn
```

Uruchom serwer:
```
yarn start
```

Otwórz interfejs w przeglądarce:
```
http://localhost:4000/graphql
```

## :test_tube: Testuj lokalnie 

Na ten moment projekt zawiera jedynie testy integracyjne.

Zainstaluj zależności:
```
yarn
```

Uruchom testy:
```
yarn test
```

Możesz także uruchomić `jest` w trybie obserwacji zmian:
```
yarn test:watch
```

## :bulb: Pomysły na przyszłość 
Z racji ograniczeń czasowych i małej skali projektu pewne pomysły byłyby przesadą, ale myślę że warto je tu wymienić:
- Wstrzykiwanie zależności (DI), repozytorium, większa modularnosc kodu - to pozwoli dodać testy jednostkowe
- Cache (np. Redis) - nie ma możliwości edycji lub usunięcia tasku, więc cache mogłoby znacząco zaoszczędzić zasoby
- Immutability - nie mam pewności czy jest to preferowana forma programowania w przypadku graphQL, ale testowanie kodu napewno byłoby łatwiejsze 
