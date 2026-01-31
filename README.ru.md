# isdayoff-ts

[![NPM Version](https://img.shields.io/npm/v/isdayoff-ts.svg?style=flat-square)](https://www.npmjs.com/package/isdayoff-ts)
[![NPM Downloads](https://img.shields.io/npm/dt/isdayoff-ts.svg?style=flat-square)](https://www.npmjs.com/package/isdayoff-ts)

<p align="center">[English](./readme.md) | [Русский](./README.ru.md)</p>

<p align="center">[Changelog (English)](./CHANGELOG.md) | [Список изменений](./CHANGELOG.ru.md)</p>

isdayoff-ts — это TypeScript форк и улучшенная версия [isdayoff](https://www.npmjs.com/package/isdayoff), клиента для [isdayoff.ru](https://isdayoff.ru).

- никаких внешних зависимостей
- получение статуса дня на сегодня, завтра или любую дату
- получение статуса дня для любого месяца, года или произвольного периода времени не более 366 дней
- проверка, является ли год високосным

## Требования

Node.js v18 и выше

## Установка

```bash
npm install isdayoff-ts --save
```

## Использование

### Основные функции

Вызовы API IsDayOff для дат возвращают экземпляр `IsDayOffValue`:

`IsDayOffValue.bool()` возвращает:

- `true` для нерабочих дней и праздников
- `false` для остальных значений

`IsDayOffValue.value()` возвращает:

- 0 для рабочих дней
- 1 для нерабочих дней
- 2 для сокращенных дней при использовании `{ pre: true }`
- 4 для рабочих дней в период пандемии с `{ covid: true }`
- 8 для праздников при использовании `{ holidays: true }`

#### Пользовательский провайдер API

Ваш пользовательский API должен иметь следующие эндпоинты:

- `/today` - без параметров
- `/tomorrow` - без параметров
- `/api/getdata`
- - `year` ГГГГ или ГГ
- - `month` ММ
- - `day` ДД
- - `date1` и `date2` ГГГГММДД
- - другие опции API (см. тип ApiOptions)
- - булевы опции должны быть числовыми
- `/api/isleap`
- - `year` ГГГГ или ГГ

```ts
import isDayOff from "isdayoff-ts";

await isDayOff
  .setUrl("https://your.api.url") 
  .today() // ..и т.д.
```

#### Сегодня

```ts
import isDayOff from "isdayoff-ts";

/** возвращает значение для сегодняшнего дня */
isDayOff
  .today()
  .then((
    res // объект IsDayOffDay
    ) => {
    const bool = res.bool(); // получает IsDayOffValue как boolean: true для выходных и праздников, иначе false;
    const val = res.value(); // получает IsDayOffValue из объекта IsDayOffDay;

    console.log(`${date} — это ${bool ? "не" : ""}рабочий день.`);

  })
  .catch((err) => console.log(err.message));
```

#### Завтра

```ts
import isDayOff from "isdayoff-ts";

/** возвращает значение для завтрашнего дня */
isDayOff
  .tomorrow()
  .then((res) =>
    console.log(`${date} — это ${res.bool() ? "не" : ""}рабочий день.`)
  )
  .catch((err) => console.log(err.message));
```

#### Любая дата

```ts
import isDayOff from "isdayoff-ts";

/** возвращает false, если 10 сентября рабочий день, или true, если нет */
const date = new Date("2020-09-10");
isDayOff
  .day(date)
  .then((res) =>
    console.log(`${date} — это ${res.bool() ? "не" : ""}рабочий день.`)
  )
  .catch((err) => console.log(err.message));
```

#### Месяц

```ts
import isDayOff from "isdayoff-ts";

/** возвращает массив объектов IsDayOffDay для сентября 2020 года */
isDayOff
  .month(new Date("2020-09-01"))
  .then((res) => {
    res.forEach((v, i) => {
      console.log(
        `${i + 1}.${date.getMonth() + 1}.${date.getFullYear()} — это ${v.bool() ? "не" : ""}рабочий день.`
      );
    });
  })
  .catch((err) => console.log(err.message));
```

#### Год

```ts
import isDayOff from "isdayoff-ts";

// возвращает массив объектов IsDayOffDay для 2021 года
isDayOff
  .year(new Date(2021))
  .then((res) => {
    res.forEach((v, i) => {
      console.log(
        `День ${i + 1} в году ${date.getFullYear()} — это ${v.bool() ? "не" : ""}рабочий день.`
      );
    });
  })
  .catch((err) => console.log(err.message));
```

#### Интервал

```ts
import isDayOff from "isdayoff-ts";

// возвращает массив объектов IsDayOffDay для интервала
isDayOff
  .interval(new Date("2020-09-10"), new Date("2020-09-15"))
  .then((res) =>
    res.forEach((v, i) => {
      console.log(
        `День ${i + 1} в месяце ${date.getMonth() + 1} года ${date.getFullYear()} — это ${v.bool() ? "не" : ""}рабочий день.`
      );
    })
  )
  .catch((err) => console.log(err.message));
```

#### Високосный год

```ts
import isDayOff from "isdayoff-ts";

// возвращает true, если год високосный, иначе false
const leapDate = new Date("2020-09-10");
isDayOff
  .isLeapYear(leapDate)
  .then((res) =>
    console.log(
      `${leapDate.getFullYear()} ${res ? "является" : "не является"} високосным годом`
    )
  )
  .catch((err) => console.log(err.message));
```

## Лицензия

MIT
