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

// --- NOVOS ELEMENTOS DO MARKETPLACE E SACOLA ---

// Catálogo Vista Cliente
const catalogSection = document.getElementById("catalog-section");
const catalogGrid = document.getElementById("catalog-grid");
const catalogSearch = document.getElementById("catalog-search");
const btnGotoCatalog = document.getElementById("btn-goto-catalog");
const btnGotoTracking = document.getElementById("btn-goto-tracking");
const btnOpenCart = document.getElementById("btn-open-cart");
const cartBadgeCount = document.getElementById("cart-badge-count");
const gatewayCard = document.getElementById("gateway-card");

// Sacola/Carrinho Lateral
const cartDrawer = document.getElementById("cart-drawer");
const cartDrawerBackdrop = document.getElementById("cart-drawer-backdrop");
const cartItemsList = document.getElementById("cart-items-list");
const cartCheckoutSection = document.getElementById("cart-checkout-section");
const cartTotalValue = document.getElementById("cart-total-value");
const cartCheckoutForm = document.getElementById("cart-checkout-form");
const cartCustomerName = document.getElementById("cart-customer-name");
const cartCustomerEmail = document.getElementById("cart-customer-email");
const cartDestination = document.getElementById("cart-destination");
const cartNotes = document.getElementById("cart-notes");
const cartSuccessState = document.getElementById("cart-success-state");
const successProtocolCode = document.getElementById("success-protocol-code");

// Abas do Painel Administrativo
const adminPanelOrders = document.getElementById("admin-panel-orders");
const adminPanelProtocols = document.getElementById("admin-panel-protocols");
const adminPanelCatalog = document.getElementById("admin-panel-catalog");
const adminProtocolsBadge = document.getElementById("admin-protocols-badge");
const adminProtocolsList = document.getElementById("admin-protocols-list");
const adminProtocolsSearch = document.getElementById("admin-protocols-search");

// Gerenciamento de Peças do Catálogo (Admin)
const adminProductFormTitle = document.getElementById("admin-product-form-title");
const adminProductForm = document.getElementById("admin-product-form");
const adminProductId = document.getElementById("admin-product-id");
const adminProductName = document.getElementById("admin-product-name");
const adminProductDesc = document.getElementById("admin-product-desc");
const adminProductPriceBrl = document.getElementById("admin-product-price-brl");
const adminProductPriceAoa = document.getElementById("admin-product-price-aoa");
const adminProductImage = document.getElementById("admin-product-image");
const adminProductStore = document.getElementById("admin-product-store");
const adminProductStatus = document.getElementById("admin-product-status");
const adminProductLink = document.getElementById("admin-product-link");
const adminProductCancelBtn = document.getElementById("admin-product-cancel-btn");
const adminProductSubmitBtn = document.getElementById("admin-product-submit-btn");
const adminProductsList = document.getElementById("admin-products-list");
const adminProductSearch = document.getElementById("admin-product-search");

