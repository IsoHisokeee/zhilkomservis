var housesData = [
    {
        id: 1, address: "ул. Ленина, д. 15", yearBuilt: 1985, floors: 9,
        apartments: 144, hasElevator: true, status: "good",
        image: "images/house-brick.svg", totalArea: 8640,
        fundCollected: 1840, fundSpent: 1720, fundTarget: 2100,
        description: "Кирпичный дом. Капитальный ремонт проведён в 2020 г. Отремонтированы подъезды, заменён лифт."
    },
    {
        id: 2, address: "пр. Мира, д. 42", yearBuilt: 1972, floors: 5,
        apartments: 80, hasElevator: false, status: "satisfactory",
        image: "images/house-panel-5.svg", totalArea: 4400,
        fundCollected: 780, fundSpent: 520, fundTarget: 1350,
        description: "Панельный дом. Требуется текущий ремонт подъездов. Кровля в удовлетворительном состоянии."
    },
    {
        id: 3, address: "ул. Садовая, д. 8", yearBuilt: 2005, floors: 14,
        apartments: 196, hasElevator: true, status: "good",
        image: "images/house-modern.svg", totalArea: 13720,
        fundCollected: 4810, fundSpent: 1150, fundTarget: 3100,
        description: "Монолитный дом. Современные коммуникации, подземная парковка. Состояние отличное."
    },
    {
        id: 4, address: "ул. Советская, д. 23", yearBuilt: 1968, floors: 5,
        apartments: 60, hasElevator: false, status: "bad",
        image: "images/house-khrushchevka.svg", totalArea: 3300,
        fundCollected: 520, fundSpent: 380, fundTarget: 4200,
        description: "Хрущёвка. Требуется капитальный ремонт. Износ коммуникаций 70%. Включён в план капремонта на 2027 г."
    },
    {
        id: 5, address: "ул. Парковая, д. 3", yearBuilt: 1999, floors: 10,
        apartments: 120, hasElevator: true, status: "good",
        image: "images/house-panel-9.svg", totalArea: 7800,
        fundCollected: 1670, fundSpent: 890, fundTarget: 2600,
        description: "Кирпично-монолитный дом. Хорошее состояние, ухоженная придомовая территория."
    },
    {
        id: 6, address: "пер. Школьный, д. 7", yearBuilt: 1978, floors: 9,
        apartments: 108, hasElevator: true, status: "satisfactory",
        image: "images/house-panel-9.svg", totalArea: 6480,
        fundCollected: 1100, fundSpent: 840, fundTarget: 1900,
        description: "Панельный дом. Требуется косметический ремонт подъездов. Лифт заменён в 2022 г."
    },
    {
        id: 7, address: "ул. Речная, д. 12", yearBuilt: 2010, floors: 17,
        apartments: 238, hasElevator: true, status: "good",
        image: "images/house-modern.svg", totalArea: 16660,
        fundCollected: 3450, fundSpent: 1200, fundTarget: 4800,
        description: "Новостройка. Энергоэффективный дом с индивидуальным тепловым пунктом."
    },
    {
        id: 8, address: "ул. Лесная, д. 5", yearBuilt: 1965, floors: 5,
        apartments: 100, hasElevator: false, status: "bad",
        image: "images/house-khrushchevka.svg", totalArea: 5500,
        fundCollected: 480, fundSpent: 410, fundTarget: 3800,
        description: "Панельный дом. Износ 65%. План капремонта на 2028 г. Требуется замена инженерных сетей."
    }
];

