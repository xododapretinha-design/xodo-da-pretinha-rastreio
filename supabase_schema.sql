-- ==========================================
-- SCRIPT DE BANCO DE DADOS: XODÓ DA PRETINHA
-- ==========================================
-- Execute este script no editor SQL (SQL Editor) do seu projeto Supabase.
-- Ele criará a tabela 'orders' com suporte a JSONB para histórico e produtos.

-- 1. Criar a tabela 'orders'
CREATE TABLE IF NOT EXISTS orders (
    tracking_code VARCHAR(50) PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    destination TEXT NOT NULL,
    products JSONB NOT NULL, -- Lista de itens encomendados
    current_stage INTEGER NOT NULL DEFAULT 1, -- Estágio atual (1 a 4)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    history JSONB NOT NULL DEFAULT '[]'::jsonb -- Histórico detalhado de mudanças de status
);

-- 2. Habilitar RLS (Row Level Security) - Opcional
-- Por segurança, o Supabase habilita RLS por padrão. Se desejar usar chaves anônimas padrão
-- para leitura direta do client sem autenticação complexa, você pode desabilitar o RLS
-- ou criar políticas adequadas. Como nossa API Node atua como middleware (intermediária),
-- o backend é quem fará as chamadas usando a chave secreta. Portanto, o acesso direto à tabela pode ser protegido.
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Política de leitura: Permitir leitura pública se você quiser consultar direto via JS (opcional)
-- CREATE POLICY "Permitir leitura pública de encomendas" ON orders FOR SELECT USING (true);

-- Política de acesso completo para o Service Role (backend):
-- O token de serviço/service_role já ignora o RLS por padrão, o que é ideal para o nosso server.js.


-- 3. Inserir Encomendas Iniciais de Exemplo (Seeds)
INSERT INTO orders (tracking_code, customer_name, customer_email, destination, products, current_stage, created_at, updated_at, history)
VALUES 
(
    'XODO-PT-101',
    'Maria Silva',
    'jutxica2202@gmail.com',
    'Luanda, Angola',
    '["Vestido Pretinha Glow (1)", "Brincos Afroroot (2)", "Acessório Turbante Seda (1)"]'::jsonb,
    2,
    '2026-06-01 10:30:00+00',
    '2026-06-09 14:38:42+00',
    '[
      {
        "stage": 2,
        "title": "Status alterado para Empacotamento",
        "description": "Sua encomenda está sendo cuidadosamente embalada, perfumada e preparada para transporte de longa distância, garantindo total segurança física dos itens.",
        "timestamp": "2026-06-09T14:38:42.890Z"
      },
      {
        "stage": 4,
        "title": "Dados Cadastrais Modificados",
        "description": "Informações cadastrais da encomenda foram atualizadas no sistema.",
        "timestamp": "2026-06-09T14:38:38.240Z"
      },
      {
        "stage": 4,
        "title": "Status alterado para Disponível em Angola",
        "description": "Sua encomenda chegou em solo angolano! O produto já está disponível para retirada no nosso ponto de distribuição ou em trânsito para entrega ao cliente.",
        "timestamp": "2026-06-09T14:25:22.102Z"
      },
      {
        "stage": 3,
        "title": "Despachado para Luanda",
        "description": "A carga foi colocada em trânsito aéreo pelo voo DT-652 da TAAG com destino ao Aeroporto 4 de Fevereiro em Luanda. Previsão de chegada em 48h.",
        "timestamp": "2026-06-08T09:00:00"
      },
      {
        "stage": 2,
        "title": "Empacotamento Concluído",
        "description": "Sua encomenda foi embalada com amor, envolvida em plástico bolha protetor e selada com a nossa fragrância premium Pretinha.",
        "timestamp": "2026-06-03T14:15:00"
      },
      {
        "stage": 1,
        "title": "Aquisição e Verificação",
        "description": "Produtos adquiridos dos fornecedores selecionados. Passou pelo controle de qualidade e foi encaminhado para o setor de embalagens.",
        "timestamp": "2026-06-01T10:30:00"
      }
    ]'::jsonb
),
(
    'XODO-PT-102',
    'Anacleto Neto',
    'anacleto@exemplo.com',
    'Benguela, Angola',
    '["Camisa Afro-Fashion Masculina (1)", "Sandálias de Couro Pretinha (1)"]'::jsonb,
    1,
    '2026-06-09 08:30:00+00',
    '2026-06-09 08:30:00+00',
    '[
      {
        "stage": 1,
        "title": "Aquisição Iniciada",
        "description": "Os itens foram selecionados e estamos aguardando a chegada no armazém central para conferência de tamanho e cor.",
        "timestamp": "2026-06-09T08:30:00"
      }
    ]'::jsonb
)
ON CONFLICT (tracking_code) DO NOTHING;