// Modal de Aprovação de Protocolo (Admin)
const approveProtocolModal = document.getElementById("approve-protocol-modal");
const approveProtocolForm = document.getElementById("approve-protocol-form");
const approveProtocolOldCode = document.getElementById("approve-protocol-old-code");
const approveProtocolDisplayCode = document.getElementById("approve-protocol-display-code");
const approveProtocolItemsList = document.getElementById("approve-protocol-items-list");
const approveProtocolNewCode = document.getElementById("approve-protocol-new-code");
const approveProtocolGenerateCodeBtn = document.getElementById("approve-protocol-generate-code-btn");
const approveProtocolNote = document.getElementById("approve-protocol-note");
const approveProtocolCloseBtn = document.getElementById("approve-protocol-close-btn");
const approveProtocolCancelBtn = document.getElementById("approve-protocol-cancel-btn");

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
            switchAdminTab('orders'); // Iniciar na aba de encomendas
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
            gatewayCard.style.display = "block";
            paneAdmin.classList.add("active");
            paneClient.classList.remove("active");
            catalogSection.style.display = "none";
            // Desativar botões do gateway
            btnGotoCatalog.classList.remove("active");
            btnGotoTracking.classList.remove("active");
        }
    }
    else { // #/login ou rota padrão
        if (role === "admin") {
            window.location.hash = "#/admin";
        } else if (role === "client" && userId) {
            window.location.hash = "#/rastreio";
        } else {
            viewGateway.classList.add("active");
            // Iniciar exibindo o catálogo por padrão
            switchGatewayView('catalog');
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

// ==========================================================================
// LÓGICA DO CLIENTE: CATÁLOGO DE PEÇAS & SACOLA DE COMPRAS
// ==========================================================================

let cart = [];

// Alternar entre abas do Gateway (Catálogo vs Rastreio)
window.switchGatewayView = function(view) {
    if (view === 'catalog') {
        btnGotoCatalog.classList.add("active");
        btnGotoTracking.classList.remove("active");
        catalogSection.style.display = "block";
        gatewayCard.style.display = "none";
        loadCatalog();
    } else {
        btnGotoCatalog.classList.remove("active");
        btnGotoTracking.classList.add("active");
        catalogSection.style.display = "none";
        gatewayCard.style.display = "block";
        paneClient.classList.add("active");
        paneAdmin.classList.remove("active");
        gatewayErrorBanner.style.display = "none";
    }
};

// Abrir/Fechar Sacola Lateral
window.toggleCartDrawer = function() {
    cartDrawer.classList.toggle("active");
    cartDrawerBackdrop.classList.toggle("active");
    if (cartDrawer.classList.contains("active")) {
        renderCart();
    }
};

// Carregar Produtos do Catálogo Público
let loadedProducts = [];
function loadCatalog() {
    catalogGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
            <p>Carregando peças exclusivas do Brasil...</p>
        </div>
    `;
    
    fetch('/api/products')
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            loadedProducts = data.products;
            renderCatalogGrid(loadedProducts);
        } else {
            showToast("Erro ao carregar peças do catálogo.", "error");
        }
    })
    .catch(err => {
        console.error("Erro ao carregar catálogo:", err);
        catalogGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--error);">
                <p>Falha ao conectar com o catálogo de produtos.</p>
            </div>
        `;
    });
}