var requestsData = [
    {
        id: 1, houseId: 4, type: "капитальный", description: "Замена труб холодного водоснабжения",
        status: "working", date: "2026-05-15", residentName: "Петров В.С.", apartment: "15",
        phone: "+7 (912) 345-67-89", cost: 380
    },
    {
        id: 2, houseId: 2, type: "текущий", description: "Ремонт освещения в подъезде №3",
        status: "pending", date: "2026-06-01", residentName: "Сидорова Е.А.", apartment: "42",
        phone: "+7 (923) 456-78-90"
    },
    {
        id: 3, houseId: 6, type: "текущий", description: "Замена почтовых ящиков",
        status: "pending", date: "2026-06-05", residentName: "Кузнецов И.М.", apartment: "67",
        phone: "+7 (934) 567-89-01"
    },
    {
        id: 4, houseId: 1, type: "капитальный", description: "Замена кровельного покрытия",
        status: "done", date: "2026-04-20", residentName: "Васильев А.А.", apartment: "88",
        phone: "+7 (945) 678-90-12", cost: 520
    },
    {
        id: 5, houseId: 3, type: "текущий", description: "Устранение протечки в подвале",
        status: "working", date: "2026-06-08", residentName: "Морозова Т.П.", apartment: "12",
        phone: "+7 (956) 789-01-23", payment: 2500
    },
    {
        id: 6, houseId: 1, type: "текущий", description: "Протекает крыша над кв. 88 после дождя",
        status: "pending", date: "2026-06-10", residentName: "Иванов Иван", apartment: "88",
        phone: "+7 (967) 890-12-34"
    },
    {
        id: 7, houseId: 7, type: "капитальный", description: "Неисправность системы вентиляции на 5-17 этажах",
        status: "pending", date: "2026-06-12", residentName: "Иванов Иван", apartment: "120",
        phone: "+7 (967) 890-12-34"
    },
    {
        id: 8, houseId: 5, type: "текущий", description: "Разбита входная дверь в 3-м подъезде",
        status: "pending", date: "2026-06-13", residentName: "Смирнов Д.В.", apartment: "55",
        phone: "+7 (978) 901-23-45"
    },
    {
        id: 9, houseId: 8, type: "капитальный", description: "Трещина в несущей стене, требуется обследование",
        status: "pending", date: "2026-06-14", residentName: "Белова Н.С.", apartment: "31",
        phone: "+7 (989) 012-34-56"
    }
];

var houses = [];
var requests = [];
var users = [];
var currentUser = null;

function initData() {
    if (!localStorage.getItem("zks_houses")) {
        localStorage.setItem("zks_houses", JSON.stringify(housesData));
    }
    if (!localStorage.getItem("zks_requests")) {
        localStorage.setItem("zks_requests", JSON.stringify(requestsData));
    }
    if (!localStorage.getItem("zks_users")) {
        var defaultUsers = [
            { name: "Администратор", email: "admin@uk.ru", password: btoa("admin123"), isAdmin: true, registeredAt: "2026-01-01" },
            { name: "Иванов Иван", email: "ivanov@mail.ru", password: btoa("123456"), isAdmin: false, registeredAt: "2026-06-01" }
        ];
        localStorage.setItem("zks_users", JSON.stringify(defaultUsers));
    }

    houses = JSON.parse(localStorage.getItem("zks_houses"));
    requests = JSON.parse(localStorage.getItem("zks_requests"));
    users = JSON.parse(localStorage.getItem("zks_users"));

    var houseImages = ["house-brick.svg","house-panel-5.svg","house-modern.svg","house-khrushchevka.svg","house-panel-9.svg","house-panel-9.svg","house-modern.svg","house-khrushchevka.svg"];
    var dirty = false;
    for (var i = 0; i < houses.length; i++) {
        var h = houses[i];
        if (h.fundCollected === undefined) { h.fundCollected = Math.floor(Math.random() * 2000) + 200; dirty = true; }
        if (h.fundSpent === undefined) { h.fundSpent = Math.floor(h.fundCollected * Math.random() * 0.6); dirty = true; }
        if (h.fundTarget === undefined) { h.fundTarget = h.fundCollected + Math.floor(Math.random() * 3000) + 500; dirty = true; }
        if (h.totalArea === undefined) { h.totalArea = h.apartments * 55; dirty = true; }
        if (!h.image) { h.image = "images/" + houseImages[i % houseImages.length]; dirty = true; }
    }
    if (dirty) { localStorage.setItem("zks_houses", JSON.stringify(houses)); }

    var stored = sessionStorage.getItem("zks_current");
    if (stored) {
        currentUser = JSON.parse(stored);
    }
}

