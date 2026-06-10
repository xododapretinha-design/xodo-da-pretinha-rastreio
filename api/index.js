// SISTEMA DE RASTREIO - XODÓ DA PRETINHA
// api/index.js (Express Backend Server - Full-Stack Cloud com Supabase para Vercel Serverless)

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Resend } = require('resend');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.static(process.cwd()));

// Segredos e credenciais padrão
const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "adminxodo";
const JWT_SECRET = process.env.JWT_SECRET || "xodo_pretinha_secret_2026";
const DATA_FILE = path.join(process.cwd(), 'data', 'orders.json');
const PRODUCTS_FILE = path.join(process.cwd(), 'data', 'products.json');

// --- CONEXÃO COM SUPABASE ---
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
let supabase = null;

if (supabaseUrl && supabaseKey && !supabaseUrl.includes('your-project-url') && !supabaseKey.includes('your-anon-key')) {
    try {
        supabase = createClient(supabaseUrl, supabaseKey);
        console.log("🟢 Conexão com o Supabase Cloud estabelecida com sucesso.");
    } catch (e) {
        console.error("🔴 Falha ao inicializar o cliente do Supabase:", e.message);
    }
} else {
    console.log("⚠️ Supabase desativado ou com credenciais fictícias no .env.");
    console.log("⚠️ O servidor usará o banco de dados em arquivo local / em memória como contingência.");
}

// --- DADOS SEMENTES (Contingência e Inicialização) ---
const SEED_ORDERS = [
    {
        trackingCode: "XODO-PT-101",
        customerName: "Maria Silva",
        customerEmail: "maria@exemplo.com",
        destination: "Luanda, Angola",
        products: ["Vestido Pretinha Glow (1)", "Brincos Afroroot (2)", "Acessório Turbante Seda (1)"],
        currentStage: 3,
        createdAt: "2026-06-01T10:30:00Z",
        updatedAt: "2026-06-08T09:00:00Z",
        history: [
            { stage: 3, title: "Despachado para Luanda", description: "A carga foi colocada em trânsito aéreo pelo voo DT-652 da TAAG com destino ao Aeroporto 4 de Fevereiro em Luanda.", timestamp: "2026-06-08T09:00:00Z" },
            { stage: 2, title: "Empacotamento Concluído", description: "Sua encomenda foi embalada com amor e selada com a nossa fragrância premium Pretinha.", timestamp: "2026-06-03T14:15:00Z" },
            { stage: 1, title: "Aquisição e Verificação", description: "Produtos adquiridos dos fornecedores selecionados e encaminhados para empacotamento.", timestamp: "2026-06-01T10:30:00Z" }
        ]
    },
    {
        trackingCode: "XODO-PT-102",
        customerName: "Anacleto Neto",
        customerEmail: "anacleto@exemplo.com",
        destination: "Benguela, Angola",
        products: ["Camisa Afro-Fashion Masculina (1)", "Sandálias de Couro Pretinha (1)"],
        currentStage: 1,
        createdAt: "2026-06-09T08:30:00Z",
        updatedAt: "2026-06-09T08:30:00Z",
        history: [
            { stage: 1, title: "Aquisição Iniciada", description: "Os itens foram selecionados e estamos aguardando a chegada no armazém central.", timestamp: "2026-06-09T08:30:00Z" }
        ]
    }
];

// Banco de dados em memória local (para fallback offline)
let localOrdersInMemory = [];
function loadLocalOrders() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            localOrdersInMemory = JSON.parse(data);
        } else {
            const dir = path.dirname(DATA_FILE);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(DATA_FILE, JSON.stringify(SEED_ORDERS, null, 2));
            localOrdersInMemory = [...SEED_ORDERS];
        }
    } catch (e) {
        localOrdersInMemory = [...SEED_ORDERS];
    }
}
loadLocalOrders();

function saveLocalOrders() {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(localOrdersInMemory, null, 2), 'utf8');
    } catch (e) {
        console.error("Falha ao salvar dados de contingência locais:", e);
    }
}