// Renderizar Grade do Catálogo
function renderCatalogGrid(products) {
    catalogGrid.innerHTML = "";
    
    const filterQuery = catalogSearch.value.toLowerCase().trim();
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(filterQuery) || 
        (p.description && p.description.toLowerCase().includes(filterQuery)) ||
        (p.original_store && p.original_store.toLowerCase().includes(filterQuery))
    );
    
    if (filtered.length === 0) {
        catalogGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
                <p>Nenhum produto correspondente encontrado.</p>
            </div>
        `;
        return;
    }
    
    filtered.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";
        
        const isOutOfStock = product.status === "out_of_stock";
        const imgUrl = product.image_url || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=500&q=80";
        
        card.innerHTML = `
            <div class="product-image-container" style="background-image: url('${imgUrl}');">
                ${product.original_store ? `<span class="product-store-badge">${product.original_store}</span>` : ""}
                ${isOutOfStock ? `<span class="product-status-badge">Esgotado</span>` : ""}
            </div>
            <div class="product-card-body">
                <h3 class="product-card-title">${product.name}</h3>
                <p class="product-card-description">${product.description || "Sem descrição disponível."}</p>
                <div class="product-price-container">
                    <span class="product-price-aoa">${parseFloat(product.price_aoa).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</span>
                    <span class="product-price-brl">Origem: R$ ${parseFloat(product.price_brl).toFixed(2)} BRL</span>
                </div>
                
                ${product.original_link ? `
                    <a href="${product.original_link}" target="_blank" class="btn-glass" style="margin-bottom: 0.75rem; text-align: center; border-radius: 8px; font-size: 0.85rem; padding: 0.5rem; display: flex; align-items: center; justify-content: center; gap: 0.25rem;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                        Ver Loja Origem
                    </a>
                ` : ""}

                <button class="btn-primary" style="width: 100%; justify-content: center; border-radius: 8px;" 
                    onclick="addToCartById(${product.id})" ${isOutOfStock ? "disabled" : ""}>
                    Adicionar à Sacola
                </button>
            </div>
        `;
        catalogGrid.appendChild(card);
    });
}

// Filtro do Catálogo
catalogSearch.addEventListener("input", () => {
    renderCatalogGrid(loadedProducts);
});

// Adicionar Item à Sacola
window.addToCartById = function(productId) {
    const product = loadedProducts.find(p => p.id === productId);
    if (!product) return;
    
    // Verificar se já existe com mesmo tamanho/cor padrão na sacola
    const existing = cart.find(item => item.id === productId && item.size === "M" && item.color === "Cor padrão");
    if (existing) {
        existing.qty++;
        showToast(`Quantidade de ${product.name} atualizada na sacola!`, "info");
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price_aoa: product.price_aoa,
            image_url: product.image_url,
            size: "M",
            color: "Cor padrão",
            qty: 1
        });
        showToast(`${product.name} adicionado à sacola!`, "success");
    }
    
    saveCart();
    renderCart();
};

function saveCart() {
    localStorage.setItem("xodo_cart", JSON.stringify(cart));
}

function loadCart() {
    try {
        cart = JSON.parse(localStorage.getItem("xodo_cart") || "[]");
    } catch (e) {
        cart = [];
    }
}

// Renderizar Sacola/Carrinho
function renderCart() {
    cartItemsList.innerHTML = "";
    
    // Atualizar Badge de Quantidade
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    if (totalQty > 0) {
        cartBadgeCount.textContent = totalQty;
        cartBadgeCount.style.display = "inline-block";
    } else {
        cartBadgeCount.style.display = "none";
    }
    
    if (cart.length === 0) {
        cartItemsList.innerHTML = `
            <div class="cart-empty-state" style="text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
                <p>Sua sacola está vazia.</p>
            </div>
        `;
        cartCheckoutSection.style.display = "none";
        return;
    }
    
    let subtotal = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = parseFloat(item.price_aoa) * item.qty;
        subtotal += itemTotal;
        const imgUrl = item.image_url || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=500&q=80";
        
        const row = document.createElement("div");
        row.className = "cart-item";
        row.innerHTML = `
            <div class="cart-item-img" style="background-image: url('${imgUrl}');"></div>
            <div class="cart-item-details">
                <span class="cart-item-title">${item.name}</span>
                <span class="cart-item-price">${parseFloat(item.price_aoa).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</span>
                
                <div class="cart-item-selectors">
                    <select class="cart-item-size-select" onchange="updateCartItemSize(${index}, this.value)">
                        <option value="PP" ${item.size === "PP" ? "selected" : ""}>PP</option>
                        <option value="P" ${item.size === "P" ? "selected" : ""}>P</option>
                        <option value="M" ${item.size === "M" ? "selected" : ""}>M</option>
                        <option value="G" ${item.size === "G" ? "selected" : ""}>G</option>
                        <option value="GG" ${item.size === "GG" ? "selected" : ""}>GG</option>
                        <option value="XG" ${item.size === "XG" ? "selected" : ""}>XG</option>
                    </select>
                    <input type="text" class="cart-item-color-input" placeholder="Cor" value="${item.color}" onchange="updateCartItemColor(${index}, this.value)">
                </div>
                
                <div class="cart-item-qty-controls">
                    <button type="button" class="cart-item-qty-btn" onclick="updateCartItemQty(${index}, -1)">-</button>
                    <span style="font-size: 0.9rem; font-weight: 600; min-width: 20px; text-align: center;">${item.qty}</span>
                    <button type="button" class="cart-item-qty-btn" onclick="updateCartItemQty(${index}, 1)">+</button>
                </div>
            </div>
            <button type="button" class="cart-item-remove-btn" onclick="removeCartItem(${index})">&times;</button>
        `;
        cartItemsList.appendChild(row);
    });
    
    cartTotalValue.textContent = subtotal.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' });
    cartCheckoutSection.style.display = "block";
    cartSuccessState.style.display = "none";
}

// Funções de atualização da sacola
window.updateCartItemSize = function(index, value) {
    if (cart[index]) {
        cart[index].size = value;
        saveCart();
    }
};

window.updateCartItemColor = function(index, value) {
    if (cart[index]) {
        cart[index].color = value.trim() || "Cor padrão";
        saveCart();
    }
};

window.updateCartItemQty = function(index, change) {
    if (cart[index]) {
        cart[index].qty += change;
        if (cart[index].qty <= 0) {
            cart.splice(index, 1);
        }
        saveCart();
        renderCart();
    }
};

window.removeCartItem = function(index) {
    if (cart[index]) {
        showToast(`${cart[index].name} removido da sacola.`, "info");
        cart.splice(index, 1);
        saveCart();
        renderCart();
    }
};

// Checkout Submission (Geração do Protocolo)
cartCheckoutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const customerName = cartCustomerName.value.trim();
    const customerEmail = cartCustomerEmail.value.trim();
    const destination = cartDestination.value.trim();
    const notes = cartNotes.value.trim();
    
    // Formatar itens para o backend
    const productsArray = cart.map(item => `${item.name} [Tam: ${item.size}, Cor: ${item.color}] (${item.qty})`);
    const initialNote = notes || "Pedido de protocolo gerado na sacola do cliente.";
    
    fetch('/api/protocols', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            customerName,
            customerEmail,
            destination,
            products: productsArray,
            initialNote
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            // Mostrar tela de sucesso
            cartCheckoutSection.style.display = "none";
            cartItemsList.innerHTML = "";
            successProtocolCode.textContent = data.order.trackingCode;
            cartSuccessState.style.display = "block";
            
            // Limpar sacola
            cart = [];
            saveCart();
            renderCart();
            showToast("Protocolo gerado com sucesso!", "success");
        } else {
            showToast(data.message || "Erro ao processar o seu protocolo.", "error");
        }
    })
    .catch(err => {
        console.error("Erro no checkout:", err);
        showToast("Erro de rede ao enviar pedido.", "error");
    });
});

// Clipboard e Limpeza
window.copyProtocolToClipboard = function() {
    const code = successProtocolCode.textContent;
    navigator.clipboard.writeText(code)
    .then(() => showToast("Código copiado para a área de transferência!", "success"))
    .catch(() => showToast("Falha ao copiar código.", "error"));
};

window.closeSuccessAndReset = function() {
    cartSuccessState.style.display = "none";
    toggleCartDrawer();
    cartCheckoutForm.reset();
};

// ==========================================================================
// LÓGICA DO ADMINISTRADOR: GESTÃO DE CATÁLOGO & PROTOCOLOS
// ==========================================================================

// Alternar abas do painel admin
window.switchAdminTab = function(tab) {
    // Atualizar botões das abas
    document.querySelectorAll(".admin-navigation-tabs button").forEach(btn => {
        btn.classList.remove("active");
    });
    const activeBtn = document.getElementById(`admin-tab-${tab}-btn`);
    if (activeBtn) activeBtn.classList.add("active");
    
    // Ocultar todas as abas
    document.querySelectorAll(".admin-panel-tab-content").forEach(pane => {
        pane.style.display = "none";
    });
    
    // Exibir a aba ativa
    const activePane = document.getElementById(`admin-panel-${tab}`);
    if (activePane) activePane.style.display = "block";
    
    // Carregar os dados correspondentes
    if (tab === 'orders') {
        loadAdminDashboard();
    } else if (tab === 'protocols') {
        loadAdminProtocols();
    } else if (tab === 'catalog') {
        loadAdminCatalog();
    }
};

// --- ABA 2: PROTOCOLOS DE COMPRA (STAGE 0) ---
let loadedProtocols = [];
function loadAdminProtocols() {
    adminProtocolsList.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
            <p>Buscando protocolos de clientes...</p>
        </div>
    `;
    
    fetchAdmin('/api/orders')
    .then(data => {
        if (data.success) {
            // Filtrar ordens na Fase 0
            loadedProtocols = data.orders.filter(o => o.currentStage === 0);
            
            // Atualizar o badge indicador na aba admin
            if (loadedProtocols.length > 0) {
                adminProtocolsBadge.textContent = loadedProtocols.length;
                adminProtocolsBadge.style.display = "inline-block";
            } else {
                adminProtocolsBadge.style.display = "none";
            }
            
            renderAdminProtocols(loadedProtocols);
        }
    })
    .catch(err => {
        console.error("Erro ao carregar protocolos no admin:", err);
    });
}

function renderAdminProtocols(protocols) {
    adminProtocolsList.innerHTML = "";
    
    const searchVal = adminProtocolsSearch.value.toLowerCase().trim();
    const filtered = protocols.filter(p => 
        p.trackingCode.toLowerCase().includes(searchVal) ||
        p.customerName.toLowerCase().includes(searchVal) ||
        p.customerEmail.toLowerCase().includes(searchVal)
    );
    
    if (filtered.length === 0) {
        adminProtocolsList.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
                <p>Nenhum protocolo pendente de processamento.</p>
            </div>
        `;
        return;
    }
    
    filtered.forEach(proto => {
        const card = document.createElement("div");
        card.className = "admin-order-card";
        card.innerHTML = `
            <div class="admin-order-top">
                <span class="admin-order-code" style="color: var(--accent-gold);">${proto.trackingCode}</span>
                <span class="badge" style="background: rgba(229,169,60,0.15); color: var(--accent-gold); border: 1px solid var(--accent-gold);">Fase 0: Protocolo</span>
            </div>
            <div class="admin-order-details">
                <p>Cliente: <strong>${proto.customerName}</strong></p>
                <p>E-mail: <strong>${proto.customerEmail}</strong></p>
                <p>Destino: <strong>${proto.destination}</strong></p>
                <p style="margin-top: 0.5rem; color: var(--accent-gold); font-weight: bold;">Ítens Pedidos:</p>
                <ul style="padding-left: 1.25rem; font-size: 0.85rem; color: var(--text-main); margin-bottom: 0.5rem;">
                    ${proto.products.map(p => `<li>${p}</li>`).join("")}
                </ul>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.4rem;">
                    Criado: <em>${formatDate(proto.createdAt)}</em>
                </p>
            </div>
            <div class="admin-actions-row" style="margin-top: 1rem;">
                <button class="btn-small btn-small-primary" style="flex: 2;" onclick="openApproveProtocolModal('${proto.trackingCode}')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    Aprovar & Iniciar Rastreio
                </button>
                <button class="btn-small btn-small-danger" style="flex: 1;" onclick="deleteOrder('${proto.trackingCode}')">
                    Excluir
                </button>
            </div>
        `;
        adminProtocolsList.appendChild(card);
    });
}

adminProtocolsSearch.addEventListener("input", () => {
    renderAdminProtocols(loadedProtocols);
});

// Fluxo de aprovação do protocolo (Passagem de Fase 0 para Fase 1)
window.openApproveProtocolModal = function(code) {
    const proto = loadedProtocols.find(o => o.trackingCode === code);
    if (!proto) return;
    
    approveProtocolOldCode.value = code;
    approveProtocolDisplayCode.value = code;
    
    // Renderizar lista de itens
    approveProtocolItemsList.innerHTML = "";
    proto.products.forEach(item => {
        const li = document.createElement("div");
        li.textContent = `• ${item}`;
        approveProtocolItemsList.appendChild(li);
    });
    
    // Sugerir código de rastreamento real
    approveProtocolNewCode.value = autoGenerateCode();
    approveProtocolNote.value = "Compra realizada no Brasil. Os produtos foram despachados para o nosso centro de empacotamento, iniciando a fase de preparação.";
    
    approveProtocolModal.classList.add("active");
};

function closeApproveProtocolModal() {
    approveProtocolModal.classList.remove("active");
    approveProtocolForm.reset();
}
approveProtocolCloseBtn.addEventListener("click", closeApproveProtocolModal);
approveProtocolCancelBtn.addEventListener("click", closeApproveProtocolModal);

approveProtocolGenerateCodeBtn.addEventListener("click", () => {
    approveProtocolNewCode.value = autoGenerateCode();
});

// Ação de aprovar
approveProtocolForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const oldCode = approveProtocolOldCode.value;
    const newCode = approveProtocolNewCode.value.trim().toUpperCase();
    const note = approveProtocolNote.value.trim();
    
    const proto = loadedProtocols.find(o => o.trackingCode === oldCode);
    if (!proto) return;
    
    // 1. Cadastrar encomenda real na Fase 1 (Aquisição)
    fetchAdmin('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
            trackingCode: newCode,
            customerName: proto.customerName,
            customerEmail: proto.customerEmail,
            destination: proto.destination,
            products: proto.products.join(", "),
            initialNote: note
        })
    })
    .then(resCreate => {
        if (resCreate.success) {
            // 2. Excluir o protocolo antigo Fase 0
            fetchAdmin(`/api/orders/${oldCode}`, {
                method: 'DELETE'
            })
            .then(resDelete => {
                showToast("Protocolo aprovado e rastreamento oficial iniciado!", "success");
                closeApproveProtocolModal();
                loadAdminProtocols();
            })
            .catch(err => {
                console.error("Erro ao deletar protocolo antigo:", err);
                showToast("Novo rastreamento criado, mas falhou em limpar protocolo Fase 0.", "warning");
                closeApproveProtocolModal();
                loadAdminProtocols();
            });
        } else {
            showToast(resCreate.message || "Erro ao aprovar e gerar rastreamento.", "error");
        }
    })
    .catch(err => {
        console.error("Erro ao aprovar protocolo:", err);
        showToast("Erro ao conectar no servidor.", "error");
    });
});

// --- ABA 3: GERENCIAR CATÁLOGO DE PEÇAS ---
let loadedAdminCatalog = [];
function loadAdminCatalog() {
    adminProductsList.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
            <p>Carregando peças do catálogo...</p>
        </div>
    `;
    
    fetch('/api/products')
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            loadedAdminCatalog = data.products;
            renderAdminCatalogList(loadedAdminCatalog);
        }
    })
    .catch(err => {
        console.error("Erro ao listar catálogo admin:", err);
    });
}

