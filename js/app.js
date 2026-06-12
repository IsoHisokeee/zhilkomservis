var currentPage = 1;
var itemsPerPage = 4;
var filteredHousesList = [];

function renderOneHouse(h) {
    var imgContent = h.image
        ? '<img src="' + h.image + '" alt="' + h.address + '" style="width:100%;height:100%;object-fit:cover;">'
        : '<div class="house-card-placeholder">' + h.address.charAt(0) + '</div>';

    var fundPercent = h.fundTarget > 0 ? Math.round((h.fundCollected / h.fundTarget) * 100) : 0;
    var fundBarStyle = fundPercent >= 100 ? 'background:#48BB78;' : (fundPercent > 50 ? 'background:#D4893B;' : 'background:#1B6B8A;');
    var totalNeeded = h.fundTarget || 0;
    var left = Math.max(0, totalNeeded - h.fundCollected);

    return '<div class="house-card">' +
        '<div class="house-card-img" onclick="showHouseModal(' + h.id + ')">' + imgContent +
        '<span class="house-status ' + getStatusClass(h.status) + '">' + getStatusLabel(h.status) + '</span>' +
        '</div>' +
        '<div class="house-card-body">' +
        '<h3><a href="#" onclick="showHouseModal(' + h.id + ');return false;">' + h.address + '</a></h3>' +
        '<div class="house-meta">' +
        '<span>Год: ' + h.yearBuilt + '</span>' +
        '<span>Этажей: ' + h.floors + '</span>' +
        '<span>Квартир: ' + h.apartments + '</span>' +
        '<span>' + (h.hasElevator ? 'лифт есть' : 'лифта нет') + '</span>' +
        '</div>' +
        '<p class="house-desc">' + h.description + '</p>' +
        '<div class="house-fund">' +
        '<div class="house-fund-header">' +
        '<span>Фонд ремонта: ' + formatMoney(h.fundCollected) + ' руб.</span>' +
        '<span>Нужно: ' + formatMoney(totalNeeded) + ' руб.</span>' +
        '</div>' +
        '<div class="house-fund-bar"><div class="house-fund-fill" style="width:' + fundPercent + '%;' + fundBarStyle + '"></div></div>' +
        '<div class="house-fund-footer">' +
        '<span>Собрано ' + fundPercent + '%</span>' +
        '<span>Осталось собрать: ' + formatMoney(left) + ' руб.</span>' +
        '</div>' +
        '</div>' +
        '<div style="display:flex;gap:0.5rem;margin-top:0.8rem;justify-content:center;">' +
        '<button class="btn btn-primary btn-sm" style="flex:1;" onclick="showHouseModal(' + h.id + ')">Подробнее</button>' +
        '<a href="repairs.html?house=' + h.id + '" class="btn btn-outline btn-sm" style="flex:1;">Заявка</a>' +
        '</div>' +
        '</div></div>';
}

function renderHouses(filtered) {
    var grid = document.getElementById("housesGrid");
    var list = filtered || houses;
    filteredHousesList = list;

    if (list.length === 0) {
        grid.innerHTML = '<div class="empty-state"><p>Нет домов по заданным критериям</p></div>';
        var pc = document.getElementById("pagination");
        if (pc) pc.innerHTML = "";
        return;
    }

    var totalPages = Math.ceil(list.length / itemsPerPage);
    if (currentPage > totalPages) currentPage = totalPages;
    var start = (currentPage - 1) * itemsPerPage;
    var end = Math.min(start + itemsPerPage, list.length);
    var pageItems = list.slice(start, end);

    grid.innerHTML = pageItems.map(function(h) { return renderOneHouse(h); }).join("");
    renderPagination(list.length);
}

