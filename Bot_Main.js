console.log("Bot for vk.com by 13.02.2019"); // вывод в консоль дату сборки бота

process.on("uncaughtException", (e) => console.error(e)); // вывод ошибок JavaScript 
process.on("unhandledRejection", (e) => console.error(e)); // вывод ошибок JavaScript 
const fs = require('fs'); // Библиотека для работы с фаловой системой
var colors = require('colors'); // Библиотека цветов в консоли 
var bans = require('./bans.json'); // Описание файла со списком банов
var admins = require('./admins.json'); // Описание файла со списком администрации
var VK = require("VK-Promise"), // Библиотека для работы с VK-API
  vk = new VK("сюда вписать access token"); // Токен страницы Бота

// Переменные с цветами
var bla = colors.black; 		// Черный
var red = colors.red; 			// Красный
var gre = colors.green; 		// Зеленый
var yel = colors.yellow; 		// Жёлтый
var blu = colors.blue; 			// Синий
var pur = colors.magenta; 		// Пурпуровый
var cya = colors.cyan; 			// Голубой
var whi = colors.white; 		// Белый
var gra = colors.gray; 			// Серый
var dgr = colors.grey; 			// Пасмурный

// Массивы с расписаниями 
var lessons_p316 = [
  ["&#128198; Расписание на понедельник", "1&#8419; МДК 03.02 ИСР ПО (Беликов А.Н.)", "2&#8419; БЖ (Бабкин С.И.)", "3&#8419; МДК 01.01 СП (Малыхина О.В.)"],														// day = 1
  ["&#128198; Расписание на вторник", "1&#8419; МДК 02.01 ИСиС (Адардасов А.А.)", "2&#8419; БЖ (Бабкин С.И.)", "3&#8419; МДК 01.02 ПП (Малыхина О.В.)"],															// day = 2
  ["&#128198; Расписание на среду", "&#127358; МДК 02.01 ИСиС (Адардасов А.А.)", "1&#8419; Физкультура", "2&#8419; МДК 01.01 СП / МДК 02.02 ТРиЗ БД (Малыхина О.В. / Сухарева Д.Б)"],								// day = 3
  ["&#128198; Расписание на четверг", "&#127358; МДК 03.01 ТР ПО(Адардасов А.А)", "1&#8419; МДК 02.01 ИСиС / МДК 03.02 ИСР ПО (Адардасов А.А. / Беликов А.Н.)", "2&#8419; МДК 02.02 ТРиЗ БД (Сухарева Д.Б.)"],		// day = 4
  ["&#128198; Расписание на пятницу", "1&#8419; МДК 02.02 ТРиЗ БД (Сухарева Д.Б.)", "2&#8419; МДК 01.02 ПП (Малыхина О.В.)", "3&#8419; МДК 01.01 СП (Малыхина О.В.)"],												// day = 5
  ["&#128198; Расписание на субботу", "&#127358; МДК 03.01 ТР ПО (Адардасов А.А.)", "1&#8419; МДК 02.01 ИСиС (Адардасов А.А.)", "2&#8419; Английский язык (Соха Л.И. / Ткачук Н.А.)"]								// day = 6
];


// Время для статистики
var counter_in = 0;			// Счетчик полученых msg
var counter_out = 1;			// Счетчик отправленных msg

var longpoolrestart = 0;			// Счетчик рестартов лонгпула

var seconds = 0;			// Секунды
var minute = 0;			// Минуты
var hours = 0;			// Часы
var days = 0;			// Дни

setInterval(function () { 			// Время uptime'а
  ++seconds;					// Каждую секунду добавлять в переменную seconds +1
  if (seconds === 60) {		// Если seconds = 60 то
    ++minute;				// minute +1 
    seconds = 0;			// обнуление секунд
    if (minute === 60) {	// если minute = 60 то
      ++hours;			// hours +1
      minute = 0;			// обнуление минут
      if (hours === 24) { // если hours = 24 то
        ++days			// days +1 
        hours = 0;		// обнуление часов
      }
    }
  }
}, 1000) // Выполнение всех элементов с интервалом 1000 мс