function renderAdminCatalogList(products) {
    adminProductsList.innerHTML = "";
    
    const searchVal = adminProductSearch.value.toLowerCase().trim();
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(searchVal) ||
        (p.original_store && p.original_store.toLowerCase().includes(searchVal))
    );
    
    if (filtered.length === 0) {
        adminProductsList.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
                <p>Nenhum produto correspondente cadastrado.</p>
            </div>
        `;
        return;
    }
    
    filtered.forEach(p => {
        const item = document.createElement("div");
        item.className = "product-list-item";
        
        const isOutOfStock = p.status === "out_of_stock";
        const imgUrl = p.image_url || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=500&q=80";
        
        item.innerHTML = `
            <div class="product-list-item-img" style="background-image: url('${imgUrl}');"></div>
            <div class="product-list-item-details">
                <span class="product-list-item-name" style="${isOutOfStock ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${p.name}</span>
                <div class="product-list-item-prices">
                    <span style="color: var(--accent-gold); font-weight: 600;">Kz ${parseFloat(p.price_aoa).toLocaleString('pt-AO')} AOA</span>
                    <span style="margin-left: 0.5rem; opacity: 0.8;">| R$ ${parseFloat(p.price_brl).toFixed(2)} BRL</span>
                    ${p.original_store ? `<span style="margin-left: 0.5rem; color: var(--primary);">[${p.original_store}]</span>` : ""}
                </div>
            </div>
            <div class="product-list-item-actions">
                <button class="btn-small btn-small-accent" style="padding: 0.35rem 0.6rem;" onclick="editProduct(${p.id})">Editar</button>
                <button class="btn-small btn-small-danger" style="padding: 0.35rem 0.6rem;" onclick="deleteProduct(${p.id})">Excluir</button>
            </div>
        `;
        adminProductsList.appendChild(item);
    });
}

adminProductSearch.addEventListener("input", () => {
    renderAdminCatalogList(loadedAdminCatalog);
});

// Cadastrar/Editar Produto no Catálogo
adminProductForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const productId = adminProductId.value;
    const name = adminProductName.value.trim();
    const description = adminProductDesc.value.trim();
    const priceBrl = adminProductPriceBrl.value;
    const priceAoa = adminProductPriceAoa.value;
    const imageUrl = adminProductImage.value.trim();
    const originalStore = adminProductStore.value.trim();
    const originalLink = adminProductLink.value.trim();
    const status = adminProductStatus.value;
    
    const isEdit = !!productId;
    const url = isEdit ? `/api/products/${productId}` : '/api/products';
    const method = isEdit ? 'PUT' : 'POST';
    
    fetchAdmin(url, {
        method,
        body: JSON.stringify({
            name,
            description,
            priceBrl,
            priceAoa,
            imageUrl,
            originalStore,
            originalLink,
            status
        })
    })
    .then(data => {
        if (data.success) {
            showToast(isEdit ? "Produto editado com sucesso!" : "Produto cadastrado no catálogo!", "success");
            resetProductForm();
            loadAdminCatalog();
        } else {
            showToast(data.message || "Erro ao gravar produto.", "error");
        }
    })
    .catch(err => {
        console.error("Erro ao enviar produto:", err);
        showToast("Erro de conexão.", "error");
    });
});

window.editProduct = function(id) {
    const p = loadedAdminCatalog.find(prod => prod.id === id);
    if (!p) return;
    
    adminProductId.value = p.id;
    adminProductName.value = p.name;
    adminProductDesc.value = p.description || "";
    adminProductPriceBrl.value = p.price_brl;
    adminProductPriceAoa.value = p.price_aoa;
    adminProductImage.value = p.image_url || "";
    adminProductStore.value = p.original_store || "";
    adminProductLink.value = p.original_link || "";
    adminProductStatus.value = p.status || "available";
    
    adminProductFormTitle.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
        Editar Produto
    `;
    adminProductSubmitBtn.textContent = "Salvar Alterações";
    adminProductCancelBtn.style.display = "flex";
};

