# billing-ui

[![Build Status](https://travis-ci.org/skbkontur/billing-ui.svg?branch=master)](https://travis-ci.org/skbkontur/billing-ui)
[![npm version](https://badge.fury.io/js/billing-ui.svg)](https://badge.fury.io/js/billing-ui)

## Как работать над проектом локально
1. В корне "billing-ui" репозитория, через консольку, выполняем команду `npm link`
2. В корне репозитория, который использует "billing-ui", выполняем команду `npm link billing-ui`

## Как обновить версию billing-ui в основном репозитории
Выполнить в основном репозитории:
* `npm run update-billing-ui x.x.x`, где `x.x.x` - номер нужной версии

Это команда должна обновить package.json, заменить в папке `node_shrinkwrap` старый архив billing-ui на новый и внести правки в файл npm-shrinkwrap.json

## Поднятие версий

1. Закоммитить все изменения. Не должно быть даже unstaged changes.
2. Выполнить:
    * `npm version patch` - для поднятия последней цифры версии: 0.0.N (баг фикс)
    * `npm version minor` - для поднятия минорной версии: 0.N.0 (добавление функциональности)
    * `npm version major` - для поднятия мажорной версии: N.0.0 (breaking changes)
    * При необходимости можно дописать `-m "%s is version"` для добавления сообщения коммиту, где `%s` - номер новой версии

При этом запускаются тесты, поднимается версия в `package.json`, создается коммит и тэг и пушатся в репозиторий.

Для справки можно пользоваться [semver.org](http://semver.org/).
