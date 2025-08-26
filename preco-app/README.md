# Preço App

App mobile minimalista para cálculo e gestão de custos e preços de venda.

## Stack
- Expo + React Native (TypeScript)
- expo-router
- AsyncStorage
- expo-linear-gradient, @expo/vector-icons
- expo-haptics

## Rodar
```bash
npm install
npm run android # ou ios / web
```

Se usar Web, instale as deps web (já configurado): `react-dom`, `react-native-web`.

## Login com Google (placeholder)
- Implementado placeholder com `expo-auth-session`. Para ativar:
  - Crie credenciais OAuth (Android/iOS/Web) no Google Cloud.
  - Adicione os Client IDs e lógica em `app/index.tsx`.

## Cálculo
- Imposto aplicado sobre o preço final: `final = preTax / (1 - t)`.
- Resumo mostra: Preço base, Lucro (valor e %), Preço antes do imposto, Imposto, Preço final.

## Estilo
- Visual limpo tipo apps da Apple: cards, sombras sutis, cantos arredondados, tipografia de sistema, suporte claro/escuro.
- Haptics leves em ações (salvar, excluir). Animações suaves em listas.

