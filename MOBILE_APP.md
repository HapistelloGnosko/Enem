# Como gerar o APK do ENEM Quest para instalar direto nos celulares dos seus amigos

Isso é feito em 3 partes: **(1)** colocar o backend online, **(2)** apontar o app pra ele,
**(3)** gerar o APK com o Capacitor. Nenhuma etapa exige Play Store ou conta paga.

---

## Parte 1 — Colocar o backend na internet (Render, grátis)

Seus amigos vão abrir o app fora da sua rede, então o servidor precisa estar acessível
publicamente (não pode ser `localhost`).

1. Suba a pasta `backend/` para um repositório no GitHub (crie um repo novo e faça push).
2. Crie uma conta em https://render.com (dá pra logar com GitHub).
3. Clique em **New +** → **Web Service** → selecione o repositório.
4. Configure:
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Free
5. Em **Environment Variables**, adicione (opcional, mas recomendado):
   - `ALLOWED_ORIGINS` = (deixe em branco por enquanto — o app mobile já é liberado por padrão)
6. Clique em **Create Web Service** e espere o deploy terminar.
7. Copie a URL pública gerada, algo como:
   `https://enem-quest-backend.onrender.com`

**Importante sobre o plano grátis do Render:** o serviço "dorme" após alguns minutos sem uso
e demora ~30s pra acordar na primeira requisição. Além disso, o banco SQLite (`backend/data/enem-quest.db`)
é apagado a cada novo deploy (não é um disco persistente no plano free). Pra esse projeto entre
amigos isso tende a ser aceitável; se quiser dados permanentes de verdade, adicione um "Persistent Disk"
no Render (pago, a partir de US$1/mês) apontando para a pasta `backend/data`.

---

## Parte 2 — Apontar o app para o backend hospedado

1. Na pasta `frontend/`, copie `.env.example` para um novo arquivo chamado `.env.production`.
2. Preencha assim (usando a URL que você copiou no Render, com `/api` no final):
   ```
   VITE_API_URL=https://enem-quest-backend.onrender.com/api
   ```

---

## Parte 3 — Gerar o APK com Capacitor

Pré-requisito: instalar o **Android Studio** (gratuito): https://developer.android.com/studio
Ele já vem com o Java (JDK) e o Android SDK necessários.

Na pasta `frontend/`, rode na ordem:

```bash
npm install
npm run build:mobile
npm run cap:add:android
npm run cap:sync
npm run cap:open:android
```

O último comando abre o projeto Android no Android Studio automaticamente. Lá dentro:

1. Espere o Gradle terminar de sincronizar (barra de progresso embaixo).
2. Vá em **Build → Build Bundle(s) / APK(s) → Build APK(s)**.
3. Quando terminar, clique em **locate** no aviso que aparece (ou procure em
   `frontend/android/app/build/outputs/apk/debug/app-debug.apk`).
4. Esse arquivo `app-debug.apk` é o que você manda pros seus amigos (WhatsApp, Google Drive, etc).

### No celular de quem for instalar
Ao abrir o APK recebido, o Android vai bloquear por padrão. Basta:
1. Tocar em **Configurações** no aviso, ou ir manualmente em
   **Ajustes → Apps → Acesso especial → Instalar apps desconhecidos**.
2. Permitir para o app usado para abrir o arquivo (Chrome, WhatsApp, Arquivos, etc).
3. Tentar instalar de novo — vai funcionar normalmente.

---

## Toda vez que você atualizar o site e quiser gerar um novo APK

```bash
cd frontend
npm run build:mobile
npm run cap:sync
npm run cap:open:android
```
E repita o "Build APK(s)" no Android Studio.

---

## Se quiser trocar o nome/ícone do app depois
- Nome e ID do app: edite `frontend/capacitor.config.ts` (`appName` e `appId`).
- Ícone: use o pacote `@capacitor/assets` (`npx @capacitor/assets generate`) apontando pra uma
  imagem quadrada em alta resolução, ou troque manualmente os arquivos em
  `frontend/android/app/src/main/res/mipmap-*`.
