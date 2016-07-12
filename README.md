## Как работать над проектом локально
1. В корне "billing-ui" репозитория, через консольку, выполняем команду ``` npm link ```
2. В корне репозитория, который использует "billing-ui", выполняем команду ``` npm link billing-ui ```

Таким образом локальные изменения "billing-ui" будут синхронизированы с проектом в котором "billing-ui" используется

## Поднятие версий

1. Закоммитить все изменения. Не должно быть даже unstaged changes.
2. Выполнить:
    * `npm version patch` - для поднятия последней цифры версии: 0.0.N (баг фикс)
    * `npm version minor` - для поднятия минорной версии: 0.N.0 (добавление функциональности)
    * `npm version major` - для поднятия мажорной версии: N.0.0 (breaking changes)
    * По желанию можно дописать `-m "%s is version"` для добавления сообщения коммиту, где `%s` - номер новой версии

При этом запускаются тесты, поднимается версия в `package.json`, создается коммит и тэг и пушатся в репозиторий.

Для справки можно пользоваться [semver.org](http://semver.org/).