//День в году
var now = new Date();
var start = new Date(now.getFullYear(), 0, 0);
var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
var oneDay = 1000 * 60 * 60 * 24;
var dayofyear = Math.floor(diff / oneDay);
var WeekNumber = Math.round(((dayofyear - 1) / 7) + 1);
//if(WeekNumber % 2 == 0) уже в функции "какая неделя"

console.log(blu("\n\t\tЗапускаю бота...")); // Вывод в консоли "Запускаю бота" 

vk.longpoll.start({}); // Запускаем получение сообщений через LongPoll

vk.on("message", function (event, msg) { // Обрабатываем сообщения
  if (bans.indexOf(msg.user_id) != -1) 	// если пришло сообщение от человека, чей user_id находится в списке bans то игнорируем его
    return;

  if (!msg.out) cmdHandler(msg);
  //Время сообщений в чч:мм:сс
  var msghours = new Date().getHours();	// Получение часов 
  var msgminutes = new Date().getMinutes(); // Получение минут
  var msgseconds = new Date().getSeconds(); // Получение секунд

  if (msghours < 10) { // Если часов меньше 10 то
    msghours = '0' + msghours; // добавляем перед часами 0 
  }
  if (msgminutes < 10) { // Если минут меньше 10 то 
    msgminutes = '0' + msgminutes;	// добавялем перед минутми 0
  }
  if (msgseconds < 10) { // Если секунд меньше 10 то
    msgseconds = '0' + msgseconds; // добавляем 0 перед минутами
  }

  var msgtime = msghours + ":" + msgminutes + ":" + msgseconds; // отображение времени в формате чч:мм:сс

  //Дата сообщений в дд.мм.гггг
  var today = new Date(); // Получение Даты 
  var dd = today.getDate(); // День
  var mm = today.getMonth() + 1; // Месяц 
  var yyyy = today.getFullYear();	// Год

  if (dd < 10) { // если число меньше 10 то
    dd = '0' + dd; // добавляем 0 перед числом
  }
  if (mm < 10) { // если месяц меньше 10 то 
    mm = '0' + mm; // добавляем 0 перед месяцем
  }
  today = dd + "." + mm + "." + yyyy; // отображение даты в формате дд.мм.гггг

  // Выполнение функций из сообщений
  if (/^exe\s(.*)/i.test(msg.body)) {
    if (admins.indexOf(msg.user_id) >= 0) {
      msg.send(eval(msg.body.match(/^exe\s(.*)/i).slice(1)[0]));
    }
    else {
      msg.send("Эта команда доступна только администраторам!")
    }
  }

  // Вывод информации о диалогах в консоль
  if (msg.out) {
    console.log(gre("\nОтправлено сообщение!") + gra("\nchat_id: "), msg.peer_id, yel("\nmessage: "), msg.body);
    counter_out++;
  }

  if (!msg.body) {
    if (msg.out) return;
    console.log(cya("\n>>>> Новое сообщение! <<<<") + gra("\nchat_id: "), msg.peer_id, gra("\nuser_id: "), msg.user_id, red("\ndate: ") + today, red("\ntime: ") + msgtime + yel("\nmessage: "), "attachment");
    counter_in++;
  }
  else {
    if (msg.out) return;
    console.log(cya("\n>>>> Новое сообщение! <<<<") + gra("\nchat_id: "), msg.peer_id, gra("\nuser_id: "), msg.user_id, red("\ndate: ") + today, red("\ntime: ") + msgtime + yel("\nmessage: "), msg.body);
    counter_in++;
  }

  if (msg.user_id == msg.peer_id && msg.peer_id != 96534345) {
    vk.messages.send({ "user_id": 96534345, "message": "Новое сообщение в ЛС бота!" + "\nОтправитель: @id" + msg.peer_id + "\nСообщение: " + msg.body });
  }

  // Вывод /help в диалог 
  if (/^\/help$/ig.test(msg.body) || /^\/помощь$/ig.test(msg.body) || /^\/команды$/ig.test(msg.body))
    msg.send("Узнать команды и получить помощь вы можете в данной статье: vk.com/@botcoder-help");

  // Команды для теста бота 
  if (/^Бот$/ig.test(msg.body) || /^test$/ig.test(msg.body))
    msg.send("Шо?");

  if (/^тест$/ig.test(msg.body) || /^test$/ig.test(msg.body))
    msg.send("Чо тестим?");

  if (/^пинг$/ig.test(msg.body) && msg.user_id == 96534345 || /^пинг$/ig.test(msg.body) && msg.user_id == 249067404)
    msg.send("Понг");

if (/^еее/ig.test(msg.body) || /^test$/ig.test(msg.body))
    msg.send("Роцк! &#129304;");

  // Четность недели
  if (/^Какая неделя/ig.test(msg.body)) {
    msg.send("&#128197; Я все равно скажу неправду))");
  }

  // Расписание звонков
  if (/^Расписание\sзвонков/ig.test(msg.body)) {
    msg.send("0&#8419; Пара 7:30 - 8:50\nПеремена 10 мин.\n1&#8419; Пара 9:00 - 10:30\nПеремена 15 мин.\n2&#8419; Пара 10:45 - 12:15\nПеремена 30 мин.\n3&#8419; Пара 12:45 - 14:15\nПеремена 10 мин.\n4&#8419; Пара 14:25 - 15:55");
  }
  // Вывод расписаний для ТКМП_П-316

  if (/^Расписание\sна\sпонедельник/ig.test(msg.body) && msg.peer_id == 2000000001) {
    msg.send(lessons_p316[0].join("\n"));
  }
  else if (/^Расписание\sна\sвторник/ig.test(msg.body) && msg.peer_id == 2000000001) {
    msg.send(lessons_p316[1].join("\n"));
  }
  else if (/^Расписание\sна\sсреду/ig.test(msg.body) && msg.peer_id == 2000000001) {
    msg.send(lessons_p316[2].join("\n"));
  }
  else if (/^Расписание\sна\sчетверг/ig.test(msg.body) && msg.peer_id == 2000000001) {
    msg.send(lessons_p316[3].join("\n"));
  }
  else if (/^Расписание\sна\sпятницу/ig.test(msg.body) && msg.peer_id == 2000000001) {
    msg.send(lessons_p316[4].join("\n"));
  }
  else if (/^Расписание\sна\sсубботу/ig.test(msg.body) && msg.peer_id == 2000000001) {
    msg.send(lessons_p316[5].join("\n"));
  }
  else if (/^Расписание\sна\sвоскресение/ig.test(msg.body) && msg.peer_id == 2000000001) {
    msg.send("Ты дурак?");
  }

  if (/^Расписание$/ig.test(msg.body) && msg.peer_id == 2000000001) {
    msg.send(lessons_p316.map(a => a.join("\n")).join("\n\n"));
  }
  if (/Расписание\sна\sзавтра/ig.test(msg.body) && msg.peer_id == 2000000001) {
    var w = new Date().getDay();
    if (w != 6) {
      if (WeekNumber == 0) {
        WeekNumber + 1;
      }
      if (WeekNumber % 2 == 0) {
        msg.send("&#9888; Номер недели: 2\n" + lessons_p316[w].join("\n"));
      }
      else if (WeekNumber % 2 !== 0) {
        msg.send("&#9888; Номер недели: 1\n" + lessons_p316[w].join("\n"));
      }
    }
    if (w == 6) {
      msg.send("Завтра воскресенье");
    }
  }
  if (/Расписание\sна\sпослезавтра/ig.test(msg.body) && msg.peer_id == 2000000001) {
    var w = new Date().getDay();
    if (w != 6) {
      if (WeekNumber == 0) {
        WeekNumber + 1;
      }
      if (WeekNumber % 2 == 0) {
        msg.send("&#9888; Номер недели: 2\n" + lessons_p316[w + 1].join("\n"));
      }
      else if (WeekNumber % 2 !== 0) {
        msg.send("&#9888; Номер недели: 1\n" + lessons_p316[w + 1].join("\n"));
      }
    }
    if (w == 6) {
      msg.send("Послезавтра воскресенье");
    }
  }
  if (/Расписание\sна\sсегодня/ig.test(msg.body) && msg.peer_id == 2000000001) {
    var w = new Date().getDay();
    if (w == 0) {
      msg.send("Сегодня воскресенье!");
    }
    if (WeekNumber % 2 == 0) {
      msg.send("&#9888; Номер недели: 2\n" + lessons_p316[w - 1].join("\n"));
    }
    else if (WeekNumber % 2 !== 0) {
      msg.send("&#9888; Номер недели: 1\n" + lessons_p316[w - 1].join("\n"));
    }
  }


  
  // Вывод статистики за время работы бота

  function declOfNumIn(counter_in, n1st, n2st, n5st) {
    counter_in = counter_in < 0 ? -counter_in : counter_in;
    return [n1st, n2st, n5st][(counter_in % 100 > 4 && counter_in % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(counter_in % 10 < 5) ? counter_in % 10 : 5]].replace("*", counter_in);
  }

  function declOfNumOut(counter_out, n1st, n2st, n5st) {
    counter_out = counter_out < 0 ? -counter_out : counter_out;
    return [n1st, n2st, n5st][(counter_out % 100 > 4 && counter_out % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(counter_out % 10 < 5) ? counter_out % 10 : 5]].replace("*", counter_out);
  }


  if (/^\/Статистика$/ig.test(msg.body)) {
    msg.send("&#128190; Версия от 13.02.2019\n&#128290; Статистика бота с момента последнего запуска:\n&#8986; Бот работает " + days + "дн, " + hours + " ч, " + minute + " мин, " + seconds + " сек " + "\n\t&#128195; Получено " + counter_in + declOfNumIn(counter_in, " сообщение", " сообщения", " сообщений") + "\n&#128221; Отправлено " + counter_out + declOfNumIn(counter_out, " сообщение", " сообщения", " сообщений") + "\n&#128202; Перезапусков LongPool: " + longpoolrestart);
  }

  // Бан пользователей
  if (/^\/ban$/ig.test(msg.body)) {		// Если приходит сообщение /ban то
    if (admins.indexOf(msg.user_id) >= 0) {		// Проверяем что id отправителя есть в списке Admins 
      msg.get().then(m => {		// Получаем полное сообщение
        if (m.fwd_messages) { 	// Если есть пересланое сообщение
          let id = m.fwd_messages[0].user_id;		// Записываем в переменную ID пользователя, чье сообщение было переслано 
          let idindex = bans.indexOf(id);			// Записываем в переменную ответ функции indexOf с id пользователя
          if (idindex !== -1) {						// Если этот id уже есть в списке
            msg.send("Пользователь уже забанен!");	// Выводим сообщение что пользователь уже забанен
            return;			// Завершаем функцию
          }
          bans.push(id); // Если же id нет в списке то заносим его туда
          fs.writeFile('bans.json', JSON.stringify(bans), (err) => { 	// Записываем в файл
            if (err) throw err; // Если нет ошибок то 
            console.log('\nПроизведена перезапись файла Bans.json. Файл обновлен и сохранен успешно!\n'); // Выводим в консоль сообщение о том, что запись в файл была произведена успешно
          });
          msg.send("&#9989; id" + id + " забанен!"); // Отправляем сообщение о том, что пользователь забанен
        }
        else msg.send("А кого банить то?"); // Если нет пересланого сообщения то выводим соответствующее сообщение
      });
    }
    else msg.send("Эта команда доступна только администраторам!"); // Если id отправителя нет в списке admins то выводим соответствующее сообщение
  }

  if (/^\/unban$/ig.test(msg.body)) {	// Если приходит сообщение /unban то
    if (admins.indexOf(msg.user_id) >= 0) {		// Проверяем что id отправителя есть в списке Admins
      msg.get().then(m => { 					// Получаем полное сообщение
        if (m.fwd_messages) { 				// Если есть пересланое сообщение
          let id = m.fwd_messages[0].user_id;		// Записываем в переменную ID пользователя, чье сообщение было переслано
          let idindex = bans.indexOf(id); 		// Записываем в переменную ответ функции indexOf с id пользователя
          if (idindex !== -1) {				// Если этот id есть в списке
            bans.splice(idindex, 1);	// Удаляем его из него
          }
          else {	// если id нет в списке
            msg.send("Пользователь не забанен!");  // Выводим сообщение что пользователь не забанен
            return;				// Завершаем функцию
          }
          fs.writeFile('bans.json', JSON.stringify(bans), (err) => { // Записываем в файл
            if (err) throw err; 		// Если нет ошибок то
            console.log('\n----------\nПользователь разбанен. Файл обновлен и сохранен успешно!\n----------\n');  // Выводим в консоль сообщение о том, что запись в файл была произведена успешно
          });
          msg.send("&#9989; id" + id + " разбанен!"); 	// Отправляем сообщение о том, что пользователь забанен
        }
        else msg.send("А кого разбанить то?");	// Если нет пересланого сообщения то выводим соответствующее сообщение
      });
    }
    else msg.send("Эта команда доступна только администраторам!");	// Если id отправителя нет в списке admins то выводим соответствующее сообщение
  }

  if (/^\/bans/ig.test(msg.body)) { 		// Если пришло сообщение с командой
    if (bans.length == 0) {				// Проверяем что в файле bans.json нет записей
      msg.send("Список банов пуст!"); // Выводим соответствующее сообщение
      return; // Завершаем функцию
    }
    msg.send("&#128683; Список забаненых пользователей:\n @id" + bans.join("\n@id")); // Если список не пуст, то выводим весь список
  }

  // Администрация
  if (/^\/add\sadmin$/ig.test(msg.body)) {		// Если приходит сообщение /add admin
    if (admins.indexOf(msg.user_id) >= 0) {		// Проверяем что id отправителя есть в списке Admins 
      msg.get().then(m => {		// Получаем полное сообщение
        if (m.fwd_messages) { 	// Если есть пересланое сообщение
          let id = m.fwd_messages[0].user_id;		// Записываем в переменную ID пользователя, чье сообщение было переслано 
          let idindex = admins.indexOf(id);			// Записываем в переменную ответ функции indexOf с id пользователя
          if (idindex !== -1) {						// Если этот id уже есть в списке
            msg.send("Пользователь уже является администратором!");	// Выводим сообщение что пользователь уже администратор
            return;			// Завершаем функцию
          }
          admins.push(id); // Если же id нет в списке то заносим его туда
          fs.writeFile('admins.json', JSON.stringify(bans), (err) => { 	// Записываем в файл
            if (err) throw err; // Если нет ошибок то 
            console.log('\nПроизведена перезапись файла admins.json. Файл обновлен и сохранен успешно!\n'); // Выводим в консоль сообщение о том, что запись в файл была произведена успешно
          });
          msg.send("&#9989; id" + id + " теперь администратор!"); // Отправляем сообщение о том, что пользователь теперь администатор
        }
        else msg.send("А кого делать адмиистратором то?"); // Если нет пересланого сообщения то выводим соответствующее сообщение
      });
    }
    else msg.send("Эта команда доступна только администраторам!"); // Если id отправителя нет в списке admins то выводим соответствующее сообщение
  }

  if (/^\/remote admin$/ig.test(msg.body)) {	// Если приходит сообщение /remote admin
    if (admins.indexOf(msg.user_id) >= 0) {		// Проверяем что id отправителя есть в списке Admins
      msg.get().then(m => { 					// Получаем полное сообщение
        if (m.fwd_messages) { 				// Если есть пересланое сообщение
          let id = m.fwd_messages[0].user_id;		// Записываем в переменную ID пользователя, чье сообщение было переслано
          let idindex = admins.indexOf(id); 		// Записываем в переменную ответ функции indexOf с id пользователя
          if (idindex !== -1) {				// Если этот id есть в списке
            admins.splice(idindex, 1);	// Удаляем его из него
          }
          else {	// если id нет в списке
            msg.send("Пользователь не является администратором!");  // Выводим сообщение что пользователь не админ
            return;				// Завершаем функцию
          }
          fs.writeFile('admins.json', JSON.stringify(bans), (err) => { // Записываем в файл
            if (err) throw err; 		// Если нет ошибок то
            console.log('\n----------\nПроизведена перезапись файла admins.json. Файл обновлен и сохранен успешно!\n----------\n');  // Выводим в консоль сообщение о том, что запись в файл была произведена успешно
          });
          msg.send("&#9989; id" + id + " больше не является адмиистратором!"); 	// Отправляем сообщение о том, что пользователь забанен
        }
        else msg.send("А у кого админку забирать то?");	// Если нет пересланого сообщения то выводим соответствующее сообщение
      });
    }
    else msg.send("Эта команда доступна только администраторам!");	// Если id отправителя нет в списке admins то выводим соответствующее сообщение
  }

  if (/^\/admins/ig.test(msg.body)) { 		// Если пришло сообщение с командой
    if (admins.length == 0) {				// Проверяем что в файле admins.json нет записей
      msg.send("Список администраторов пуст!"); // Выводим соответствующее сообщение
      return; // Завершаем функцию
    }
    msg.send("&#128683; Список администраторов:\n @id" + admins.join("\n@id")); // Если список не пуст, то выводим весь список
  }

  // Игра Вероятность

  if (/^Вероятность того, что/ig.test(msg.body) || /^Вероятность того что/ig.test(msg.body)) { // Если пришло сообщение с командой
    var infarandom = 0 - 0.5 + Math.random() * (100 - 0 + 1); // В переменную infarandom заносим случайное число от 0 до 100
    infarandom = Math.round(infarandom); // Округляем это число до целого
    msg.send("Вероятность - " + infarandom + "%"); // Выводим сообщение с вероятностью
  }

  // Ручной рестарт LongPool
  if (/^\/rslp/ig.test(msg.body)) {				// Если пришло сообщение с командой
    if (admins.indexOf(msg.user_id) >= 0) {	// Проверяем наличие id отправителя в файле admins 
      longpoolrestart++;					// В счетчик рестартов лонгпула записываем +1	
      vk.longpoll.stop();					// Останавливаем лонгпул
      vk.longpoll.start();				// Запускаем лонгпул
      msg.send("&#9989; Лонгпул перезапущен!\n&#128202; Всего перезапусков:" + longpoolrestart);	// Выводим сообщение об успешном перезапуске лонгпула
    }
    else ("Эта команда доступна только администраторам!"); // Если id отправителя нет в файле то выводим соответствующее сообщение
  }

});		// Конец выполнения лонгпула

