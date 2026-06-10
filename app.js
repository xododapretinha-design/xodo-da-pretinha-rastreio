// SISTEMA DE RASTREIO - XODÓ DA PRETINHA
// app.js (Código de controle frontend - Full-Stack com Rotas por Hash)

const STAGE_METADATA = {
    1: {
        title: "Fase 1: Aquisição do Produto",
        desc: "Os produtos da sua compra estão sendo recolhidos junto aos nossos ateliers e fornecedores de alta costura e passam por inspeção de qualidade."
    },
    2: {
        title: "Fase 2: Empacotamento",
        desc: "Sua encomenda está sendo cuidadosamente embalada, perfumada e preparada para transporte de longa distância, garantindo total segurança física dos itens."
    },
    3: {
        title: "Fase 3: Envio para Angola",
        desc: "A encomenda já foi despachada internacionalmente e está em trânsito aéreo/marítimo com destino a Luanda, Angola. O desembaraço aduaneiro ocorrerá na chegada."
    },
    4: {
        title: "Fase 4: Recepção e Disponibilidade",
        desc: "Sua encomenda chegou em solo angolano! O produto já está disponível para retirada no nosso ponto de distribuição ou em trânsito para entrega ao cliente."
    }
};

// --- ELEMENTOS DO DOM ---
const mainHeader = document.getElementById("main-header");
const userDisplayName = document.getElementById("user-display-name");
const logoutBtn = document.getElementById("logout-btn");

// Views
const viewGateway = document.getElementById("view-gateway");
const viewClient = document.getElementById("view-client");
const viewAdmin = document.getElementById("view-admin");

// Gateway Login
const paneClient = document.getElementById("pane-client");
const paneAdmin = document.getElementById("pane-admin");
const gatewayClientForm = document.getElementById("gateway-client-form");
const gatewayAdminForm = document.getElementById("gateway-admin-form");
const gatewayTrackingCode = document.getElementById("gateway-tracking-code");
const gatewayAdminUser = document.getElementById("gateway-admin-user");
const gatewayAdminPass = document.getElementById("gateway-admin-pass");
const gatewayErrorBanner = document.getElementById("gateway-error-banner");
const gatewayErrorText = document.getElementById("gateway-error-text");

// Portal Cliente Rastreio
const trackingResultSection = document.getElementById("tracking-result-section");
const resCode = document.getElementById("res-code");
const resClient = document.getElementById("res-client");
const resClientMeta = document.getElementById("res-client-meta");
const resEmailMeta = document.getElementById("res-email-meta");
const resDestination = document.getElementById("res-destination");
const resDestinationMeta = document.getElementById("res-destination-meta");
const resCreated = document.getElementById("res-created");
const resUpdated = document.getElementById("res-updated");
const resProductsList = document.getElementById("res-products-list");
const resHistoryLog = document.getElementById("res-history-log");
const resStatusTitle = document.getElementById("res-status-title");
const resStatusDesc = document.getElementById("res-status-desc");
const resStatusBanner = document.getElementById("res-status-banner");
const timelineProgress = document.getElementById("timeline-progress");
const btnPrintSlip = document.getElementById("btn-print-slip");

// Painel Admin Encomendas
const adminCreateForm = document.getElementById("admin-create-form");
const adminCodeInput = document.getElementById("admin-code");
const adminGenerateBtn = document.getElementById("admin-generate-code-btn");
const adminClientInput = document.getElementById("admin-client");
const adminEmailInput = document.getElementById("admin-email");
const adminDestinationInput = document.getElementById("admin-destination");
const adminProductsInput = document.getElementById("admin-products");
const adminInitialNoteInput = document.getElementById("admin-initial-note");
const adminOrdersList = document.getElementById("admin-orders-list");
const adminSearchInput = document.getElementById("admin-search");

// Cards de Estatísticas Admin
const statTotal = document.getElementById("stat-total");
const statAcq = document.getElementById("stat-acq");
const statTransit = document.getElementById("stat-transit");
const statDone = document.getElementById("stat-done");