let localProductsInMemory = [];
function loadLocalProducts() {
    try {
        if (fs.existsSync(PRODUCTS_FILE)) {
            const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
            localProductsInMemory = JSON.parse(data);
        } else {
            const dir = path.dirname(PRODUCTS_FILE);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(PRODUCTS_FILE, JSON.stringify([], null, 2));
            localProductsInMemory = [];
        }
    } catch (e) {
        localProductsInMemory = [];
    }
}
loadLocalProducts();

function saveLocalProducts() {
    try {
        fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(localProductsInMemory, null, 2), 'utf8');
    } catch (e) {
        console.error("Falha ao salvar produtos locais:", e);
    }
}

// --- DICIONÁRIOS E MAPADORES DE DADOS (SNAKE_CASE <-> CAMELCASE) ---
const STAGE_NAMES = {
    0: "Protocolo de Compra Solicitado",
    1: "Aquisição do Produto",
    2: "Empacotamento",
    3: "Envio para Angola",
    4: "Recepção / Disponível para Retirada"
};

const STAGE_EMOJIS = {
    0: "📝",
    1: "📦",
    2: "🏷️",
    3: "✈️",
    4: "🤝"
};

// Mapear dados para o Supabase (snake_case)
function toDb(order) {
    return {
        tracking_code: order.trackingCode.toUpperCase(),
        customer_name: order.customerName,
        customer_email: order.customerEmail,
        destination: order.destination,
        products: order.products,
        current_stage: parseInt(order.currentStage),
        created_at: order.createdAt,
        updated_at: order.updatedAt,
        history: order.history
    };
}

// Mapear dados vindo do Supabase para o Frontend (camelCase)
function fromDb(row) {
    if (!row) return null;
    return {
        trackingCode: row.tracking_code,
        customerName: row.customer_name,
        customerEmail: row.customer_email,
        destination: row.destination,
        products: Array.isArray(row.products) ? row.products : JSON.parse(row.products || '[]'),
        currentStage: parseInt(row.current_stage),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        history: Array.isArray(row.history) ? row.history : JSON.parse(row.history || '[]')
    };
}

// --- SEGURANÇA E TOKENS (LIGHTWEIGHT CRYPTO SIGNATURE) ---
function signToken(payload) {
    const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString('base64url');
    const body = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 1000 * 60 * 60 * 24 })).toString('base64url');
    
    const signature = crypto.createHmac('sha256', JWT_SECRET)
                            .update(`${header}.${body}`)
                            .digest('base64url');
                            
    return `${header}.${body}.${signature}`;
}

function verifyToken(token) {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const [header, body, signature] = parts;
    const expectedSignature = crypto.createHmac('sha256', JWT_SECRET)
                                    .update(`${header}.${body}`)
                                    .digest('base64url');
                                    
    if (signature !== expectedSignature) return null;
    
    try {
        const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
        if (payload.exp < Date.now()) return null;
        return payload;
    } catch (e) {
        return null;
    }
}

function requireAdmin(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: "Cabeçalho de autorização inválido ou ausente." });
    }
    
    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    
    if (payload && payload.role === 'admin') {
        req.user = payload;
        next();
    } else {
        res.status(401).json({ success: false, message: "Acesso negado. Apenas administradores autorizados." });
    }
}

