"use strict";

module.exports = _errResponses();

function _errResponses() {
  return {
    dbQueryError: 'Ошибка при выполнении запроса.',
    badData: 'Данных не найдено.',
    userExists: 'Пользователь уже существует.',
    incorrectPassword: 'Пароль не верный.'
  };
}