function renderPagination(totalItems) {
    var container = document.getElementById("pagination");
    if (!container) return;
    var totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) { container.innerHTML = ""; return; }

    var html = "";

    if (currentPage > 1) {
        html += '<button class="btn btn-sm btn-ghost" onclick="goToPage(' + (currentPage - 1) + ')">← Назад</button>';
    } else {
        html += '<button class="btn btn-sm btn-ghost" disabled>← Назад</button>';
    }

    for (var i = 1; i <= totalPages; i++) {
        html += '<button class="btn btn-sm ' + (i === currentPage ? 'btn-primary' : 'btn-ghost') + '" onclick="goToPage(' + i + ')">' + i + '</button>';
    }

    if (currentPage < totalPages) {
        html += '<button class="btn btn-sm btn-ghost" onclick="goToPage(' + (currentPage + 1) + ')">Вперед →</button>';
    } else {
        html += '<button class="btn btn-sm btn-ghost" disabled>Вперед →</button>';
    }

    container.innerHTML = html;
}

function goToPage(page) {
    currentPage = page;
    renderHouses(filteredHousesList);
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function filterHouses() {
    currentPage = 1;

    var search = (document.getElementById("searchInput")?.value || "").toLowerCase();
    var statusFilter = document.getElementById("statusFilter")?.value || "all";
    var elevatorFilter = document.getElementById("elevatorFilter")?.value || "all";
    var sortFilter = document.getElementById("sortFilter")?.value || "default";

    var filtered = houses.filter(function(h) {
        if (search && !h.address.toLowerCase().includes(search)) return false;
        if (statusFilter !== "all" && h.status !== statusFilter) return false;
        if (elevatorFilter === "yes" && !h.hasElevator) return false;
        if (elevatorFilter === "no" && h.hasElevator) return false;
        return true;
    });

    var statusOrder = { good: 0, satisfactory: 1, bad: 2 };

    if (sortFilter === "year-asc") {
        filtered.sort(function(a, b) { return a.yearBuilt - b.yearBuilt; });
    } else if (sortFilter === "year-desc") {
        filtered.sort(function(a, b) { return b.yearBuilt - a.yearBuilt; });
    } else if (sortFilter === "status") {
        filtered.sort(function(a, b) { return statusOrder[a.status] - statusOrder[b.status]; });
    } else if (sortFilter === "apartments") {
        filtered.sort(function(a, b) { return b.apartments - a.apartments; });
    }

    renderHouses(filtered);
}

function renderRequests(filtered) {
    var container = document.getElementById("requestsList");
    var list = filtered || requests;

    if (list.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>Нет заявок</p></div>';
        return;
    }

    container.innerHTML = list.map(function(r) {
        var house = getHouseById(r.houseId);
        var address = house ? house.address : "Неизвестный адрес";
        var isAdmin = currentUser && currentUser.isAdmin;

        var actions = "";
        if (isAdmin) {
            actions = '<div class="request-actions">';
            if (r.status === "pending") {
                actions += '<button class="btn btn-warning btn-sm" onclick="updateRequestStatus(' + r.id + ',\'working\')">В работу</button>';
            }
            if (r.status === "working") {
                actions += '<button class="btn btn-success btn-sm" onclick="updateRequestStatus(' + r.id + ',\'done\')">Выполнен</button>';
            }
            if (r.status !== "done") {
                actions += '<button class="btn btn-ghost btn-sm" onclick="showEditRequestModal(' + r.id + ')">Изменить</button>';
            }
            actions += '<button class="btn btn-danger btn-sm" onclick="deleteRequest(' + r.id + ')">Удалить</button>';
            actions += '</div>';
        } else if (currentUser) {
            if (r.status === "pending") {
                actions += '<div class="request-actions"><button class="btn btn-danger btn-sm" onclick="cancelRequest(' + r.id + ')">Отменить</button></div>';
            }
        }

        var typeLabel = r.type.charAt(0).toUpperCase() + r.type.slice(1);

        return '<div class="request-card">' +
            '<div class="request-info">' +
            '<h3>' + address + ' — кв. ' + r.apartment + '</h3>' +
            '<p class="request-meta">' + typeLabel + ' / ' + formatDate(r.date) + '</p>' +
            '<p>' + r.description + '</p>' +
            '<p class="request-contact">' + r.residentName + ' — ' + r.phone + '</p>' +
            '</div>' +
            '<div class="request-side">' +
            '<span class="request-status ' + getRequestStatusClass(r.status) + '">' + getRequestStatusLabel(r.status) + '</span>' +
            actions +
            '</div></div>';
    }).join("");
}

function updateRequestStatus(id, status) {
    var r = requests.find(function(x) { return x.id === id; });
    if (r) {
        r.status = status;
        saveRequests();
        renderRequests();
        showToast("Статус заявки обновлён", "success");
    }
}

function deleteRequest(id) {
    if (!confirm("Удалить заявку?")) return;
    requests = requests.filter(function(x) { return x.id !== id; });
    saveRequests();
    renderRequests();
    showToast("Заявка удалена", "info");
}

function cancelRequest(id) {
    if (!confirm("Отменить заявку?")) return;
    requests = requests.filter(function(x) { return x.id !== id; });
    saveRequests();
    renderRequests();
    showToast("Заявка отменена", "info");
}

function showEditRequestModal(id) {
    var r = requests.find(function(x) { return x.id === id; });
    if (!r) return;
    var desc = prompt("Описание заявки:", r.description);
    if (desc && desc.trim()) {
        r.description = desc.trim();
        saveRequests();
        renderRequests();
        showToast("Заявка обновлена", "success");
    }
}

function renderAdminPanel() {
    var panel = document.getElementById("adminPanel");
    var counts = document.getElementById("adminCounts");
    var table = document.getElementById("adminTable");

    if (!panel) return;
    if (!currentUser || !currentUser.isAdmin) {
        panel.classList.remove("visible");
        return;
    }

    panel.classList.add("visible");

    var totalHouses = houses.length;
    var totalRequests = requests.length;
    var pendingRequests = requests.filter(function(r) { return r.status === "pending"; }).length;
    var workingRequests = requests.filter(function(r) { return r.status === "working"; }).length;

    var totalCollected = houses.reduce(function(s, h) { return s + (h.fundCollected || 0); }, 0);
    var totalSpent = houses.reduce(function(s, h) { return s + (h.fundSpent || 0); }, 0);
    var totalNeeded = houses.reduce(function(s, h) { return s + (h.fundTarget || 0); }, 0);
    var totalBalance = totalCollected - totalSpent;

    counts.innerHTML =
        '<div class="stat-card"><div class="num">' + totalHouses + '</div><div class="label">домов</div></div>' +
        '<div class="stat-card"><div class="num">' + totalRequests + '</div><div class="label">всего заявок</div></div>' +
        '<div class="stat-card"><div class="num">' + pendingRequests + '</div><div class="label">ожидают</div></div>' +
        '<div class="stat-card"><div class="num">' + workingRequests + '</div><div class="label">в работе</div></div>' +
        '<div class="stat-card" style="border-left:3px solid #48BB78;"><div class="num" style="color:#48BB78;">' + formatMoney(totalCollected) + ' ₽</div><div class="label">собрано</div></div>' +
        '<div class="stat-card" style="border-left:3px solid #E53E3E;"><div class="num" style="color:#E53E3E;">' + formatMoney(totalSpent) + ' ₽</div><div class="label">потрачено</div></div>' +
        '<div class="stat-card" style="border-left:3px solid ' + (totalBalance >= 0 ? '#48BB78' : '#E53E3E') + ';"><div class="num" style="color:' + (totalBalance >= 0 ? '#48BB78' : '#E53E3E') + ';">' + formatMoney(totalBalance) + ' ₽</div><div class="label">остаток</div></div>';

    table.innerHTML = '<table class="admin-table">' +
        '<thead><tr><th>Адрес</th><th>Год</th><th>Собрано</th><th>Потрачено</th><th>Доступно</th><th>Нужно</th><th></th></tr></thead>' +
        '<tbody>' + houses.map(function(h) {
            var bal = (h.fundCollected || 0) - (h.fundSpent || 0);
            return '<tr>' +
                '<td>' + h.address + '</td>' +
                '<td>' + h.yearBuilt + '</td>' +
                '<td>' + formatMoney(h.fundCollected) + '</td>' +
                '<td>' + formatMoney(h.fundSpent || 0) + '</td>' +
                '<td style="color:' + (bal >= 0 ? '#48BB78' : '#E53E3E') + ';font-weight:600;">' + formatMoney(bal) + '</td>' +
                '<td>' + formatMoney(h.fundTarget) + '</td>' +
                '<td class="admin-actions-cell">' +
                '<button class="btn btn-ghost btn-sm" onclick="showEditHouseModal(' + h.id + ')">Ред.</button> ' +
                '<button class="btn btn-danger btn-sm" onclick="deleteHouse(' + h.id + ')">Уд.</button>' +
                '</td></tr>';
        }).join("") +
        '</tbody></table>';
}

function showEditHouseModal(id) {
    var h = houses.find(function(x) { return x.id === id; });
    if (!h) return;
    var addr = prompt("Адрес:", h.address);
    if (addr && addr.trim()) h.address = addr.trim();
    var desc = prompt("Описание:", h.description);
    if (desc && desc.trim()) h.description = desc.trim();
    var status = prompt("Состояние (good/satisfactory/bad):", h.status);
    if (status && ["good","satisfactory","bad"].includes(status)) h.status = status;
    var collected = parseFloat(prompt("Собрано средств (тыс. руб.):", h.fundCollected));
    if (!isNaN(collected)) h.fundCollected = collected;
    var target = parseFloat(prompt("Требуется средств (тыс. руб.):", h.fundTarget));
    if (!isNaN(target)) h.fundTarget = target;
    saveHouses();
    renderAdminPanel();
    filterHouses();
    showToast("Дом обновлён", "success");
}

function deleteHouse(id) {
    if (!confirm("Удалить дом?")) return;
    houses = houses.filter(function(x) { return x.id !== id; });
    saveHouses();
    renderAdminPanel();
    filterHouses();
    showToast("Дом удалён", "info");
}

function addHouse() {
    var addr = prompt("Адрес дома:");
    if (!addr || !addr.trim()) return;
    var year = parseInt(prompt("Год постройки:", "2000"));
    var floors = parseInt(prompt("Этажей:", "5"));
    var apartments = parseInt(prompt("Квартир:", "60"));
    var elevator = confirm("Есть лифт?");
    var desc = prompt("Описание:", "");

    var newId = houses.length > 0 ? Math.max.apply(Math, houses.map(function(h) { return h.id; })) + 1 : 1;

    houses.push({
        id: newId,
        address: addr.trim(),
        yearBuilt: year || 2000,
        floors: floors || 5,
        apartments: apartments || 60,
        hasElevator: elevator,
        status: "satisfactory",
        image: null, totalArea: 0,
        fundCollected: 0, fundSpent: 0, fundTarget: 0,
        description: desc || ""
    });

    saveHouses();
    renderAdminPanel();
    filterHouses();
    showToast("Дом добавлен", "success");
}

function showHouseModal(id) {
    var h = houses.find(function(x) { return x.id === id; });
    if (!h) return;

    var fundPercent = h.fundTarget > 0 ? Math.round((h.fundCollected / h.fundTarget) * 100) : 0;
    var left = Math.max(0, (h.fundTarget || 0) - h.fundCollected);
    var balance = (h.fundCollected || 0) - (h.fundSpent || 0);
    var requestsCount = requests.filter(function(r) { return r.houseId === id; }).length;
    var doneRequests = requests.filter(function(r) { return r.houseId === id && r.status === "done"; }).length;

    var isAdmin = currentUser && currentUser.isAdmin;

    var overlay = document.getElementById("houseModalOverlay");
    overlay.style.display = "block";
    overlay.focus();

    var houseRequests = requests.filter(function(r) { return r.houseId === id; });

    var totalPayments = 0, totalCosts = 0;
    for (var i = 0; i < houseRequests.length; i++) {
        if (houseRequests[i].payment) totalPayments += houseRequests[i].payment;
        if (houseRequests[i].cost) totalCosts += houseRequests[i].cost;
    }

    var requestsHtml = '<div class="modal-requests"><h3>Заявки по дому</h3>';
    requestsHtml +=
        '<div class="modal-fund-total">' +
            '<span>Собрано по тарифам: <strong>' + formatMoney(h.fundCollected - totalPayments) + ' руб.</strong></span>' +
            '<span>Взносы по заявкам: <strong>' + formatMoney(totalPayments) + ' руб.</strong></span>' +
            '<span>Итого собрано: <strong style="color:#2D3748;">' + formatMoney(h.fundCollected || 0) + ' руб.</strong></span>' +
            (isAdmin ? '<span>Потрачено: <strong style="color:#E53E3E;">' + formatMoney(h.fundSpent || 0) + ' руб.</strong></span>' : '') +
        '</div>';

    if (houseRequests.length > 0) {
        for (var i = 0; i < houseRequests.length; i++) {
            var r = houseRequests[i];
            var finance = '';
            if (r.payment) finance += ' взнос: ' + formatMoney(r.payment) + ' руб.';
            if (r.cost) finance += ' стоимость: ' + formatMoney(r.cost) + ' руб.';
            requestsHtml +=
                '<div class="modal-request">' +
                    '<div class="mr-info">' +
                        '<strong>' + r.type + '</strong> — ' + r.description +
                        '<div class="mr-meta">' + r.residentName + ', кв.' + r.apartment + ' / ' + formatDate(r.date) + (finance ? '<span style="color:#718096;">' + finance + '</span>' : '') + '</div>' +
                    '</div>' +
                    '<div class="mr-actions">' +
                        '<span class="request-status ' + getRequestStatusClass(r.status) + '">' + getRequestStatusLabel(r.status) + '</span>';
            if (isAdmin) {
                requestsHtml +=
                        '<div class="mr-btn-group">' +
                            (r.status !== "done" ? '<button class="btn btn-sm btn-primary" onclick="changeRequestStatus(' + r.id + ')">&#9654;</button>' : '') +
                            (r.status === "pending" ? '<button class="btn btn-sm btn-danger" onclick="cancelRequest(' + r.id + ')">&#10005;</button>' : '') +
                        '</div>';
            }
            requestsHtml +=
                    '</div>' +
                '</div>';
        }
        requestsHtml += '</div>';
    } else {
        requestsHtml += '<p style="color:#A0AEC0;padding:0.8rem 0;">Заявок по этому дому нет</p></div>';
    }

    document.getElementById("houseModalBody").innerHTML =
        '<div class="modal-grid">' +
            '<div class="modal-main">' +
                '<h2>' + h.address + '</h2>' +
                '<p class="modal-desc">' + h.description + '</p>' +
                '<div class="modal-stats">' +
                    '<div class="modal-stat"><span class="label">Год постройки</span><span class="val">' + h.yearBuilt + '</span></div>' +
                    '<div class="modal-stat"><span class="label">Этажей</span><span class="val">' + h.floors + '</span></div>' +
                    '<div class="modal-stat"><span class="label">Квартир</span><span class="val">' + h.apartments + '</span></div>' +
                    '<div class="modal-stat"><span class="label">Общая площадь</span><span class="val">' + (h.totalArea || h.apartments * 55) + ' м²</span></div>' +
                    '<div class="modal-stat"><span class="label">Лифт</span><span class="val">' + (h.hasElevator ? 'есть' : 'нет') + '</span></div>' +
                    '<div class="modal-stat"><span class="label">Состояние</span><span class="val"><span class="house-status ' + getStatusClass(h.status) + '">' + getStatusLabel(h.status) + '</span></span></div>' +
                    '<div class="modal-stat"><span class="label">Заявок подано</span><span class="val">' + requestsCount + ' (выполнено: ' + doneRequests + ')</span></div>' +
                '</div>' +
            '</div>' +
            '<div class="modal-side">' +
                '<div class="modal-fund-card">' +
                    '<h3>Фонд ремонта</h3>' +
                    '<div class="fund-row"><span>Собрано</span><span class="num">' + formatMoney(h.fundCollected) + ' руб.</span></div>' +
                    (isAdmin ? '<div class="fund-row"><span>Потрачено</span><span class="num">' + formatMoney(h.fundSpent || 0) + ' руб.</span></div>' : '') +
                    '<div class="fund-row"><span>Требуется</span><span class="num">' + formatMoney(h.fundTarget || 0) + ' руб.</span></div>' +
                    '<div class="fund-row"><span>Осталось собрать</span><span class="num">' + formatMoney(left) + ' руб.</span></div>' +
                    (isAdmin ? '<div class="fund-row" style="border-top:2px solid #E2E8F0;margin-top:0.3rem;padding-top:0.5rem;"><span style="font-weight:700;">Доступно</span><span class="num" style="color:' + (balance >= 0 ? '#48BB78' : '#E53E3E') + ';">' + formatMoney(balance) + ' руб.</span></div>' : '') +
                    '<div style="margin-top:0.8rem;">' +
                        '<div class="house-fund-bar"><div class="house-fund-fill" style="width:' + fundPercent + '%;' + (fundPercent >= 100 ? 'background:#48BB78;' : fundPercent > 50 ? 'background:#D4893B;' : 'background:#1B6B8A;') + '"></div></div>' +
                        '<div style="display:flex;justify-content:space-between;font-size:0.8rem;color:#A0AEC0;">' +
                            '<span>' + fundPercent + '%</span>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<a href="repairs.html?house=' + h.id + '" class="btn btn-primary" style="width:100%;justify-content:center;margin-top:1rem;">Подать заявку</a>' +
            '</div>' +
        '</div>' +
        requestsHtml;
}

function closeHouseModal() {
    var el = document.getElementById("houseModalOverlay");
    if (!el || el.style.display === "none") return;
    var container = el.querySelector(".modal-container");
    if (container) container.classList.add("closing");
    setTimeout(function() {
        el.style.display = "none";
        if (container) container.classList.remove("closing");
    }, 200);
}

function formatDate(ts) {
    if (!ts) return "—";
    var d = new Date(ts);
    return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}

function changeRequestStatus(id) {
    var r = requests.find(function(x) { return x.id === id; });
    if (!r) return;
    var next = { pending: "working", working: "done", done: "done" }[r.status] || "done";
    if (!confirm("Перевести заявку в статус «" + getRequestStatusLabel(next) + "»?")) return;

    if (next === "done") {
        var cost = parseFloat(prompt("Стоимость работ (руб.):", r.cost || "0"));
        if (isNaN(cost) || cost < 0) cost = 0;
        r.cost = cost;
        if (cost > 0) {
            var house = houses.find(function(h) { return h.id === r.houseId; });
            if (house) {
                house.fundSpent = (house.fundSpent || 0) + cost;
                saveHouses();
            }
        }
    }

    r.status = next;
    saveRequests();
    renderAdminPanel();
    showHouseModal(r.houseId);
    showToast("Статус заявки изменён", "success");
}

function cancelRequest(id) {
    if (!confirm("Отменить заявку?")) return;
    var r = requests.find(function(x) { return x.id === id; });
    if (!r) return;
    var houseId = r.houseId;
    var idx = requests.indexOf(r);
    requests.splice(idx, 1);
    saveRequests();
    renderAdminPanel();
    showToast("Заявка отменена", "info");
    var modal = document.getElementById("houseModalOverlay");
    if (modal && modal.style.display === "block") {
        showHouseModal(houseId);
    } else {
        location.reload();
    }
}