function saveHouses() {
    localStorage.setItem("zks_houses", JSON.stringify(houses));
}

function saveRequests() {
    localStorage.setItem("zks_requests", JSON.stringify(requests));
}

function saveUsers() {
    localStorage.setItem("zks_users", JSON.stringify(users));
}

function getHouseById(id) {
    return houses.find(function(h) { return h.id === id; });
}

function getStatusLabel(status) {
    var map = { good: "хорошее", satisfactory: "удовлетворительное", bad: "требует ремонта" };
    return map[status] || status;
}

function getStatusClass(status) {
    var map = { good: "good", satisfactory: "satisfactory", bad: "bad" };
    return map[status] || "";
}

function getRequestStatusLabel(status) {
    var map = { pending: "запланирован", working: "в работе", done: "выполнен" };
    return map[status] || status;
}

function getRequestStatusClass(status) {
    return status || "";
}

function formatDate(d) {
    if (!d) return "";
    var parts = d.split("-");
    return parts[2] + "." + parts[1] + "." + parts[0];
}

var tariffRates = [
    { service: "Содержание жилья", rate: 28.50, unit: "руб/м2", desc: "Уборка, обслуживание инженерных систем, вывоз мусора" },
    { service: "Текущий ремонт", rate: 12.30, unit: "руб/м2", desc: "Мелкий ремонт подъездов, замена осветительных приборов" },
    { service: "Капитальный ремонт", rate: 14.80, unit: "руб/м2", desc: "Фонд капитального ремонта (ФКР)" },
    { service: "Отопление", rate: 38.20, unit: "руб/м2", desc: "По среднемесячным показателям, корректировка по счётчикам" },
    { service: "Холодная вода", rate: 42.10, unit: "руб/чел", desc: "При отсутствии ИПУ — по нормативу" },
    { service: "Горячая вода", rate: 205.60, unit: "руб/чел", desc: "Включает подогрев" },
    { service: "Водоотведение", rate: 32.80, unit: "руб/чел", desc: "Канализация" },
    { service: "Электроэнергия", rate: 6.50, unit: "руб/кВт·ч", desc: "По показаниям ИПУ, ОДН — по нормативу" }
];

var expenseItems = [
    { year: 2025, item: "Замена лифта (ул. Ленина, 15)", amount: 890, status: "done" },
    { year: 2025, item: "Ремонт подъездов (пр. Мира, 42)", amount: 210, status: "done" },
    { year: 2025, item: "Утепление фасада (ул. Парковая, 3)", amount: 340, status: "done" },
    { year: 2025, item: "Замена кровли (ул. Ленина, 15)", amount: 520, status: "done" },
    { year: 2026, item: "Замена труб ХВС (ул. Советская, 23)", amount: 380, status: "in_progress" },
    { year: 2026, item: "Ремонт освещения подъездов (пер. Школьный, 7)", amount: 95, status: "in_progress" },
    { year: 2026, item: "Благоустройство двора (ул. Речная, 12)", amount: 270, status: "planned" },
    { year: 2026, item: "Капитальный ремонт (ул. Лесная, 5)", amount: 1400, status: "planned" }
];

function showToast(msg, type) {
    var t = document.createElement("div");
    t.className = "toast toast-" + (type || "info");
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function() {
        t.style.transition = "opacity 0.3s";
        t.style.opacity = "0";
        setTimeout(function() { t.remove(); }, 300);
    }, 3000);
}

function formatMoney(n) {
    return (n || 0).toLocaleString("ru-RU");
}

function logOut() {
    currentUser = null;
    sessionStorage.removeItem("zks_current");
    window.location.href = "index.html";
}