// --- FUNÇÃO DE ENVIO DE E-MAIL (RESEND) ---
async function triggerResendEmail(order) {
    const currentStage = order.currentStage;
    const stageName = STAGE_NAMES[currentStage] || "Status Atualizado";
    const stageEmoji = STAGE_EMOJIS[currentStage] || "✨";
    const latestEvent = order.history && order.history.length > 0 ? order.history[0] : null;
    const eventDescription = latestEvent ? latestEvent.description : "Sua encomenda está avançando em nosso fluxo de entrega.";
    const eventTitle = latestEvent ? latestEvent.title : stageName;

    const trackingLink = `https://${process.env.VERCEL_URL || 'localhost:8080'}/#/rastreio?code=${order.trackingCode}`;

    let emailHtml = "";
    let templateName = "";
    switch(currentStage) {
        case 0: templateName = "0_protocol.html"; break;
        case 1: templateName = "1_acquisition.html"; break;
        case 2: templateName = "2_packaging.html"; break;
        case 3: templateName = "3_shipping.html"; break;
        case 4: templateName = "4_reception.html"; break;
        default: templateName = "0_protocol.html";
    }
    
    const templatePath = path.join(process.cwd(), 'templates', templateName);
    
    try {
        if (fs.existsSync(templatePath)) {
            let templateContent = fs.readFileSync(templatePath, 'utf8');
            const productsHtml = order.products.map(p => `<li><strong>${p}</strong></li>`).join('\n');
            
            emailHtml = templateContent
                .replace(/{{customerName}}/g, order.customerName)
                .replace(/{{trackingCode}}/g, order.trackingCode)
                .replace(/{{destination}}/g, order.destination)
                .replace(/{{products}}/g, productsHtml)
                .replace(/{{latestNote}}/g, eventDescription)
                .replace(/{{date}}/g, new Date().toLocaleDateString('pt-BR'))
                .replace(/{{trackingLink}}/g, trackingLink);
        } else {
            throw new Error("Template não encontrado.");
        }
    } catch (e) {
        console.warn(`[Aviso] Falha ao carregar template ${templateName}: ${e.message}. Usando fallback embutido.`);
        emailHtml = `
        <html>
        <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f6f3f9; color: #2e2438; margin: 0; padding: 30px 15px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid rgba(255, 71, 126, 0.15); border-radius: 16px; padding: 30px; box-shadow: 0 8px 30px rgba(138, 63, 252, 0.06);">
                <h2 style="font-family: 'Georgia', serif; color: #ff477e; margin-top: 0; border-bottom: 1px solid rgba(255, 71, 126, 0.1); padding-bottom: 10px;">Xodó da Pretinha</h2>
                <p style="font-size: 16px; line-height: 1.6;">Olá, <strong>${order.customerName}</strong>!</p>
                <p style="font-size: 15px; line-height: 1.6;">Sua encomenda <strong>${order.trackingCode}</strong> avançou para a fase: <strong style="color: #8a3ffc;">${stageEmoji} ${stageName}</strong></p>
                <div style="background: #faf7fd; border-left: 4px solid #ff477e; padding: 15px; margin: 20px 0; border-radius: 4px;">
                    <strong style="color: #2e2438; display: block; margin-bottom: 5px;">${eventTitle}</strong>
                    <span style="color: #524366; font-size: 14px; line-height: 1.5;">${eventDescription}</span>
                </div>
                <p style="margin-top: 25px;"><a href="${trackingLink}" style="display: inline-block; background: linear-gradient(135deg, #ff477e 0%, #8a3ffc 100%); color: #ffffff !important; text-decoration: none; padding: 12px 25px; border-radius: 6px; font-weight: bold; font-size: 15px;">Acompanhar Encomenda Online</a></p>
                <hr style="border: 0; border-top: 1px solid rgba(0,0,0,0.05); margin: 30px 0 15px;">
                <p style="font-size: 11px; color: #7a6b8f; text-align: center; margin: 0;">&copy; 2026 Xodó da Pretinha. Todos os direitos reservados.</p>
            </div>
        </body>
        </html>
        `;
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const emailFrom = process.env.EMAIL_FROM || 'Xodó da Pretinha <onboarding@resend.dev>';
    const gmailUser = process.env.GMAIL_USER;
    const gmailAppPass = process.env.GMAIL_APP_PASS;

    // Método 1: Envio por Gmail SMTP (Ideal para desenvolvimento sem domínio próprio)
    if (gmailUser && gmailAppPass) {
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: gmailUser,
                    pass: gmailAppPass
                }
            });

            await transporter.sendMail({
                from: `"Xodó da Pretinha" <${gmailUser}>`,
                to: order.customerEmail,
                subject: `Xodó da Pretinha - Atualização [Código: ${order.trackingCode}]`,
                html: emailHtml,
            });

            console.log(`🟢 E-mail enviado com sucesso via Gmail SMTP para ${order.customerEmail}`);
            return { success: true, method: 'gmail' };
        } catch (err) {
            console.error("[Gmail SMTP Error]:", err);
            return { success: false, error: err.message };
        }
    } 
    // Método 2: Envio por Resend SDK (Ideal para produção com domínio próprio verificado)
    else if (resendApiKey && resendApiKey.startsWith('re_') && !resendApiKey.includes('your-api-key')) {
        try {
            const resend = new Resend(resendApiKey);
            const { data, error } = await resend.emails.send({
                from: emailFrom,
                to: order.customerEmail,
                subject: `Xodó da Pretinha - Atualização [Código: ${order.trackingCode}]`,
                html: emailHtml,
            });

            if (error) {
                console.error("[Resend Error]:", error);
                return { success: false, error };
            }
            return { success: true, id: data.id };
        } catch (err) {
            console.error("[Resend SDK Exception]:", err);
            return { success: false, error: err.message };
        }
    } 
    // Fallback: Simulador local no console
    else {
        console.log("\n========================================================");
        console.log(`[MOCK EMAIL SENT] Destinatário: ${order.customerName} <${order.customerEmail}>`);
        console.log(`Assunto: Xodó da Pretinha - Atualização [Código: ${order.trackingCode}]`);
        console.log(`Status: ${stageEmoji} ${stageName}`);
        console.log(`Descrição: ${eventTitle} - ${eventDescription}`);
        console.log("========================================================\n");
        return { success: true, simulated: true };
    }
}

