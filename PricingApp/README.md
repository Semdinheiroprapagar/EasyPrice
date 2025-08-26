# PricingApp

Um aplicativo mobile minimalista para cálculo e gestão de custos e preços de venda, desenvolvido com React Native e Expo, inspirado no design dos apps da Apple.

## 🎨 Design

- **Estilo Apple**: Design clean, minimalista e intuitivo
- **Cards e elementos limpos**: Layout organizado em cards com cantos arredondados
- **Cores suaves**: Paleta de cores harmoniosa com tons de destaque
- **Tipografia elegante**: Sistema tipográfico baseado no San Francisco da Apple
- **Modo claro e escuro**: Suporte completo a temas
- **Animações sutis**: Transições suaves entre telas e elementos

## ✨ Funcionalidades

### 🔐 Tela de Login
- Interface clean com gradiente suave
- Campos de entrada com design arredondado e sombras
- Botão de login com Google (OAuth simulado)
- Validação de formulário elegante
- Links para criar conta e recuperar senha

### 📊 Cadastro de Produto
- Layout em cards verticais minimalistas
- Upload de imagem do produto
- Campos para nome, custo base e percentual de imposto
- Sistema de custos adicionais expansível
- Seletor de margem de lucro (percentual ou valor fixo)
- **Cálculo em tempo real** do preço final
- Resumo detalhado do cálculo

### 📋 Produtos Salvos
- Lista de cards com informações do produto
- Miniatura da imagem, nome e preço destacado
- Informações resumidas (preço base, custos extras, data)
- Botões de editar e excluir
- Ordenação por data (mais recente primeiro)
- Animações suaves nas ações

### 📈 Lista de Cálculos
- Histórico completo de cálculos realizados
- Cards no formato de extrato financeiro
- Detalhamento completo ao tocar no card
- Modal com breakdown completo dos custos
- Visualização clara do preço final

### ⚙️ Configurações
- Alternador de tema (claro/escuro/sistema)
- Informações sobre o app
- Interface de configurações limpa

## 🛠️ Tecnologias

- **React Native** com **Expo**
- **TypeScript** para tipagem estática
- **React Navigation** para navegação
- **AsyncStorage** para persistência de dados
- **Expo Linear Gradient** para gradientes
- **Expo Image Picker** para seleção de imagens
- **React Native Vector Icons** para ícones

## 📱 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── ProductCard.tsx
│   ├── CalculationCard.tsx
│   └── ThemeToggle.tsx
├── context/            # Contextos React
│   ├── ThemeContext.tsx
│   └── DataContext.tsx
├── navigation/         # Configuração de navegação
│   └── AppNavigator.tsx
├── screens/           # Telas do aplicativo
│   ├── LoginScreen.tsx
│   ├── ProductFormScreen.tsx
│   ├── SavedProductsScreen.tsx
│   ├── CalculationsScreen.tsx
│   └── SettingsScreen.tsx
└── theme/            # Sistema de design
    ├── colors.ts
    ├── typography.ts
    ├── spacing.ts
    └── index.ts
```

## 🚀 Como executar

1. **Instalar dependências:**
   ```bash
   cd PricingApp
   npm install
   ```

2. **Executar o projeto:**
   ```bash
   # Para iOS (requer macOS)
   npm run ios
   
   # Para Android
   npm run android
   
   # Para Web
   npm run web
   ```

3. **Desenvolvimento:**
   - Use o Expo Go no seu dispositivo para testar
   - Escaneie o QR code que aparece no terminal
   - As alterações são refletidas em tempo real

## 📐 Cálculos

O app realiza cálculos precisos de preços seguindo a fórmula:

```
Custo Total = Custo Base + Custos Adicionais
Lucro = Custo Total × (Margem % / 100) OU Valor Fixo
Preço antes do Imposto = Custo Total + Lucro
Imposto = Preço antes do Imposto × (% Imposto / 100)
Preço Final = Preço antes do Imposto + Imposto
```

## 🎯 Características do Design

- **Espaçamento generoso** entre elementos
- **Cantos arredondados** em todos os componentes
- **Sombras sutis** para profundidade
- **Cores consistentes** com a identidade visual
- **Feedback visual** para todas as interações
- **Responsividade** para diferentes tamanhos de tela

## 📱 Compatibilidade

- **iOS** 11.0+
- **Android** API 21+
- **Web** (navegadores modernos)

## 🔮 Funcionalidades Futuras

- Integração com APIs de câmbio
- Exportação de relatórios
- Categorização de produtos
- Gráficos e análises
- Sincronização na nuvem
- Compartilhamento de cálculos

---

Desenvolvido com ❤️ usando React Native e Expo