// Modal de Histórico/Logs
const logModal = document.getElementById("log-modal");
const modalCloseBtn = document.getElementById("modal-close-btn");
const modalCancelBtn = document.getElementById("modal-cancel-btn");
const modalLogForm = document.getElementById("modal-log-form");
const modalOrderCode = document.getElementById("modal-order-code");
const modalStageSelect = document.getElementById("modal-stage");
const modalLogTitle = document.getElementById("modal-log-title");
const modalLogDesc = document.getElementById("modal-log-desc");

// Modal de Edição de Informações
const editModal = document.getElementById("edit-modal");
const editModalCloseBtn = document.getElementById("edit-modal-close-btn");
const editModalCancelBtn = document.getElementById("edit-modal-cancel-btn");
const modalEditForm = document.getElementById("modal-edit-form");
const editOrderCode = document.getElementById("edit-order-code");
const editClientInput = document.getElementById("edit-client");
const editEmailInput = document.getElementById("edit-email");
const editDestinationInput = document.getElementById("edit-destination");
const editProductsInput = document.getElementById("edit-products");

// Feedbacks
const toastContainer = document.getElementById("toast-container");

// --- UTILITÁRIOS: TOAST E DATAS ---
function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    
    let icon = "";
    if (type === "success") {
        icon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
    } else if (type === "error") {
        icon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>`;
    } else {
        icon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>`;
    }

    toast.innerHTML = `${icon} <span>${message}</span>`;
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(50px)";
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function formatDate(isoString) {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}/${month}/${year} às ${hours}:${minutes}`;
}

// --- COMUNICADOR DE APIs COM SUPORTE A TOKEN ---
function fetchAdmin(url, options = {}) {
    const token = sessionStorage.getItem("xodo_token");
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
    
    return fetch(url, { ...options, headers })
    .then(async res => {
        if (res.status === 401) {
            // Token expirado ou inválido
            sessionStorage.clear();
            window.location.hash = "#/login";
            showToast("Sessão expirada. Por favor, logue novamente.", "error");
            throw new Error("Não autorizado");
        }
        return res.json();
    });
}

// --- ROTEADOR SPA POR HASH ---
function handleRouting() {
    const hash = window.location.hash || "#/login";
    
    // Ocultar todas as views
    viewGateway.classList.remove("active");
    viewClient.classList.remove("active");
    viewAdmin.classList.remove("active");
    mainHeader.style.display = "none";
    
    const role = sessionStorage.getItem("xodo_user_role");
    const userId = sessionStorage.getItem("xodo_user_id");
    
    if (hash === "#/admin") {
        if (role === "admin") {
            viewAdmin.classList.add("active");
            mainHeader.style.display = "flex";
            userDisplayName.textContent = "Modo Administrador";
            loadAdminDashboard();
        } else {
            window.location.hash = "#/login";
            showToast("Acesso administrativo negado. Identifique-se.", "error");
        }
    } 
    else if (hash === "#/rastreio") {
        if (role === "client" && userId) {
            viewClient.classList.add("active");
            mainHeader.style.display = "flex";
            userDisplayName.textContent = `Código: ${userId}`;
            loadClientTracking(userId);
        } else {
            window.location.hash = "#/login";
        }
    } 
    else if (hash === "#/portal-admin") {
        if (role === "admin") {
            window.location.hash = "#/admin";
        } else {
            viewGateway.classList.add("active");
            paneAdmin.classList.add("active");
            paneClient.classList.remove("active");
        }
    }
    else { // #/login ou rota padrão
        if (role === "admin") {
            window.location.hash = "#/admin";
        } else if (role === "client" && userId) {
            window.location.hash = "#/rastreio";
        } else {
            viewGateway.classList.add("active");
            paneClient.classList.add("active");
            paneAdmin.classList.remove("active");
        }
    }
}

window.addEventListener("hashchange", handleRouting);

// --- LÓGICA DO PORTAL DE LOGIN (GATEWAY) ---

// Submit Login Cliente
gatewayClientForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const trackingCode = gatewayTrackingCode.value.trim().toUpperCase();
    if (!trackingCode) return;
    
    fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingCode })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            gatewayErrorBanner.style.display = "none";
            sessionStorage.setItem("xodo_token", data.token);
            sessionStorage.setItem("xodo_user_role", "client");
            sessionStorage.setItem("xodo_user_id", trackingCode);
            window.location.hash = "#/rastreio";
        } else {
            gatewayErrorText.textContent = data.message || "Código de rastreamento inválido.";
            gatewayErrorBanner.style.display = "flex";
            showToast("Código não encontrado.", "error");
        }
    })
    .catch(err => {
        console.error("Erro ao efetuar login cliente:", err);
        showToast("Erro ao conectar ao servidor.", "error");
    });
});

// Submit Login Admin
gatewayAdminForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = gatewayAdminUser.value.trim();
    const password = gatewayAdminPass.value.trim();
    
    fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            gatewayErrorBanner.style.display = "none";
            sessionStorage.setItem("xodo_token", data.token);
            sessionStorage.setItem("xodo_user_role", "admin");
            sessionStorage.setItem("xodo_user_id", "admin");
            window.location.hash = "#/admin";
        } else {
            gatewayErrorText.textContent = data.message || "Usuário ou senha incorretos.";
            gatewayErrorBanner.style.display = "flex";
            showToast("Falha no login admin.", "error");
        }
    })
    .catch(err => {
        console.error("Erro ao efetuar login admin:", err);
        showToast("Erro de rede ao logar.", "error");
    });
});

// Botão de Logout
logoutBtn.addEventListener("click", () => {
    sessionStorage.clear();
    
    // Limpar campos
    gatewayTrackingCode.value = "";
    gatewayAdminUser.value = "";
    gatewayAdminPass.value = "";
    
    // Limpar URL
    const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    window.history.pushState({path:cleanUrl}, '', cleanUrl);
    
    window.location.hash = "#/login";
    showToast("Sessão finalizada.", "info");
});

// --- PORTAL DO CLIENTE: RASTREAMENTO ---
function loadClientTracking(code) {
    fetch(`/api/orders/${code}`)
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            renderTrackingResult(data.order);
        } else {
            sessionStorage.clear();
            window.location.hash = "#/login";
            showToast("Encomenda expirada ou excluída.", "error");
        }
    })
    .catch(err => {
        console.error("Erro ao carregar dados do cliente:", err);
        showToast("Erro de conexão ao buscar encomenda.", "error");
    });
}

function renderTrackingResult(order) {
    resCode.textContent = order.trackingCode;
    resClient.textContent = order.customerName;
    resClientMeta.textContent = order.customerName;
    resEmailMeta.textContent = order.customerEmail;
    resDestination.textContent = order.destination;
    resDestinationMeta.textContent = order.destination;
    resCreated.textContent = formatDate(order.createdAt);
    resUpdated.textContent = formatDate(order.updatedAt);
    
    // Progress bar
    const stagesTotal = 4;
    const progressPercent = ((order.currentStage - 1) / (stagesTotal - 1)) * 100;
    
    const isMobile = window.innerWidth <= 650;
    if (isMobile) {
        timelineProgress.style.width = "4px";
        timelineProgress.style.height = `${progressPercent}%`;
    } else {
        timelineProgress.style.height = "4px";
        timelineProgress.style.width = `${progressPercent}%`;
    }
    
    // Toggle active/completed steps
    for (let i = 1; i <= 4; i++) {
        const stepElement = document.getElementById(`step-${i}`);
        if (stepElement) {
            stepElement.classList.remove("active", "completed");
            if (i < order.currentStage) {
                stepElement.classList.add("completed");
            } else if (i === order.currentStage) {
                stepElement.classList.add("active");
            }
        }
    }
    
    const stageMeta = STAGE_METADATA[order.currentStage];
    resStatusTitle.textContent = stageMeta.title;
    resStatusDesc.textContent = order.history[0]?.description || stageMeta.desc;
    
    if (order.currentStage === 4) {
        resStatusBanner.classList.add("completed-color");
    } else {
        resStatusBanner.classList.remove("completed-color");
    }
    
    // Lista de Produtos
    resProductsList.innerHTML = "";
    order.products.forEach(prod => {
        const match = prod.match(/(.+?)\s*\((\d+)\)/);
        let name = prod;
        let qty = "x1";
        if (match) {
            name = match[1];
            qty = `x${match[2]}`;
        }
        
        const item = document.createElement("div");
        item.className = "product-item";
        item.innerHTML = `
            <span class="product-name">${name}</span>
            <span class="product-qty">${qty}</span>
        `;
        resProductsList.appendChild(item);
    });
    
    // Histórico de atualizações
    resHistoryLog.innerHTML = "";
    order.history.forEach((hist, index) => {
        const isLatest = index === 0;
        const item = document.createElement("div");
        item.className = `history-item ${isLatest ? 'highlighted' : ''}`;
        
        item.innerHTML = `
            <div class="history-dot"></div>
            <span class="history-time">${formatDate(hist.timestamp)}</span>
            <h4 class="history-title">${hist.title}</h4>
            <p class="history-body">${hist.description}</p>
        `;
        resHistoryLog.appendChild(item);
    });
}

// Botão de Impressão (Guia / Voucher)
btnPrintSlip.addEventListener("click", () => {
    window.print();
});

// --- PAINEL DO ADMINISTRADOR ---
function loadAdminDashboard() {
    if (!adminCodeInput.value) {
        adminCodeInput.value = autoGenerateCode();
    }
    fetchAdmin('/api/orders')
    .then(data => {
        if (data.success) {
            renderAdminOrders(data.orders);
            calculateAndRenderStats(data.orders);
        }
    })
    .catch(err => {
        console.error("Erro ao carregar painel admin:", err);
    });
}

// Estatísticas
function calculateAndRenderStats(ordersList) {
    let total = ordersList.length;
    let acq = 0;
    let transit = 0;
    let done = 0;
    
    ordersList.forEach(o => {
        if (o.currentStage === 1) acq++;
        else if (o.currentStage === 2 || o.currentStage === 3) transit++;
        else if (o.currentStage === 4) done++;
    });
    
    statTotal.textContent = total;
    statAcq.textContent = acq;
    statTransit.textContent = transit;
    statDone.textContent = done;
}

// Renderizar Encomendas
function renderAdminOrders(ordersList) {
    adminOrdersList.innerHTML = "";
    
    const filterQuery = adminSearchInput.value.toLowerCase();
    const filteredOrders = ordersList.filter(o => 
        o.trackingCode.toLowerCase().includes(filterQuery) || 
        o.customerName.toLowerCase().includes(filterQuery)
    );
    
    if (filteredOrders.length === 0) {
        adminOrdersList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon" style="color: var(--text-muted); opacity: 0.5; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                </div>
                <p>Nenhuma encomenda cadastrada encontrada.</p>
            </div>
        `;
        return;
    }
    
    filteredOrders.forEach(order => {
        const card = document.createElement("div");
        card.className = "admin-order-card";
        
        let badgeClass = "";
        let stageName = "";
        switch(order.currentStage) {
            case 1: badgeClass = "badge-aquisicao"; stageName = "Aquisição"; break;
            case 2: badgeClass = "badge-empacotamento"; stageName = "Empacotamento"; break;
            case 3: badgeClass = "badge-envio"; stageName = "Envio Angola"; break;
            case 4: badgeClass = "badge-recepcao"; stageName = "Recepção"; break;
        }
        
        card.innerHTML = `
            <div class="admin-order-top">
                <span class="admin-order-code">${order.trackingCode}</span>
                <span class="badge ${badgeClass}">${stageName}</span>
            </div>
            <div class="admin-order-details">
                <p>Cliente: <strong>${order.customerName}</strong></p>
                <p>E-mail: <strong>${order.customerEmail}</strong></p>
                <p>Destino: <strong>${order.destination}</strong></p>
                <p>Produtos: <strong>${order.products.join(", ")}</strong></p>
                <p style="font-size: 0.8rem; margin-top: 0.4rem; color: var(--text-muted);">
                    Último status: <em>"${order.history[0]?.title || 'Sem título'}"</em> - ${formatDate(order.updatedAt)}
                </p>
            </div>
            
            <div class="admin-order-status-selector">
                <span>Fase Rápida:</span>
                <select onchange="quickChangeStage('${order.trackingCode}', this.value)">
                    <option value="1" ${order.currentStage === 1 ? 'selected' : ''}>1. Aquisição</option>
                    <option value="2" ${order.currentStage === 2 ? 'selected' : ''}>2. Empacotamento</option>
                    <option value="3" ${order.currentStage === 3 ? 'selected' : ''}>3. Envio Angola</option>
                    <option value="4" ${order.currentStage === 4 ? 'selected' : ''}>4. Recepção</option>
                </select>
            </div>
            
            <div class="admin-actions-row">
                <button class="btn-small btn-small-accent" onclick="openEditModal('${order.trackingCode}')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                    Editar Info
                </button>
                <button class="btn-small btn-small-primary" onclick="openLogModal('${order.trackingCode}')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                    Fase & Notas
                </button>
                <button class="btn-small btn-small-danger" onclick="deleteOrder('${order.trackingCode}')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    Excluir
                </button>
            </div>
        `;
        adminOrdersList.appendChild(card);
    });
}