// --- ROTAS DA API ---

// 1. Rota de Login (Admin e Cliente)
app.post('/api/login', async (req, res) => {
    const { username, password, trackingCode } = req.body;
    
    // Login Admin
    if (username && password) {
        if (username === ADMIN_USER && password === ADMIN_PASSWORD) {
            const token = signToken({ role: "admin", user: username });
            return res.status(200).json({ success: true, role: "admin", token });
        } else {
            return res.status(401).json({ success: false, message: "Usuário ou senha administrativos incorretos." });
        }
    }
    
    // Login Cliente
    if (trackingCode) {
        const queryCode = trackingCode.trim().toUpperCase();
        let order = null;
        
        if (supabase) {
            const { data, error } = await supabase.from('orders').select('*').eq('tracking_code', queryCode).maybeSingle();
            if (data) order = fromDb(data);
        } else {
            const found = localOrdersInMemory.find(o => o.trackingCode.toUpperCase() === queryCode);
            if (found) order = found;
        }
        
        if (order) {
            const token = signToken({ role: "client", id: order.trackingCode });
            return res.status(200).json({ success: true, role: "client", token, order });
        } else {
            return res.status(404).json({ success: false, message: "Código de rastreamento não encontrado." });
        }
    }
    
    return res.status(400).json({ success: false, message: "Forneça credenciais de admin ou código de cliente." });
});

// 2. Buscar todas as encomendas (Apenas Admin)
app.get('/api/orders', requireAdmin, async (req, res) => {
    let ordersList = [];
    
    if (supabase) {
        const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (data) ordersList = data.map(fromDb);
    } else {
        ordersList = localOrdersInMemory;
    }
    
    res.status(200).json({ success: true, orders: ordersList });
});

// 3. Buscar uma única encomenda para rastreio público
app.get('/api/orders/:code', async (req, res) => {
    const code = req.params.code.toUpperCase();
    let order = null;
    
    if (supabase) {
        const { data, error } = await supabase.from('orders').select('*').eq('tracking_code', code).maybeSingle();
        if (data) order = fromDb(data);
    } else {
        order = localOrdersInMemory.find(o => o.trackingCode.toUpperCase() === code);
    }
    
    if (order) {
        res.status(200).json({ success: true, order });
    } else {
        res.status(404).json({ success: false, message: "Encomenda não encontrada." });
    }
});

