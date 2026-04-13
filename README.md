# Maravilla Smart Portfolio - Frontend

Frontend del sistema de portafolio inteligente Maravilla, una plataforma que permite gestionar y visualizar portafolios de inversion de forma inteligente.

## Tecnologias

- **React 19** — libreria de UI
- **TypeScript** — tipado estatico
- **Vite** — bundler y servidor de desarrollo
- **Tailwind CSS v4** — estilos utilitarios
- **shadcn/ui** — componentes de UI accesibles y personalizables
- **React Router v7** — enrutamiento del lado del cliente

## Desarrollo

Instala las dependencias:

```bash
npm install
```

Arranca el servidor de desarrollo:

```bash
npm run dev
```

La aplicacion estara disponible en `http://localhost:5173`.

## Configuracion API

1. Crea archivo de entorno local:

```bash
cp .env.example .env
```

2. Ajusta la URL del backend:

```env
VITE_API_BASE_URL=http://127.0.0.1:8001
```

## Flujos implementados

- Registro: `/register` -> `/quiz` -> `/quiz-result` -> `/`
- Login: `/login` -> `/`
- Ruta autenticada con JWT (access + refresh)

## Scripts disponibles

| Script | Descripcion |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Build de produccion |
| `npm run preview` | Preview del build de produccion |
| `npm run lint` | Analisis estatico del codigo |