adminSearchInput.addEventListener("input", () => {
    // Buscar lista recém carregada sem fazer fetch redundante
    loadAdminDashboard();
});

// Cadastrar Encomenda no Admin
adminCreateForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const trackingCode = adminCodeInput.value.trim().toUpperCase();
    const customerName = adminClientInput.value.trim();
    const customerEmail = adminEmailInput.value.trim();
    const destination = adminDestinationInput.value.trim();
    const initialNote = adminInitialNoteInput.value.trim();
    const prodText = adminProductsInput.value.trim();
    
    fetchAdmin('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
            trackingCode,
            customerName,
            customerEmail,
            destination,
            products: prodText,
            initialNote
        })
    })
    .then(data => {
        if (data.success) {
            showToast("Encomenda cadastrada e e-mail disparado!", "success");
            adminCreateForm.reset();
            adminCodeInput.value = autoGenerateCode();
            loadAdminDashboard();
        } else {
            showToast(data.message || "Erro ao cadastrar encomenda.", "error");
        }
    })
    .catch(err => {
        console.error("Erro ao criar encomenda:", err);
        showToast("Erro de rede ao cadastrar.", "error");
    });
});

// Função para gerar código altamente aleatório
function autoGenerateCode() {
    const prefix = "XODO";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let part1 = "";
    let part2 = "";
    for (let i = 0; i < 4; i++) {
        part1 += chars.charAt(Math.floor(Math.random() * chars.length));
        part2 += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `${prefix}-${part1}-${part2}`;
}

// Gerador de códigos no painel
adminGenerateBtn.addEventListener("click", () => {
    const code = autoGenerateCode();
    adminCodeInput.value = code;
    showToast(`Código gerado: ${code}`, "info");
});

// Mudar fase diretamente pelo select rápido
window.quickChangeStage = function(code, newStageVal) {
    const stage = parseInt(newStageVal);
    let title = "";
    let description = "";
    
    switch(stage) {
        case 1: title = "Status alterado para Aquisição"; description = STAGE_METADATA[1].desc; break;
        case 2: title = "Status alterado para Empacotamento"; description = STAGE_METADATA[2].desc; break;
        case 3: title = "Status alterado para Envio para Angola"; description = STAGE_METADATA[3].desc; break;
        case 4: title = "Status alterado para Disponível em Angola"; description = STAGE_METADATA[4].desc; break;
    }
    
    fetchAdmin(`/api/orders/${code}`, {
        method: 'PUT',
        body: JSON.stringify({ stage, title, description })
    })
    .then(data => {
        if (data.success) {
            showToast("Encomenda atualizada e e-mail disparado!", "success");
            loadAdminDashboard();
        } else {
            showToast("Erro ao mudar fase da encomenda.", "error");
        }
    })
    .catch(err => {
        console.error("Erro ao atualizar status:", err);
        showToast("Erro de conexão.", "error");
    });
};

// Excluir encomenda
window.deleteOrder = function(code) {
    if (confirm(`Deseja excluir permanentemente a encomenda ${code}?`)) {
        fetchAdmin(`/api/orders/${code}`, {
            method: 'DELETE'
        })
        .then(data => {
            if (data.success) {
                showToast(`Encomenda ${code} excluída com sucesso.`, "info");
                loadAdminDashboard();
            } else {
                showToast("Erro ao excluir encomenda.", "error");
            }
        })
        .catch(err => {
            console.error("Erro ao excluir:", err);
        });
    }
};

// --- MODAIS (HISTÓRICO E EDIÇÃO CADASTRAL) ---

// Modal de Histórico/Logs
window.openLogModal = function(code) {
    fetch(`/api/orders/${code}`)
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            modalOrderCode.value = code;
            modalStageSelect.value = data.order.currentStage;
            modalLogTitle.value = "";
            modalLogDesc.value = "";
            logModal.classList.add("active");
        }
    });
};

