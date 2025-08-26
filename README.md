# EasyPrice - Gestão Inteligente de Custos

Um aplicativo mobile minimalista, responsivo e intuitivo para cálculo e gestão de custos e preços de venda, desenvolvido no estilo visual da Apple com cards limpos, cores suaves e tipografia elegante.

## 🚀 Funcionalidades

### 🔐 Autenticação
- **Login** com email e senha
- **Cadastro** de nova conta
- **Login com Google** (OAuth)
- **Recuperação de senha**
- Sistema de autenticação seguro

### 📱 Telas Principais

#### 1. **Produtos Salvos**
- Lista de produtos cadastrados
- Cards com informações resumidas
- Ações de editar e excluir
- Ordenação por data de cadastro

#### 2. **Cadastro de Produto**
- Formulário intuitivo com cards
- Cálculo em tempo real de preços
- Suporte a custos adicionais
- Margem de lucro (percentual ou valor fixo)
- Cálculo automático de impostos
- Resumo detalhado do cálculo

#### 3. **Histórico de Cálculos**
- Lista de todos os cálculos realizados
- Formato de extrato financeiro
- Detalhamento completo ao tocar
- Ordenação cronológica

#### 4. **Perfil do Usuário**
- Informações da conta
- Configurações de privacidade
- Exportação de dados
- Backup e sincronização
- Ajuda e suporte

## 🎨 Design e UX

### **Estilo Visual**
- Design minimalista inspirado na Apple
- Cards com cantos arredondados
- Sombras sutis e elevação
- Cores suaves e harmoniosas
- Tipografia clean e legível

### **Elementos de Interface**
- Ícones consistentes (Ionicons)
- Espaçamento generoso entre elementos
- Feedback visual para ações
- Animações sutis e fluidas
- Compatível com modo claro e escuro

### **Paleta de Cores**
- **Primária**: #007AFF (Azul Apple)
- **Secundária**: #8E8E93 (Cinza)
- **Fundo**: #F2F2F7 (Cinza claro)
- **Texto**: #1C1C1E (Preto)
- **Destaque**: #FF3B30 (Vermelho para ações destrutivas)

## 🛠️ Tecnologias

- **React Native** - Framework mobile
- **Expo** - Plataforma de desenvolvimento
- **TypeScript** - Tipagem estática
- **Expo Router** - Navegação
- **AsyncStorage** - Armazenamento local
- **Ionicons** - Biblioteca de ícones

## 📱 Instalação e Uso

### **Pré-requisitos**
- Node.js 18+
- npm ou yarn
- Expo CLI
- Android Studio (para Android) ou Xcode (para iOS)

### **Instalação**
```bash
# Clone o repositório
git clone <repository-url>
cd easyprice

# Instale as dependências
npm install

# Inicie o projeto
npm start
```

### **Executar no Dispositivo**
```bash
# Para Android
npm run android

# Para iOS
npm run ios

# Para web
npm run web
```

## 📊 Estrutura do Projeto

```
easyprice/
├── app/
│   ├── (auth)/           # Telas de autenticação
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   └── forgot-password.tsx
│   ├── (app)/            # Telas principais
│   │   ├── products.tsx
│   │   ├── add-product.tsx
│   │   ├── calculations.tsx
│   │   └── profile.tsx
│   ├── _layout.tsx       # Layout principal
│   └── index.tsx         # Tela de entrada
├── contexts/
│   └── AuthContext.tsx   # Contexto de autenticação
├── types/
│   └── product.ts        # Tipos TypeScript
├── assets/               # Recursos estáticos
└── package.json
```

## 🔧 Configuração

### **Variáveis de Ambiente**
Crie um arquivo `.env` na raiz do projeto:
```env
EXPO_PUBLIC_API_URL=sua_api_url
EXPO_PUBLIC_GOOGLE_CLIENT_ID=seu_google_client_id
```

### **Configuração do Google OAuth**
1. Configure o projeto no Google Cloud Console
2. Adicione o Client ID no arquivo de configuração
3. Configure as URLs de redirecionamento

## 📱 Funcionalidades Futuras

- [ ] Sincronização em nuvem
- [ ] Backup automático
- [ ] Relatórios e análises
- [ ] Múltiplas moedas
- [ ] Histórico de preços
- [ ] Notificações de alterações
- [ ] Modo offline
- [ ] Temas personalizáveis

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

- **Email**: suporte@easyprice.com
- **Documentação**: [docs.easyprice.com](https://docs.easyprice.com)
- **Issues**: [GitHub Issues](https://github.com/easyprice/issues)

---

**EasyPrice** - Transformando a gestão de custos em uma experiência simples e elegante. 💰✨