window.deleteProduct = function(id) {
    if (confirm("Deseja realmente excluir este produto do catálogo?")) {
        fetchAdmin(`/api/products/${id}`, {
            method: 'DELETE'
        })
        .then(data => {
            if (data.success) {
                showToast("Produto removido do catálogo com sucesso.", "info");
                loadAdminCatalog();
            } else {
                showToast("Erro ao remover produto.", "error");
            }
        })
        .catch(err => {
            console.error("Erro ao excluir produto:", err);
        });
    }
};

function resetProductForm() {
    adminProductForm.reset();
    adminProductId.value = "";
    adminProductFormTitle.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        Adicionar Produto ao Catálogo
    `;
    adminProductSubmitBtn.textContent = "Adicionar Produto";
    adminProductCancelBtn.style.display = "none";
}
adminProductCancelBtn.addEventListener("click", resetProductForm);

// ==========================================================================
// INICIALIZAÇÃO E INTEGRAÇÃO DE COMPRA/RASTREIO
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    // Carregar sacola local
    loadCart();
    
    // 1. Validar parâmetro de rastreio automático na URL
    const urlParams = new URLSearchParams(window.location.search);
    const urlCode = urlParams.get('code');
    
    if (urlCode) {
        fetch(`/api/orders/${urlCode.trim().toUpperCase()}`)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                sessionStorage.setItem("xodo_user_role", "client");
                sessionStorage.setItem("xodo_user_id", data.order.trackingCode);
                
                // Limpar URL query para limpeza visual
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
        handleRouting();
    }
    
    // Pré-buscar quantidade de protocolos no background para atualizar badge na navegação se for admin
    const role = sessionStorage.getItem("xodo_user_role");
    if (role === "admin") {
        fetchAdmin('/api/orders')
        .then(data => {
            if (data.success) {
                const count = data.orders.filter(o => o.currentStage === 0).length;
                if (count > 0) {
                    adminProtocolsBadge.textContent = count;
                    adminProtocolsBadge.style.display = "inline-block";
                }
            }
        })
        .catch(() => {});
    }
});