// Рестарт LongPool каждые 30 мин (1800000 мс)
setInterval(function () { 	// Описание интервала
  longpoolrestart++;		// В счетчик рестартов лонгпула записывем +1		
  vk.longpoll.stop()		// Останавливаем лонгпул
  vk.longpoll.start()		// Запускаем лонгпул
}, 1800000)  				// Выполняем все команды с интервалом 1 800 000 (30 минут)

console.log(gre("\t\tБот успещно запущен!")); //Выводим сообщение об успешном запуске всех функций бота

let cmds = [
  {
    regexp: /\/?отправь\s(?:\[id|.+?vk\.com\/(?:id)?)?([0-9A-z]+)(?:.+?])?\sсообщение\s(.*)/i,
    f: (msg) => {
      vk.users.get({
        user_ids: msg.params[1],
        fields: "domain"
      }).then((r) => {
        let [user] = r;
        let text = msg.params[2];

        vk.messages.send({
          peer_id: user.id,
          message: text
        }).then((r) => {
          msg.send(`Сообщение отправлено\nПолучатель: @${user.domain}\nСообщение: ${text}`);
        }).catch((e) => {
          msg.send("При отправке сообщения произошла ошибка!");
        });
      }).catch((e) => {
        msg.send("При получении id пользователя произошла ошибка!");
      });
    }
  }
];

function cmdHandler(msg) {
  cmds.forEach((cmd) => {
    let matched = msg.body.match(cmd.regexp);
    if (matched) {
      msg.params = matched;
      cmd.f(msg);
    }
  });
}