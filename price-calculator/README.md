# PriceCalc - Aplicativo de Gestão de Preços

Um aplicativo mobile minimalista para cálculo e gestão de custos e preços de venda, desenvolvido com React Native e Expo, seguindo o estilo visual dos apps da Apple.

## 🚀 Características

- **Design Minimalista**: Interface clean com cards e elementos limpos, cores suaves e tipografia elegante
- **Modo Claro/Escuro**: Suporte completo para temas claro e escuro
- **Cálculo em Tempo Real**: Visualização instantânea do preço final enquanto você ajusta os valores
- **Gestão Completa**: Salve, edite e exclua produtos com facilidade
- **Histórico de Cálculos**: Acompanhe todos os cálculos realizados

## 📱 Telas

### 1. Login
- Design clean com gradiente suave
- Autenticação por email/senha
- Login com Google (OAuth)
- Links para criar conta e recuperar senha

### 2. Cadastro de Produto
- Upload de imagem do produto
- Campos para custo, imposto e margem de lucro
- Adição de custos extras
- Cálculo automático do preço final
- Resumo detalhado do cálculo

### 3. Produtos Salvos
- Lista de cards com informações resumidas
- Ações de editar e excluir
- Ordenação por data (mais recente primeiro)
- Animações suaves

### 4. Lista de Cálculos
- Histórico completo de cálculos
- Visualização em formato de extrato
- Detalhamento ao tocar no card
- Informações de custo, lucro, imposto e preço final

## 🛠️ Tecnologias

- **React Native** com **Expo**
- **React Navigation** para navegação
- **AsyncStorage** para persistência de dados
- **Expo Image Picker** para seleção de imagens
- **React Native Reanimated** para animações
- **Context API** para gerenciamento de estado

## 📦 Instalação

1. Clone o repositório:
```bash
cd price-calculator
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o projeto:
```bash
npm start
```

## 📲 Como usar

### Para testar no dispositivo:

1. Instale o app **Expo Go** no seu celular (disponível na App Store e Google Play)
2. Execute `npm start` no terminal
3. Escaneie o QR Code que aparecerá no terminal ou navegador
4. O app será carregado no seu dispositivo

### Para testar no emulador:

**Android:**
```bash
npm run android
```

**iOS (apenas macOS):**
```bash
npm run ios
```

**Web (preview):**
```bash
npm run web
```

## 🎨 Características do Design

- **Tipografia**: Sistema de fontes nativo (San Francisco no iOS, Roboto no Android)
- **Cores**: Paleta suave com tons de azul como cor primária e laranja como secundária
- **Espaçamento**: Generoso para melhor legibilidade
- **Sombras**: Sutis para dar profundidade aos cards
- **Animações**: Transições suaves entre telas e interações
- **Responsividade**: Adaptado para diferentes tamanhos de tela

## 🔧 Estrutura do Projeto

```
price-calculator/
├── App.js                    # Componente principal
├── src/
│   ├── contexts/            # Context providers (Auth, Theme, Data)
│   ├── screens/             # Telas do aplicativo
│   │   ├── LoginScreen.js
│   │   ├── ProductFormScreen.js
│   │   ├── ProductsScreen.js
│   │   └── CalculationsScreen.js
│   └── navigation/          # Configuração de navegação
│       └── AppNavigator.js
```

## 📝 Funcionalidades Principais

### Cálculo de Preços
- **Custo Base**: Valor inicial do produto
- **Custos Adicionais**: Despesas extras (frete, embalagem, etc.)
- **Margem de Lucro**: Percentual ou valor fixo
- **Imposto**: Calculado sobre o valor final
- **Preço Final**: Resultado automático

### Fórmula de Cálculo
```
Custo Total = Custo Base + Custos Adicionais
Lucro = Custo Total × (Margem% / 100) ou Valor Fixo
Preço antes do Imposto = Custo Total + Lucro
Preço Final = Preço antes do Imposto / (1 - (Imposto% / 100))
```

## 🔐 Autenticação

O app possui um sistema de autenticação simulado. Em produção, você deve:
1. Implementar uma API backend real
2. Configurar OAuth do Google com suas credenciais
3. Adicionar validação e segurança adequadas

## 📱 Compatibilidade

- iOS 13.0+
- Android 5.0+
- Web (preview)

## 🚀 Próximos Passos para Produção

1. Configurar backend real com API
2. Implementar autenticação OAuth completa
3. Adicionar backup na nuvem
4. Implementar notificações push
5. Adicionar análises e relatórios
6. Publicar nas lojas (App Store e Google Play)

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais e demonstração.