// 4. Cadastrar nova encomenda (Apenas Admin)
app.post('/api/orders', requireAdmin, async (req, res) => {
    const { trackingCode, customerName, customerEmail, destination, products, initialNote } = req.body;
    const cleanCode = trackingCode.trim().toUpperCase();
    
    if (!trackingCode || !customerName || !customerEmail || !destination || !products || !initialNote) {
        return res.status(400).json({ success: false, message: "Preencha todos os campos obrigatórios." });
    }
    
    // Verificar duplicidade
    let exists = false;
    if (supabase) {
        const { data } = await supabase.from('orders').select('tracking_code').eq('tracking_code', cleanCode).maybeSingle();
        if (data) exists = true;
    } else {
        exists = localOrdersInMemory.some(o => o.trackingCode.toUpperCase() === cleanCode);
    }
    
    if (exists) {
        return res.status(409).json({ success: false, message: "Código de rastreio já cadastrado." });
    }
    
    const nowISO = new Date().toISOString();
    const newOrder = {
        trackingCode: cleanCode,
        customerName,
        customerEmail,
        destination,
        products: Array.isArray(products) ? products : products.split(',').map(p => p.trim()).filter(p => p !== ""),
        currentStage: 1,
        createdAt: nowISO,
        updatedAt: nowISO,
        history: [
            { stage: 1, title: "Encomenda Cadastrada", description: initialNote, timestamp: nowISO }
        ]
    };
    
    if (supabase) {
        const { error } = await supabase.from('orders').insert([toDb(newOrder)]);
        if (error) {
            console.error("Erro ao inserir no Supabase:", error);
            return res.status(500).json({ success: false, message: "Erro ao gravar no Supabase.", error });
        }
    } else {
        localOrdersInMemory.unshift(newOrder);
        saveLocalOrders();
    }
    
    const emailResult = await triggerResendEmail(newOrder);
    
    res.status(201).json({ success: true, order: newOrder, emailNotification: emailResult });
});

// 5. Atualizar estágio e histórico da encomenda (Apenas Admin)
app.put('/api/orders/:code', requireAdmin, async (req, res) => {
    const code = req.params.code.toUpperCase();
    const { stage, title, description } = req.body;
    
    if (!stage || !title || !description) {
        return res.status(400).json({ success: false, message: "Parâmetros stage, title e description são obrigatórios." });
    }
    
    let order = null;
    const nowISO = new Date().toISOString();
    
    if (supabase) {
        const { data } = await supabase.from('orders').select('*').eq('tracking_code', code).maybeSingle();
        if (data) order = fromDb(data);
    } else {
        order = localOrdersInMemory.find(o => o.trackingCode.toUpperCase() === code);
    }
    
    if (!order) {
        return res.status(404).json({ success: false, message: "Encomenda não encontrada." });
    }
    
    order.currentStage = parseInt(stage);
    order.updatedAt = nowISO;
    order.history.unshift({
        stage: parseInt(stage),
        title,
        description,
        timestamp: nowISO
    });
    
    if (supabase) {
        const { error } = await supabase.from('orders').update(toDb(order)).eq('tracking_code', code);
        if (error) {
            console.error("Erro ao atualizar no Supabase:", error);
            return res.status(500).json({ success: false, message: "Erro ao salvar atualização no banco." });
        }
    } else {
        saveLocalOrders();
    }
    
    const emailResult = await triggerResendEmail(order);
    
    res.status(200).json({ success: true, order, emailNotification: emailResult });
});

// 6. Editar detalhes cadastrais (Apenas Admin)
app.put('/api/orders/:code/edit', requireAdmin, async (req, res) => {
    const code = req.params.code.toUpperCase();
    const { customerName, customerEmail, destination, products } = req.body;
    
    let order = null;
    const nowISO = new Date().toISOString();
    
    if (supabase) {
        const { data } = await supabase.from('orders').select('*').eq('tracking_code', code).maybeSingle();
        if (data) order = fromDb(data);
    } else {
        order = localOrdersInMemory.find(o => o.trackingCode.toUpperCase() === code);
    }
    
    if (!order) {
        return res.status(404).json({ success: false, message: "Encomenda não encontrada." });
    }
    
    order.customerName = customerName || order.customerName;
    order.customerEmail = customerEmail || order.customerEmail;
    order.destination = destination || order.destination;
    if (products) {
        order.products = Array.isArray(products) ? products : products.split(',').map(p => p.trim()).filter(p => p !== "");
    }
    order.updatedAt = nowISO;
    order.history.unshift({
        stage: order.currentStage,
        title: "Dados Cadastrais Modificados",
        description: "Informações cadastrais da encomenda foram atualizadas no sistema pelo administrador.",
        timestamp: nowISO
    });
    
    if (supabase) {
        const { error } = await supabase.from('orders').update(toDb(order)).eq('tracking_code', code);
        if (error) {
            console.error("Erro ao editar no Supabase:", error);
            return res.status(500).json({ success: false, message: "Erro ao gravar dados no banco." });
        }
    } else {
        saveLocalOrders();
    }
    
    res.status(200).json({ success: true, order });
});