function closeLogModal() {
    logModal.classList.remove("active");
}
modalCloseBtn.addEventListener("click", closeLogModal);
modalCancelBtn.addEventListener("click", closeLogModal);

modalLogForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const code = modalOrderCode.value;
    const stage = parseInt(modalStageSelect.value);
    const title = modalLogTitle.value.trim();
    const description = modalLogDesc.value.trim();
    
    fetchAdmin(`/api/orders/${code}`, {
        method: 'PUT',
        body: JSON.stringify({ stage, title, description })
    })
    .then(data => {
        if (data.success) {
            showToast("Fase atualizada e e-mail disparado!", "success");
            closeLogModal();
            loadAdminDashboard();
        } else {
            showToast("Erro ao registrar no histórico.", "error");
        }
    })
    .catch(err => {
        console.error("Erro ao registrar log:", err);
    });
});

// Modal de Edição de Info do Cliente
window.openEditModal = function(code) {
    fetch(`/api/orders/${code}`)
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            const order = data.order;
            editOrderCode.value = code;
            editClientInput.value = order.customerName;
            editEmailInput.value = order.customerEmail;
            editDestinationInput.value = order.destination;
            editProductsInput.value = order.products.join(", ");
            editModal.classList.add("active");
        }
    });
};

function closeEditModal() {
    editModal.classList.remove("active");
}
editModalCloseBtn.addEventListener("click", closeEditModal);
editModalCancelBtn.addEventListener("click", closeEditModal);

modalEditForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const code = editOrderCode.value;
    const customerName = editClientInput.value.trim();
    const customerEmail = editEmailInput.value.trim();
    const destination = editDestinationInput.value.trim();
    const products = editProductsInput.value.trim();
    
    fetchAdmin(`/api/orders/${code}/edit`, {
        method: 'PUT',
        body: JSON.stringify({ customerName, customerEmail, destination, products })
    })
    .then(data => {
        if (data.success) {
            showToast("Cadastro atualizado com sucesso!", "success");
            closeEditModal();
            loadAdminDashboard();
        } else {
            showToast("Erro ao editar dados cadastrais.", "error");
        }
    })
    .catch(err => {
        console.error("Erro de rede ao salvar cadastro:", err);
    });
});

// --- INICIALIZAÇÃO INICIAL & PARÂMETROS URL ---
document.addEventListener("DOMContentLoaded", () => {
    // 1. Validar parâmetro na URL
    const urlParams = new URLSearchParams(window.location.search);
    const urlCode = urlParams.get('code');
    
    if (urlCode) {
        // Efetuar fetch público para validar se existe
        fetch(`/api/orders/${urlCode.trim().toUpperCase()}`)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                // Auto-login de cliente
                sessionStorage.setItem("xodo_user_role", "client");
                sessionStorage.setItem("xodo_user_id", data.order.trackingCode);
                
                // Limpar URL query
                const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
                window.history.pushState({path:cleanUrl}, '', cleanUrl);
                
                window.location.hash = "#/rastreio";
                handleRouting();
            } else {
                window.location.hash = "#/login";
                handleRouting();
            }
        })
        .catch(() => {
            window.location.hash = "#/login";
            handleRouting();
        });
    } else {
        // Roteamento inicial padrão
        handleRouting();
    }
});
