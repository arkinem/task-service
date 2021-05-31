# task-service

[![test](https://github.com/arkinem/task-service/actions/workflows/test.yml/badge.svg)](https://github.com/arkinem/task-service/actions/workflows/test.yml)

## :rocket: Wersja live 
https://oko-task-service.herokuapp.com/graphql

dane do testow:<br/>
https://gist.github.com/arkinem/ae9930ad3e3f938fef60eafc01c21ff7

## :book: Wprowadzenie 

Poczatkowo wydawalo mi sie, ze jest to to klasyczny problem n + 1, stad sugestia by uzywac `dataloader`. Po zglebieniu polecenia uznalam ze jest mi on zbedny, ale w rzeczywistosci skonsultowalabym jeszcze uzycie go do wczytania rodzicow zadania z bardziej doswiadczonym uzytkownikiem tej biblioteki.

### Mutacja `createTask`

Umozliwia dodanie taska. Jesli `parentId` jest przekazane, sprawdza takze czy rodzic istnieje. W zadanej strukturze zaleznosci cykliczne (circular dependency) nie wystapia, wiec dodatkowa walidacja rodzicow rodzica itd. jest zbedna.

### Kwerenda `tasks`

Wykonuje tylko jedno zapytanie do bazy danych - wczytuje wszystkie taski wraz z ich `parentId`. Dalej funkcja `resolveParents` rekursywnie konstruuje kazdego taska, uzywajac listy wczytanej z bazy.

### Kwerenda `task`

Nie mam pewnosci czy udalo mi sie znalezc najbardziej wydajny sposob - aby wczytac rodzica, trzeba znac jego `id` wiec task musi byc wczytany. podobnie z rodzicem rodzica, nie da sie przewidziec jakie bedzie mial `id` bez wczytania samego rodzica. To powoduje wiele zapytan do bazy danych - dla kazdego poziomu. Byc moze tutaj dataloader moglby usprawnic ten proces.

## :whale: Docker 

zbuduj:
```
docker build -t task-service . 
```
uruchom:
```
docker run -p 4000:4000 task-service
```

## :hammer_and_wrench: Uruchom lokalnie 

Zainstaluj zaleznosci:
```
yarn
```

Uruchom serwer:
```
yarn start
```

Otworz interfejs w przegladarce:
```
http://localhost:4000/graphql
```

## :test_tube: Testuj lokalnie 

Na ten moment projekt zawiera jedynie testy integracyjne.

Zainstaluj zaleznosci:
```
yarn
```

Uruchom testy:
```
yarn test
```

Mozesz takze uruchomic `jest` w trybie obserwacji zmian:
```
yarn test:watch
```

## :bulb: Pomysly na przyszlosc 
Z racji ograniczen czasowych i malej skali projektu pewne pomysly bylyby przesada, ale mysle ze warto je tu wymienic:
- Wstrzykiwanie zaleznosci (DI), repozytorium, wieksza modularnosc kodu - to pozwoli dodac testy jednostkowe
- Cache (np. Redis) - nie ma mozliwosci edycji lub usuniecia tasku, wiec cache mogloby znaczaco zaoszczedzic zasoby
- Immutability - nie mam pewnosci czy jest to preferowana forma programowania w przypadku graphQL, ale testowanie kodu napewno byloby latwiejsze 