// 7. Excluir encomenda (Apenas Admin)
app.delete('/api/orders/:code', requireAdmin, async (req, res) => {
    const code = req.params.code.toUpperCase();
    let deleted = false;
    
    if (supabase) {
        const { error } = await supabase.from('orders').delete().eq('tracking_code', code);
        if (!error) deleted = true;
    } else {
        const lenBefore = localOrdersInMemory.length;
        localOrdersInMemory = localOrdersInMemory.filter(o => o.trackingCode.toUpperCase() !== code);
        if (localOrdersInMemory.length < lenBefore) {
            saveLocalOrders();
            deleted = true;
        }
    }
    
    if (deleted) {
        res.status(200).json({ success: true, message: `Encomenda ${code} excluída com sucesso.` });
    } else {
        res.status(404).json({ success: false, message: "Encomenda não encontrada ou erro ao excluir." });
    }
});

// --- NOVAS ROTAS DO MARKETPLACE (PRODUTOS & PROTOCOLOS) ---

// 9. Listar produtos do catálogo
app.get('/api/products', async (req, res) => {
    try {
        if (supabase) {
            const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            return res.status(200).json({ success: true, products: data });
        } else {
            return res.status(200).json({ success: true, products: localProductsInMemory });
        }
    } catch (err) {
        console.error("Erro ao listar produtos:", err.message);
        res.status(500).json({ success: false, message: "Erro ao listar produtos do catálogo." });
    }
});

// 10. Cadastrar produto no catálogo (Apenas Admin)
app.post('/api/products', requireAdmin, async (req, res) => {
    const { name, description, priceBrl, priceAoa, imageUrl, originalStore, originalLink } = req.body;
    if (!name || priceBrl === undefined || priceAoa === undefined) {
        return res.status(400).json({ success: false, message: "Nome, preço em BRL e preço em AOA são obrigatórios." });
    }
    
    const newProduct = {
        name,
        description: description || "",
        price_brl: parseFloat(priceBrl),
        price_aoa: parseFloat(priceAoa),
        image_url: imageUrl || "",
        original_store: originalStore || "",
        original_link: originalLink || "",
        status: "available"
    };
    
    try {
        if (supabase) {
            const { data, error } = await supabase.from('products').insert([newProduct]).select();
            if (error) throw error;
            return res.status(201).json({ success: true, product: data[0] });
        } else {
            const localProduct = { id: Date.now(), ...newProduct, created_at: new Date().toISOString() };
            localProductsInMemory.unshift(localProduct);
            saveLocalProducts();
            return res.status(201).json({ success: true, product: localProduct });
        }
    } catch (err) {
        console.error("Erro ao cadastrar produto:", err.message);
        res.status(500).json({ success: false, message: "Erro ao cadastrar produto no catálogo." });
    }
});

// 11. Editar produto do catálogo (Apenas Admin)
app.put('/api/products/:id', requireAdmin, async (req, res) => {
    const { id } = req.params;
    const { name, description, priceBrl, priceAoa, imageUrl, originalStore, originalLink, status } = req.body;
    
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (priceBrl !== undefined) updateData.price_brl = parseFloat(priceBrl);
    if (priceAoa !== undefined) updateData.price_aoa = parseFloat(priceAoa);
    if (imageUrl !== undefined) updateData.image_url = imageUrl;
    if (originalStore !== undefined) updateData.original_store = originalStore;
    if (originalLink !== undefined) updateData.original_link = originalLink;
    if (status !== undefined) updateData.status = status;
    
    try {
        if (supabase) {
            const { data, error } = await supabase.from('products').update(updateData).eq('id', id).select();
            if (error) throw error;
            return res.status(200).json({ success: true, product: data[0] });
        } else {
            const idx = localProductsInMemory.findIndex(p => p.id === parseInt(id));
            if (idx !== -1) {
                localProductsInMemory[idx] = { ...localProductsInMemory[idx], ...updateData };
                saveLocalProducts();
                return res.status(200).json({ success: true, product: localProductsInMemory[idx] });
            } else {
                return res.status(404).json({ success: false, message: "Produto não encontrado." });
            }
        }
    } catch (err) {
        console.error("Erro ao editar produto:", err.message);
        res.status(500).json({ success: false, message: "Erro ao editar produto no catálogo." });
    }
});

