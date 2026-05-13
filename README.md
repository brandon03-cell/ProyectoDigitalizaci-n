# IKEA · Transformación Digital

Presentación web interactiva desarrollada como proyecto final del ciclo de **FP en Digitalización Empresarial** (curso 2025-2026). Analiza el proceso de transformación digital de IKEA desde sus bases estratégicas hasta su visión 2030, con especial atención a las tecnologías, el impacto en personas y la sostenibilidad.

**Autoría:** Alba Ruiz · Melissa Frida · Brandon David

---

## Estructura del proyecto

```
PROYECTO_DIGITALIZACIÓN/
├── index.html          — estructura y contenido de todas las diapositivas
├── style.css           — estilos, animaciones y diseño visual
├── main.js             — lógica de navegación, interacciones y efectos
└── multimedia/
    └── IkeaLogo.svg.png
```

---

## Uso

Abrir `index.html` directamente en el navegador. No requiere servidor ni dependencias locales.

> Recomendado: Chrome, Edge o Firefox en versión reciente. Optimizado para pantalla completa.

---

## Navegación

| Método | Acción |
|---|---|
| `↑` `↓` o `←` `→` | Diapositiva anterior / siguiente |
| `PageUp` / `PageDown` | Anterior / siguiente |
| `Espacio` | Siguiente |
| `Home` / `End` | Primera / última diapositiva |
| Rueda del ratón | Desplazamiento entre slides |
| Flechas en pantalla | Navegación con el cursor |
| Índice lateral | Salto directo a cualquier sección |
| Swipe vertical | En dispositivos táctiles |

---

## Contenido

| # | Título | Descripción |
|---|---|---|
| 00 | Portada | Animación de flotación, monograma SVG orbitante y datos de escala global |
| 01 | Contexto & Fases | Origen, catalizadores (pandemia, nueva CDO) y cuatro fases de transformación 2018→2025+ |
| 02 | Arquitectura tecnológica | Bento grid con IA (IKEA Kreativ), AR (IKEA Place), IoT (DIRIGERA), robótica, Big Data y cloud |
| 03 | Resultados FY24 | 45.000 M€ de facturación · +21% tráfico digital · ~30% cuota e-commerce · +45% visitas físicas |
| 04 | Core operativo | Hoja de ruta SAP S/4HANA (2022-2027) · Cloud híbrida AWS/Azure/privada · Workday HCM |
| 05 | Reskilling | 8.500 empleados reconvertidos · 30.000 en formación · nuevos perfiles digitales |
| 06 | Food is Precious | Iniciativa IoT + IA · -54% desperdicio alimentario · 36.000 t de CO₂ evitadas |
| 07 | Visión 2030 | Computación espacial · hogar conectado · IA agéntica · sostenibilidad por defecto |
| 08 | Cierre | Resumen conceptual y créditos |

---

## Stack técnico

- **HTML / CSS / JavaScript** — sin frameworks, sin dependencias de build
- **Tailwind CSS** — cargado vía CDN para utilidades puntuales
- **Google Fonts** — Fraunces (display), Space Grotesk (cuerpo), JetBrains Mono (monoespaciado)
- **SVG inline** — todos los iconos y gráficos son vectoriales nativos

---

## Easter eggs

El proyecto incluye varios elementos ocultos:

- Huella de gato en la portada y en la diapositiva de cierre — hacer clic
- Un gato cruza la pantalla por abajo cada 25-60 segundos
- La secuencia Konami (`↑ ↑ ↓ ↓ ← → ← →`) desencadena una lluvia de gatos
- Abrir la consola del navegador muestra un saludo ASCII