// 12. Excluir produto do catálogo (Apenas Admin)
app.delete('/api/products/:id', requireAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        if (supabase) {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) throw error;
            return res.status(200).json({ success: true, message: "Produto excluído com sucesso." });
        } else {
            const idx = localProductsInMemory.findIndex(p => p.id === parseInt(id));
            if (idx !== -1) {
                localProductsInMemory.splice(idx, 1);
                saveLocalProducts();
                return res.status(200).json({ success: true, message: "Produto excluído com sucesso." });
            } else {
                return res.status(404).json({ success: false, message: "Produto não encontrado." });
            }
        }
    } catch (err) {
        console.error("Erro ao excluir produto:", err.message);
        res.status(500).json({ success: false, message: "Erro ao excluir produto." });
    }
});

// 13. Criar protocolo de cotação/compra (Público para Clientes)
app.post('/api/protocols', async (req, res) => {
    const { customerName, customerEmail, destination, products, initialNote } = req.body;
    
    if (!customerName || !customerEmail || !destination || !products) {
        return res.status(400).json({ success: false, message: "Campos Nome, E-mail, Destino e Itens da Sacola são obrigatórios." });
    }
    
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let part1 = "";
    let part2 = "";
    for (let i = 0; i < 4; i++) {
        part1 += chars.charAt(Math.floor(Math.random() * chars.length));
        part2 += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const protocolCode = `XODO-REQ-${part1}-${part2}`;
    
    const nowISO = new Date().toISOString();
    const newOrder = {
        trackingCode: protocolCode,
        customerName,
        customerEmail,
        destination,
        products: Array.isArray(products) ? products : products.split(',').map(p => p.trim()).filter(p => p !== ""),
        currentStage: 0,
        createdAt: nowISO,
        updatedAt: nowISO,
        history: [
            { stage: 0, title: "Protocolo de Pedido Gerado", description: initialNote || "Seu pedido de cotação foi enviado e está aguardando processamento e compra dos itens no Brasil pelo administrador.", timestamp: nowISO }
        ]
    };
    
    try {
        if (supabase) {
            const { error } = await supabase.from('orders').insert([toDb(newOrder)]);
            if (error) {
                console.error("Erro ao inserir protocolo no Supabase:", error);
                return res.status(500).json({ success: false, message: "Erro ao registrar protocolo no banco cloud." });
            }
        } else {
            localOrdersInMemory.unshift(newOrder);
            saveLocalOrders();
        }
        
        const emailResult = await triggerResendEmail(newOrder);
        res.status(201).json({ success: true, order: newOrder, emailNotification: emailResult });
    } catch (err) {
        console.error("Erro de execução no protocolo:", err.message);
        res.status(500).json({ success: false, message: "Erro ao processar protocolo." });
    }
});

// 8. Rota coringa para servir o Frontend SPA (index.html)
app.get('*', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'index.html'));
});

// Apenas escutar porta se rodando localmente (não no Vercel serverless worker)
if (process.env.NODE_ENV !== 'production' && require.main === module) {
    app.listen(PORT, () => {
        console.log(`\n🚀 Servidor Xodó da Pretinha Ativo: http://localhost:${PORT}`);
        console.log(`📁 DB Contingência Local: ${DATA_FILE}`);
        console.log(`🔑 Segredo JWT: ${JWT_SECRET.substring(0, 4)}***`);
        if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.startsWith('re_')) {
            console.log("🔑 Disparos de e-mail reais do Resend ATIVOS.");
        } else {
            console.log("⚠️ Disparos de e-mail reais do Resend DESATIVADOS (Simulador local).");
        }
        console.log("========================================================\n");
    });
}

// Exportar aplicativo Express para Vercel Serverless Functions
module.exports = app;
